// @ts-nocheck
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import { usePrivateWallet } from './privateWalletContext';
import { showError, showSuccess } from 'utils/ui/Notifications';
import PropTypes from 'prop-types';
import { create } from "ipfs-http-client";


const NftContext = createContext();

const IPFS_URL = "https://ipfs.io/ipfs/";

export const NftContextProvider = (props) => {

  const { sdk } = usePrivateWallet();

  const [ipfsClient, setIpfsClient] = useState(null);
  const [allNFTs, setAllNFTS] = useState([]);
  const [currentlyFetching,setCurrentlyFetching] = useState(false);

  /*
  useEffect(async () => {

    const fetchAllNFTs = async () => {

      const nextCollectionId = await sdk.api.query.uniques.nextCollectionId();

      if (nextCollectionId == "0") return;

      let ownedNFTs = [];

      for (let i = 0; i < nextCollectionId; i++) {

        const collectionItems = await getAllNFTsForCollection(i);
        /// @TODO: check if collectionItems is empty or not.

        

        setAllNFTS([])


      }


      setCurrentlyFetching(false);
    }


    if (sdk && !currentlyFetching) {
      setCurrentlyFetching(true);
      await fetchAllNFTs();
    }

  },[sdk]);

  */

  useEffect(async () => {

    const projectId = "2IU3wF36dnWAd9Gz7ey7TfyUJTa";
    const projectSecret = "990b2955dca4f42822ddc53c1769874f";
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const client = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: '/api/v0',
      headers: {
        authorization: auth,
    },
    });
    setIpfsClient(client);

  },[]);

  /// creates a new collection, broadcasts the collectionId.
  const createCollection = async () => {

    if (!sdk) {
      console.log("SDK not initialized yet.")
      return;
    }
    try {

      const collectionId = await sdk.createCollection();

      console.log("NFT Collection created with CollectionID: ", collectionId);
      showSuccess({},"Collection ID: "+collectionId);

    } catch (e) {
      console.error(e)
      showError({},"Failed to create NFT collection");
    }
  }

  /// Mints a new NFT, broadcasts the NFT AssetId.
  /// Sets the metadata for the NFT to an IPFS CID.
  const mintNFT = async (collectionId, itemId, address="", metadata) => {
    if (!sdk) {
      console.log("SDK not initialized yet.")
      return;
    }
    try {

      const IPFS_CID = await uploadToIpfs(metadata);
      console.log("Successfully Uploaded to IPFS at " + IPFS_URL+IPFS_CID);
      const assetId = await sdk.mintNFTAndSetMetadata(collectionId,itemId,address,IPFS_CID);
      showSuccess({},"AssetID: " + assetId);
      console.log("NFT created with AssetID: ", assetId);
    } catch (e) {
      console.error(e)
      showError({},"Failed to create NFT");
    }
  }

  const uploadToIpfs = async (file) => {
    try {
      const created = await ipfsClient.add({ content: file });
      return created.path;   
    } catch (e) {
      console.log("Unable to upload image to IPFS");
      console.error(e);
    }
  }

  const getAllNFTsForCollection = async (collectionId) => {
    try {
      const allNFTs = await sdk.viewAllNFTsInCollection(collectionId);
      return allNFTs;
    } catch (e) {
      console.log("Unable to get all NFTs for the Collection ID: ", collectionId);
      console.error(e);
    }
  }

  const value = {
    createCollection,
    mintNFT
  };

  return (
  <NftContext.Provider value={value}>
    {props.children}
  </NftContext.Provider>
  );
};

NftContext.propTypes = {
  children: PropTypes.any
};

export const useNft = () => ({ ...useContext(NftContext) });