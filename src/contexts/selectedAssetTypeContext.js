import React, { createContext, useState, useContext } from 'react';
import AssetType from 'types/AssetType';
import PropTypes from 'prop-types';


const SelectedAssetTypeContext = createContext();

export const SelectedAssetTypeContextProvider = (props) => {
  const DEFAULT_PUBLIC_ASSET_TYPE = AssetType.Polkadot();
  const DEFAULT_PRIVATE_ASSET_TYPE = AssetType.Polkadot(true);

  const [selectedAssetType, setSelectedAssetType] = useState(
    DEFAULT_PUBLIC_ASSET_TYPE
  );

  const toggleSelectedAssetTypePrivacy = () => {
    if (selectedAssetType.isPrivate) {
      setSelectedAssetType(selectedAssetType.toPublic());
      // there is no private equivalent for native token
    } else if (selectedAssetType.isNativeToken) {
      setSelectedAssetType(DEFAULT_PRIVATE_ASSET_TYPE);
    } else {
      setSelectedAssetType(selectedAssetType.toPrivate());
    }
  };

  const value = {
    selectedAssetType: selectedAssetType,
    setSelectedAssetType: setSelectedAssetType,
    toggleSelectedAssetTypePrivacy: toggleSelectedAssetTypePrivacy
  };

  return (
    <SelectedAssetTypeContext.Provider value={value}>
      {props.children}
    </SelectedAssetTypeContext.Provider>
  );
};

SelectedAssetTypeContextProvider.propTypes = {
  children: PropTypes.element
};

export const useSelectedAssetType = () => ({
  ...useContext(SelectedAssetTypeContext)
});
