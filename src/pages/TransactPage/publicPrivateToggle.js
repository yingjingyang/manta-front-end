import React from 'react';
import FormSwitch from 'components/elements/Form/FormSwitch';
import { useTxStatus } from 'contexts/txStatusContext';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';

const PublicPrivateToggle = () => {
  const { txStatus } = useTxStatus();
  const { selectedAssetType, toggleSelectedAssetTypePrivacy } =
    useSelectedAssetType();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <span className="manta-gray text-xl pr-8 text-accent">Public 🏖 </span>
      <FormSwitch
        checked={selectedAssetType.isPrivate}
        onChange={toggleSelectedAssetTypePrivacy}
        disabled={txStatus?.isProcessing()}
        name={'PublicPrivateToggle'}
      />
      <span className="manta-gray text-lg pl-8 text-accent"> 🤿 Private </span>
    </div>
  );
};

export default PublicPrivateToggle;
