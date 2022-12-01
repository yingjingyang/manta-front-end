// @ts-nocheck
import React from 'react';
import Navs from 'components/Navbar/Navs';
import ChainSelect from 'pages/BridgePage/ChainSelect';
import SendButton from 'pages/BridgePage/SendButton';
import Svgs from 'resources/icons';
import { useBridgeData } from './BridgeContext/BridgeDataContext';
import BridgeAssetSelect from './BridgeAssetSelect';
import BridgeFeeDisplay from './BridgeFeeDisplay';
import BridgeAssetErrorText from './BridgeAssetErrorText';
import { useTxStatus } from 'contexts/txStatusContext';
import BridgeDestinationInput from './BridgeDestinationInput';

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

  const originChainIsEvm = originChain?.xcmAdapter.chain.type === 'ethereum';
  const destinationChainIsEvm = destinationChain?.xcmAdapter.chain.type === 'ethereum';
  const shouldShowDestinationInput = originChainIsEvm || destinationChainIsEvm;

  return (
    <div className="2xl:inset-x-0 justify-center min-h-full flex flex-col gap-6 items-center pb-2">
      <Navs />
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
        <div className="flex flex-col flex-y gap-4">
          <div>
            <BridgeAssetSelect />
            {/* <BridgeAssetErrorText /> */}
          </div>
        </div>
        {shouldShowDestinationInput && <BridgeDestinationInput />}
        <BridgeFeeDisplay />
        <SendButton />
      </div>
    </div>
  );
};

export default BridgeForm;
