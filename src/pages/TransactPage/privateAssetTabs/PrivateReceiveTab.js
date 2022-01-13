import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from 'components/elements/Button';
import Svgs from 'resources/icons';
import { useSubstrate } from 'contexts/substrateContext';
import { SignerInterface } from 'signer-interface';
import { showError } from 'utils/ui/Notifications';
import { useSelectedAssetType } from 'contexts/selectedAssetTypeContext';
import signerInterfaceConfig from 'config/signerInterfaceConfig';

const PrivateReceiveTab = () => {
  const { api } = useSubstrate();
  const { selectedAssetType } = useSelectedAssetType();
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressCopied, setAddressCopied] = useState(false);

  const currentAddressString = currentAddress && `${currentAddress.toString()}`;

  useEffect(() => {
    let interval;
    if (addressCopied) {
      interval = setInterval(() => {
        setAddressCopied(false);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [addressCopied]);

  useEffect(() => {
    setCurrentAddress(null);
  }, [selectedAssetType]);

  const onClickNewAddress = async () => {
    const signerInterface = new SignerInterface(api, signerInterfaceConfig);

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentAddressString);
    setAddressCopied(true);
  };

  return (
    <div className="receive-content">
      {currentAddress && (
        <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      )}
      <div className="py-2">
        {currentAddress && (
          <div className="flex pb-4 pt-2 px-2 items-center text-xl">
            <img className="pr-2" src={Svgs.WalletIcon} alt="setting-icon" />
            {addressCopied ? (
              <span className="text-lg wrap-text text-primary text-center flex-grow h-28 flex justify-center items-center -ml-5">
                <FontAwesomeIcon
                  icon={faCheck}
                  color="#24A148"
                  className="mr-1"
                />
                Address copied to clipboard
              </span>
            ) : (
              <span
                className="text-lg wrap-text manta-gray cursor-pointer underline h-28"
                onClick={handleCopyToClipboard}
              >
                {currentAddressString}
              </span>
            )}
          </div>
        )}
      </div>
      <Button
        onClick={onClickNewAddress}
        className="btn-primary w-full btn-hover text-lg py-3"
      >
        New private address
      </Button>
    </div>
  );
};

export default PrivateReceiveTab;
