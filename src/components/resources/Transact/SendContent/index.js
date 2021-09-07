import React from 'react';
import Button from 'components/elements/Button';
import Svgs from 'resources/Svgs';
import FormSelect from 'components/elements/Form/FormSelect';
import FormInput from 'components/elements/Form/FormInput';

const SendContent = () => {
  return (
    <div className="send-content">
      <div className="py-2">
        <FormSelect label="Token" coinIcon={Svgs.TokenIcon} />
        <FormInput>Available: 100 DOT</FormInput>
      </div>
      <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      <div className="py-2">
        <FormInput
          value="0xa016f295a5957...00AdX24"
          prefixIcon={Svgs.WalletIcon}
          isMax={false}
          type="text"
        >
          Will receive: 14 DOT
        </FormInput>
      </div>
      <div className="flex text-sm py-1.5 justify-between">
        <span className="manta-gray">Total Pool Value</span>
        <span className="manta-prime-blue font-semibold">750,809,324 DOT</span>
      </div>
      <div className="flex text-sm py-1.5 justify-between">
        <span className="manta-gray">Total MA Circulation</span>
        <span className="manta-prime-blue font-semibold">750,809,324 MA</span>
      </div>
      <div className="flex text-sm py-1.5 pb-6 justify-between">
        <span className="manta-gray">Redemption Value per MA</span>
        <span className="manta-prime-blue font-semibold">0.749293 MA</span>
      </div>
      <Button className="btn-primary btn-hover w-full text-lg py-3">
        Send
      </Button>
    </div>
  );
};

export default SendContent;
