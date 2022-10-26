// @ts-nocheck
import React, { useEffect } from 'react';
import { TxStatusContextProvider, useTxStatus } from 'contexts/txStatusContext';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import { BridgeContextProvider } from './BridgeContext';
import BridgePageContent from './BridgePageContent';
import NETWORK from 'constants/NetworkConstants';
import { ConfigContextProvider } from 'contexts/configContext';
import { SubstrateContextProvider } from 'contexts/substrateContext';
import { ExternalAccountContextProvider } from 'contexts/externalAccountContext';
import { CalamariNavbar } from 'components/Navbar';

const BridgePage = () => {
  const { txStatus, setTxStatus } = useTxStatus();

  useEffect(() => {
    if (txStatus?.isFinalized()) {
      showSuccess('Transaction finalized', txStatus?.extrinsic);
      setTxStatus(null);
    } else if (txStatus?.isFailed()) {
      showError('Transaction failed');
      setTxStatus(null);
    }
  }, [txStatus]);

  return (
    <ConfigContextProvider network={NETWORK.CALAMARI}>
      <SubstrateContextProvider>
        <ExternalAccountContextProvider>
          <TxStatusContextProvider >
            <MetamaskContextProvider>
              <BridgeContextProvider>
                <div className='min-h-screen'>
                  <CalamariNavbar />
                  <BridgePageContent />
                </div>
              </BridgeContextProvider>
            </MetamaskContextProvider>
          </TxStatusContextProvider>
        </ExternalAccountContextProvider>
      </SubstrateContextProvider>
    </ConfigContextProvider>
  );
};

export default BridgePage;
