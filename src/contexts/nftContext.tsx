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

const NftContext = createContext();

export const NftContextProvider = (props) => {

  const { sdk } = usePrivateWallet();


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

      const assetId = await sdk.mintNFT(collectionId,itemId,address);

      // @TODO: upload metadata of image to IPFS

      // ex: https://ipfs.io/ipfs/QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE
      const IPFS_CID = "QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE";
      await sdk.updateNFTMetadata(collectionId,itemId,IPFS_CID);

      showSuccess({},"AssetID: " + assetId);
      console.log("NFT created with AssetID: ", assetId);
    } catch (e) {
      console.error(e)
      showError({},"Failed to create NFT");
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