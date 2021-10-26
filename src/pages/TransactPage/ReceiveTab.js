import React, { useState } from 'react';
import Button from 'components/elements/Button';
import Svgs from 'resources/icons';
import FormSelect from 'components/elements/Form/FormSelect';
import CurrencyType from 'types/ui/CurrencyType';
import { useSubstrate } from 'contexts/SubstrateContext';
import SignerInterface from 'manta-signer-interface';
import { BrowserAddressStore } from 'manta-signer-interface';
import { showError } from 'utils/ui/Notifications';

const ReceiveTab = () => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const { api } = useSubstrate();

  const onClickNewAddress = async () => {
    const signerInterface = new SignerInterface(api, new BrowserAddressStore());
    const signerIsConnected = await signerInterface.signerIsConnected();
    if (!signerIsConnected) {
      showError('Manta Signer must be connected');
      return;
    }
    const newAddress = await signerInterface.generateNextExternalAddress(
      selectedAssetType.assetId
    );
    setCurrentAddress(newAddress);
  };

  const currentAddressString = currentAddress && `${currentAddress.toString()}`;

  return (
    <div className="receive-content">
      <div className="py-2">
        <FormSelect
          selectedOption={selectedAssetType}
          setSelectedOption={setSelectedAssetType}
          options={CurrencyType.AllCurrencies()}
        />
      </div>
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

export default ReceiveTab;
