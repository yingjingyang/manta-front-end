// @ts-nocheck
import React from 'react';
import ChainSelect from 'pages/BridgePage/ChainSelect';
import SendButton from 'pages/BridgePage/SendButton';
import Svgs from 'resources/icons';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import BridgeAssetSelect from './BridgeAssetSelect';
import BridgeFeeDisplay from './BridgeFeeDisplay';
import BridgeDestinationAccountDisplay from './BridgeDestinationAccountDisplay';
import BridgeAssetErrorText from './BridgeAssetErrorText';

const BridgeForm = () => {
  const {
    originChain,
    originChainOptions,
    setOriginChain,
    destinationChain,
    destinationChainOptions,
    setDestinationChain
  } = useBridgeData();

  return (
    <div className="2xl:inset-x-0 mt-4 justify-center min-h-full flex items-center pb-2">
      <div className="px-3 py-4 sm:p-8 bg-secondary rounded-lg w-[32rem]">
        <div className="flex gap-10 flex-y mt-4 items-end">
          <ChainSelect
            chain={originChain}
            chainOptions={originChainOptions}
            setChain={setOriginChain}
            chainFromOrTo="From"
          />
          <img
            className="mx-auto pb-7"
            src={Svgs.ArrowRightIcon}
            alt="switch-icon"
          />
          <ChainSelect
            chain={destinationChain}
            chainOptions={destinationChainOptions}
            setChain={setDestinationChain}
            chainFromOrTo="To"
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
