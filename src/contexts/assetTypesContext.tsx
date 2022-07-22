// @ts-nocheck
import { config } from 'process';
import React, {
  createContext,
  useEffect,
  useContext,
  useState
} from 'react';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';
import { useSubstrate } from './substrateContext';

const AssetTypesContext = createContext();

export const AssetTypesContextProvider = (props) => {
  const { api } = useSubstrate();
  const [assetTypes, setAssetTypes] = useState([]);

  useEffect(() => {
    if (!api || assetTypes.length) {
      return;
    }
    const getAssetTypes = async () => {
      await api.isReady;
      const assetMetadataEntries = await api.query.assetManager.assetIdMetadata.entries();
      const assetTypes = assetMetadataEntries
        .map(entry => AssetType.fromMetadata(entry[1]))
        .filter(assetType => config.ALLOWED_ASSET_TYPES.contains(assetType.assetId));
      setAssetTypes(assetTypes);
    };
    getAssetTypes();
  }, [api]);


  const value = { assetTypes };

  return (
    <AssetTypesContext.Provider value={value}>
      {props.children}
    </AssetTypesContext.Provider>
  );
};

AssetTypesContextProvider.propTypes = {
  children: PropTypes.any,
};

export const useAssetTypes = () => ({
  ...useContext(AssetTypesContext),
});
