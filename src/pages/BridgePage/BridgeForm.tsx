// @ts-nocheck
import React from 'react';
import ChainSelect from 'pages/BridgePage/ChainSelect';
import SendButton from 'pages/BridgePage/SendButton';
import Svgs from 'resources/icons';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import BridgeAssetSelect from './BridgeAssetSelect';
import BridgeFeeDisplay from './BridgeFeeDisplay';
import BridgeAssetErrorText from './BridgeAssetErrorText';
import { useTxStatus } from 'contexts/txStatusContext';

const BridgeForm = () => {
  const {
    originChain,
    originChainOptions,
    setOriginChain,
    destinationChain,
    destinationChainOptions,
    setDestinationChain,
    switchOriginAndDestination
  } = useBridgeData();
  const { txStatus } = useTxStatus();

  const onClickSwitchOriginAndDestination = () => {
    if (!txStatus?.isProcessing()) {
      switchOriginAndDestination();
    }
  }

  return (
    <div className="2xl:inset-x-0 mt-4 justify-center min-h-full flex items-center pb-2">
      <div className="px-3 py-4 sm:p-8 bg-secondary rounded-lg w-[32rem]">
        <div className="flex gap-10 flex-y mt-4 items-end">
          <ChainSelect
            chain={originChain}
            chainOptions={originChainOptions}
            setChain={setOriginChain}
            isOriginChain={true}
          />
          <img
            onClick={onClickSwitchOriginAndDestination}
            className="mx-auto pb-7 cursor-pointer"
            src={Svgs.ArrowRightIcon}
            alt="switch-icon"
          />
          <ChainSelect
            chain={destinationChain}
            chainOptions={destinationChainOptions}
            setChain={setDestinationChain}
            isOriginChain={false}
          />
        </div>
        <div className="pt-4 flex flex-col gap-4 flex-y mt-4">
          <div>
            <BridgeAssetSelect />
            <BridgeAssetErrorText />
            <BridgeFeeDisplay />
          </div>
          <SendButton />
        </div>
      </div>
    </div>
  );
};

export default BridgeForm;
