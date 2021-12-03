import React, { useState, useCallback } from 'react';

import { useTxStatus } from 'contexts/txStatusContext';
import AssetType from 'types/AssetType';
import { PageContent, Navbar } from 'components/elements/Layouts';
import Button from 'components/elements/Button';
import Svgs from 'resources/icons';
import FormSelect from 'components/elements/Form/FormSelect';
import FormInput from 'components/elements/Form/FormInput';

const SwapPage = () => {
  const { txStatus } = useTxStatus();
  const [fromAssetType, setFromAssetType] = useState(null);
  const [toAssetType, setToAssetType] = useState(null);
  const [fromSwapAmount, setFromSwapAmount] = useState('');
  const [toSwapAmount, setToSwapAmount] = useState('');
  const [slippage, setSlippage] = useState(0.1);
  const [showSlippagePopup, setShowSlippagePopup] = useState(false);

  const onClickMax = useCallback(() => {
    setFromSwapAmount(100);
  }, [setFromSwapAmount]);

  const handleSwapType = useCallback(() => {
    const from = fromAssetType;
    setFromAssetType(toAssetType);
    setToAssetType(from);
  }, [fromAssetType, toAssetType, setFromAssetType, setToAssetType]);

  const slippagePopup = () => {
    return (
      <div className="absolute -left-44 bg-fourth px-6 py-4 w-80 top-6 rounded-lg z-50">
        <h2 className="relative text-xl text-accent font-semibold">
          Transaction Settings
          <img
            className="absolute right-0 top-0 cursor-pointer"
            src={Svgs.CloseIcon}
            onClick={() => setShowSlippagePopup(false)}
          />
        </h2>
        <div>
          <h3 className="mt-3 text-base font-semibold text-accent">
            Slippage Tolerance
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div
              className={`w-10 h-10 flex items-center justify-center text-accent rounded-md ${
                slippage === 0.1 ? 'bg-primary' : 'bg-secondary'
              } cursor-pointer hover:bg-primary`}
              onClick={() => setSlippage(0.1)}
            >
              0.1%
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center text-accent rounded-md ${
                slippage === 0.5 ? 'bg-primary' : 'bg-secondary'
              } cursor-pointer hover:bg-primary`}
              onClick={() => setSlippage(0.5)}
            >
              0.5%
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center text-accent rounded-md ${
                slippage === 1 ? 'bg-primary' : 'bg-secondary'
              } cursor-pointer hover:bg-primary`}
              onClick={() => setSlippage(1)}
            >
              1%
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center text-accent rounded-md ${
                slippage === 2 ? 'bg-primary' : 'bg-secondary'
              } cursor-pointer hover:bg-primary`}
              onClick={() => setSlippage(2)}
            >
              2%
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContent>
      <Navbar />
      <div className="flex justify-center pt-20 lg:pt-8 pb-4">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <div>
            <span
              className="flex space-between pb-1"
              style={{ 'justify-content': 'space-between' }}
            >
              <h1 className="text-2xl font-semibold text-accent">
                Swap (coming soon)
              </h1>
              <span className="flex">
                <img
                  className="pr-2 cursor-pointer w-7"
                  src={Svgs.SettingIcon}
                  alt="setting-icon"
                  onClick={() => setShowSlippagePopup(!showSlippagePopup)}
                />
                <div className="text-sm manta-gray relative pt-2">
                  Slippage: {slippage}%{showSlippagePopup && slippagePopup()}
                </div>
              </span>
            </span>
          </div>
          <div className="py-2">
            <FormSelect
              selectedOption={fromAssetType}
              setSelectedOption={setFromAssetType}
              options={AssetType.AllCurrencies(true)}
              disabled={txStatus?.isProcessing()}
            />
            <FormInput
              value={fromSwapAmount}
              onChange={(e) => setFromSwapAmount(e.target.value)}
              onClickMax={onClickMax}
              type="number"
            ></FormInput>
          </div>
          <img
            className="mx-auto cursor-pointer"
            src={Svgs.SwitchIcon}
            alt="switch-icon"
            onClick={handleSwapType}
          />
          <div className="py-2 pb-4">
            <FormSelect
              selectedOption={toAssetType}
              setSelectedOption={setToAssetType}
              options={AssetType.AllCurrencies(true)}
              disabled={txStatus?.isProcessing()}
            />
            <FormInput
              value={toSwapAmount}
              onChange={(e) => setToSwapAmount(e.target.value)}
              type="number"
              isDisabled={true}
            ></FormInput>
          </div>
          <Button className="btn-primary w-full text-lg py-3" disabled>
            Swap
          </Button>
        </div>
      </div>
    </PageContent>
  );
};

export default SwapPage;
