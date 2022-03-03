export const getDefaultSenderAssetType = (senderAssetTypeOptions, state = null) => {
  if (!state) return senderAssetTypeOptions[0];
  const identicalAsset = senderAssetTypeOptions.find(option => option.assetId === state.senderAssetType.assetId);
  if (identicalAsset) {
    return identicalAsset;
  }
  return senderAssetTypeOptions[0];
};

export const getDefaultPublicReceiver = (state) => {
  if (state.senderPublicAccountOptions?.length) {
    return state.senderPublicAccountOptions[0].address;
  }
};

export const getDefaultPrivateReceiver = () => {
  return 'A7dm3...pcME339'; // placeholder
};
