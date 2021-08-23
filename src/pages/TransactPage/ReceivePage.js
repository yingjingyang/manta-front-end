import React, { useState } from 'react';
import Button from 'components/elements/Button';
import Images from 'common/Images';
import FormSelect from 'components/elements/Form/FormSelect';
import { useSigner } from 'contexts/SignerContext';

const ReceivePage = () => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const signerClient = useSigner();
  const onClickNewAddress = async () => {
    const newAddress = await signerClient.generateNextExternalAddress();
    setCurrentAddress(newAddress);
  };

  const currentAddressString = currentAddress && `${currentAddress.toString().slice(0, 32)}...`;


  return (
    <div className="receive-content">
      <div className="py-2">
        <FormSelect label="Token" coinIcon={Images.TokenIcon} />
      </div>
      {currentAddress &&
        <img className="mx-auto" src={Images.ArrowDownIcon} alt="switch-icon" />
      }
      <div className="py-2">
        {currentAddress &&
          <div className="flex pb-4 pt-2 px-2 items-center text-xl">
            <img className="pr-2" src={Images.WalletIcon} alt="setting-icon" />
            <span className="text-lg manta-gray">{currentAddressString}</span>
          </div>
        }
      </div>
      <Button onClick={onClickNewAddress} className="btn-primary w-full btn-hover text-lg py-3">New address</Button>
    </div>
  );
};

export default ReceivePage;
