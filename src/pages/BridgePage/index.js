import React, { useState } from 'react';
import classNames from 'classnames';
import { faExchange } from '@fortawesome/free-solid-svg-icons';
import config from 'config';
import PageContent from 'components/PageContent';
import PublicFromAccountSelect from 'pages/SendPage/SendFromForm/PublicFromAccountSelect';
import Navbar from 'components/Navbar';
import Svgs from 'resources/icons';
import ChainDropdown from './ChainDropdown';
import SendButton from './SendButton';
import { SendContextProvider } from './SendContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SendAssetSelect from './SendFromForm/SendAssetSelect';

const BridgePage = () => {
  const chains = config.bridge.chains.map((chain) => ({
    label: chain.name,
    value: chain
  }));

  const [fromChains, setFromChains] = useState(
    chains.filter((chain) => !chain.value.default)
  );
  const [toChains, setToChains] = useState(
    chains.filter((chain) => chain.value.default)
  );
  const [activeFromChain, setActiveFromChain] = useState(fromChains[0].value);
  const [activeToChain, setActiveToChain] = useState(toChains[0].value);

  const handleSwapChains = () => {
    setFromChains(toChains);
    setToChains(fromChains);
    setActiveFromChain(activeToChain);
    setActiveToChain(activeFromChain);
  };

  return (
    <SendContextProvider>
      <PageContent>
        <Navbar />
        <div className="justify-center flex pt-4 pb-4 m-auto">
          <div className="px-3 py-2 sm:p-8 bg-secondary rounded-lg w-[26rem]">
            <h1 className="text-2xl pb-2 mb-0 font-semibold text-accent">
              Bridge
            </h1>
            {/* <div className="">
              <PublicFromAccountSelect />
            </div> */}
            <div className="flex gap-8 flex-y items-end">
              <div className="">
                <h2 className="text-primary text-white mb-2">From</h2>
                <ChainDropdown
                  chains={fromChains}
                  activeChain={activeFromChain}
                  setActiveChain={(value) => setActiveFromChain(value)}
                />
              </div>
              <div
                className="text-primary mb-5 cursor-pointer"
                onClick={handleSwapChains}
              >
                <FontAwesomeIcon icon={faExchange} />
              </div>
              <div className="">
                <h2 className="text-primary text-white mb-2">To</h2>
                <ChainDropdown
                  chains={toChains}
                  activeChain={activeToChain}
                  setActiveChain={(value) => setActiveToChain(value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-y mt-4">
              <div>
                <h2 className="text-primary text-white mb-2">Amount</h2>
                <SendAssetSelect />
              </div>
              <div className="">
                <h2 className="text-primary text-white mb-2">
                  Destination Address
                </h2>
                <div
                  className={classNames(
                    'flex flex-col rounded-lg manta-bg-gray content-around justify-center py-3 w-full'
                  )}
                >
                  <input
                    type="text"
                    // onChange={onChange}
                    className={classNames(
                      'w-full pl-3 pt-1 text-lg manta-bg-gray outline-none'
                    )}
                  />
                </div>
              </div>
              <SendButton />
            </div>
          </div>
        </div>
      </PageContent>
    </SendContextProvider>
  );
};

export default BridgePage;
