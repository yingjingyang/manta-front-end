// @ts-nocheck
import { ConfigContextProvider, useConfig } from "contexts/configContext"
import { ExternalAccountContextProvider } from "contexts/externalAccountContext"
import { SubstrateContextProvider } from "contexts/substrateContext"
import { MetamaskContextProvider } from 'contexts/metamaskContext';
import { Outlet } from "react-router-dom"
import NETWORK from 'constants/NetworkConstants';
import Navbar from "components/Navbar";
import DeveloperConsole from "components/Developer/DeveloperConsole";
import { TxStatusContextProvider, useTxStatus } from "contexts/txStatusContext";
import { useEffect } from "react";
import { showError, showInfo, showSuccess } from "utils/ui/Notifications";

const TxStatusHandler = () => {
  const config = useConfig();
  const { txStatus } = useTxStatus();

  const subscanUrl = txStatus?.subscanUrl || config.SUBSCAN_URL;

  useEffect(() => {
    if (txStatus?.isFinalized()) {
      showSuccess(subscanUrl, 'Transaction succeeded', txStatus?.extrinsic);
    } else if (txStatus?.isFailed()) {
      showError('Transaction failed');
    } else if (txStatus?.isProcessing() && txStatus.message) {
      showInfo(txStatus.message);
    }
  }, [txStatus]);

  return (
    <div />
  )
}

const BasePage = ({children}) => {
  return (
    <SubstrateContextProvider>
      <ExternalAccountContextProvider>
        <TxStatusContextProvider>
          <DeveloperConsole />
          <TxStatusHandler />
          {children}
        </TxStatusContextProvider>
      </ExternalAccountContextProvider>
    </SubstrateContextProvider>
  )
}

export const CalamariBasePage = () => {
  return (
    <ConfigContextProvider network={NETWORK.CALAMARI}>
      <BasePage>
          <Navbar />
        <Outlet />
      </BasePage>
    </ConfigContextProvider>
  );
}

export const DolphinBasePage = () => {
  return (
    <ConfigContextProvider network={NETWORK.DOLPHIN}>
      <MetamaskContextProvider>
        <BasePage>
            <Navbar />
          <Outlet />
        </BasePage>
      </MetamaskContextProvider>
    </ConfigContextProvider>
  );
}
