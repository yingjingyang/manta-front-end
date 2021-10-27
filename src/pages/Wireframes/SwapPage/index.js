import React from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import Button from 'components/elements/Button';
import Svgs from 'resources/icons';
import FormSelect from 'components/elements/Form/FormSelect';
import FormInput from 'components/elements/Form/FormInput';

const SwapPage = () => {
  return (
    <PageContent>
      <Navbar />
      <div className="flex h-full justify-center pt-20 pb-4 lg:py-0">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold text-accent">Swap</h1>
            <div className="text-sm manta-gray">
              <span className="flex pb-1">
                <img
                  className="pr-2 pl-4"
                  src={Svgs.SettingIcon}
                  alt="setting-icon"
                />
                Slippage: 18%
              </span>
              <span>Gas price: 134 GWEI</span>
            </div>
          </div>
          <div className="py-2">
            <FormSelect label="From" coinIcon={Svgs.TokenIcon} />
            <FormInput step="0.01">Available: 100 DOT</FormInput>
          </div>
          <img className="mx-auto" src={Svgs.SwitchIcon} alt="switch-icon" />
          <div className="py-2 pb-4">
            <FormSelect label="To" coinIcon={Svgs.CoinIcon} />
            <FormInput step="0.01" isMax={false}>
              1 DOT = 0.00332 Matic
            </FormInput>
          </div>
          <Button className="btn-primary w-full text-lg btn-hover py-3">
            Swap
          </Button>
        </div>
      </div>
      <div className="hidden lg:block h-10" />
    </PageContent>
  );
};

export default SwapPage;
