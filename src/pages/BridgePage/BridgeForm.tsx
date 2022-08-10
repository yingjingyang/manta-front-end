// @ts-nocheck
import React from 'react';
import ChainDropdown from 'pages/BridgePage/ChainDropdown';
import SendButton from 'pages/BridgePage/SendButton';
import Svgs from 'resources/icons';
import { useBridge } from './BridgeContext';
import BridgeAssetSelect from './BridgeAssetSelect';
import BridgeFeeDisplay from './BridgeFeeDisplay';
import BridgeOriginAccountSelect from './BridgeOriginAccountSelect';
import BridgeDestinationAccountSelect from './BridgeDestinationAccountSelect';

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
    <div className="justify-center flex pt-4 pb-4 m-auto">
      <div className="px-3 py-2 sm:p-8 bg-secondary rounded-lg w-[26rem]">
        <h2 className="text-primary text-white mb-2">Origin Account</h2>
        <BridgeOriginAccountSelect/>
        <div className="flex gap-10 flex-y mt-4 items-end">
          <div>
            <h2 className="text-primary text-white mb-2">Origin chain</h2>
            <ChainDropdown
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
            <ChainDropdown
              chain={destinationChain}
              chainOptions={destinationChainOptions}
              setChain={setDestinationChain}
            />
          </div>
        </div>
        <h2 className="text-primary text-white mb-2 mt-4">Destination Account</h2>
        <BridgeDestinationAccountSelect/>
        <div className="flex flex-col gap-4 flex-y mt-4">
          <div>
            <h2 className="text-primary text-white mb-2">Amount</h2>
            <BridgeAssetSelect />
            <BridgeFeeDisplay />
          </div>
          <SendButton />
        </div>
      </div>
    </div>
  );
};

export default BridgeForm;
