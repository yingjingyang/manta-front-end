import React, { useState } from 'react';
import Button from 'components/elements/Button';
import Svgs from 'resources/Svgs';
import FormSelect from 'components/elements/Form/FormSelect';
import { useSigner } from 'contexts/SignerContext';
import CurrencyType from 'types/ui/CurrencyType';

const ReceiveTab = () => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);

  const signerClient = useSigner();
  const onClickNewAddress = async () => {
    const newAddress = await signerClient.generateNextExternalAddress(
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
            <span className="text-lg manta-gray">{currentAddressString}</span>
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
