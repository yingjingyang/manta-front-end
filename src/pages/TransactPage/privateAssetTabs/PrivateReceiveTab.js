import React, { useState, useEffect } from 'react';
import Button from 'components/elements/Button';
import Svgs from 'resources/icons';
import { useSubstrate } from 'contexts/substrateContext';
import { SignerInterface, BrowserAddressStore } from 'signer-interface';
import { showError } from 'utils/ui/Notifications';
import config from 'config';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';

const PrivateReceiveTab = () => {
  const { api } = useSubstrate();
  const [currentAddress, setCurrentAddress] = useState(null);
  const { selectedAssetType } = useSelectedAssetType();

  useEffect(() => {
    setCurrentAddress(null);
  }, [selectedAssetType]);

  const onClickNewAddress = async () => {
    const signerInterface = new SignerInterface(
      api,
      new BrowserAddressStore(config.BIP_44_COIN_TYPE_ID)
    );
    const signerIsConnected = await signerInterface.signerIsConnected();
    if (!signerIsConnected) {
      showError('Open Manta Signer desktop app and sign in to continue');
      return;
    }
    try {
      const newAddress = await signerInterface.generateNextExternalAddress(
        selectedAssetType.assetId
      );
      setCurrentAddress(newAddress);
    } catch (error) {
      showError('Error getting next address');
    }
  };

  const currentAddressString = currentAddress && `${currentAddress.toString()}`;

  return (
    <div className="receive-content">
      {currentAddress && (
        <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      )}
      <div className="py-2">
        {currentAddress && (
          <div className="flex pb-4 pt-2 px-2 items-center text-xl">
            <img className="pr-2" src={Svgs.WalletIcon} alt="setting-icon" />
            <span className="text-lg wrap-text manta-gray">
              {currentAddressString}
            </span>
          </div>
        )}
      </div>
      <Button
        onClick={onClickNewAddress}
        className="btn-primary w-full btn-hover text-lg py-3"
      >
        New address
      </Button>
    </div>
  );
};

export default PrivateReceiveTab;
