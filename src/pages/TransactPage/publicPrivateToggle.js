import React from 'react';
import PropTypes from 'prop-types';
import FormSwitch from 'components/elements/Form/FormSwitch';
import { useTxStatus } from 'contexts/txStatusContext';

const PublicPrivateToggle = ({
  selectedAssetIsPrivate,
  setSelectedAssetIsPrivate,
}) => {
  const { txStatus } = useTxStatus();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <span className="manta-gray text-xl pr-8 text-accent">Public 🏖 </span>
      <FormSwitch
        checked={selectedAssetIsPrivate}
        onChange={(e) => setSelectedAssetIsPrivate(e.target.checked)}
        disabled={txStatus?.isProcessing()}
        name={'PublicPrivateToggle'}
      />
      <span className="manta-gray text-lg pl-8 text-accent"> 🤿 Private </span>
    </div>
  );
};

PublicPrivateToggle.propTypes = {
  selectedAssetIsPrivate: PropTypes.bool,
  setSelectedAssetIsPrivate: PropTypes.func,
};

export default PublicPrivateToggle;
