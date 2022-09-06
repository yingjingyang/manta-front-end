// @ts-nocheck
import React from 'react';
import ChainSelect from 'pages/BridgePage/ChainSelect';
import SendButton from 'pages/BridgePage/SendButton';
import Svgs from 'resources/icons';
import { useBridge } from './BridgeContext';
import BridgeAssetSelect from './BridgeAssetSelect';
import BridgeFeeDisplay from './BridgeFeeDisplay';
import BridgeOriginAccountSelect from './BridgeOriginAccountSelect';
import BridgeDestinationAccountDisplay from './BridgeDestinationAccountDisplay';
import BridgeAssetErrorText from './BridgeAssetErrorText'

const BridgeForm = () => {
  const {
    originChain,
    originChainOptions,
    setOriginChain,
    destinationChain,
    destinationChainOptions,
    setDestinationChain
  } = useBridge();

  return (
    <div className="absolute inset-y-0 inset-x-0 lg:left-32 2xl:inset-x-0 justify-center flex items-center pb-2">
      <div className="px-3 py-2 sm:p-8 bg-secondary rounded-lg w-[32rem]">
        <h2 className="text-primary text-white mb-2">Account</h2>
        <BridgeOriginAccountSelect/>
        <div className="flex gap-10 flex-y mt-4 items-end">
          <div>
            <h2 className="text-primary text-white mb-2">Origin chain</h2>
            <ChainSelect
              chain={originChain}
              chainOptions={originChainOptions}
              setChain={setOriginChain}
            />
          </div>
          <img
            className="mx-auto pb-7"
            src={Svgs.ArrowRightIcon}
            alt="switch-icon"
          />
          <div>
            <h2 className="text-primary text-white mb-2">Destination chain</h2>
            <ChainSelect
              chain={destinationChain}
              chainOptions={destinationChainOptions}
              setChain={setDestinationChain}
            />
          </div>
        </div>
        <BridgeDestinationAccountDisplay/>
        <div className="flex flex-col gap-4 flex-y mt-4">
          <div>
            <h2 className="text-primary text-white mb-2">Amount</h2>
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
