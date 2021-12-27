import React, { useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { TransactPage, GovernPage, SwapPage } from 'pages';
import MissingRequiredSoftwareModal from 'components/elements/Modal/missingRequiredSoftwareModal';
import MobileNotSupportedModal from 'components/elements/Modal/mobileNotSupported';
import { SidebarMenu } from 'components/elements/Layouts';
import ScrollIntoView from 'components/elements/ScrollFollow/ScrollIntoView';
import ChangeThemeButton from 'components/resources/Sidebar/ChangeThemeButton';
import store from 'store';
import { useSubstrate } from 'contexts/substrateContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import config from 'config';
import { SignerInterface } from 'signer-interface';
import signerInterfaceConfig from 'config/signerInterfaceConfig';
import userIsMobile from 'utils/ui/userIsMobile';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import NewerSignerVersionRequiredModal from 'components/elements/Modal/newerSignerVersionRequiredModal';
import signerIsOutOfDate from 'utils/signerIsOutOfDate';

function MainApp() {
  const { api } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();
  const { signerVersion } = usePrivateWallet();
  const onMobile = userIsMobile();

  useEffect(() => {
    const shouldDevReset = async () => {
      if (process.env.NODE_ENV === 'production') return false;
      const blockNumberStorageKey = `${config.BASE_STORAGE_KEY}BlockNumber`;
      const oldBlockNumber = store.get(blockNumberStorageKey) || 0;
      const currentBlock = await api.rpc.chain.getBlock();
      const currentBlockNumber = currentBlock.block.header.number.toNumber();
      store.set(blockNumberStorageKey, currentBlockNumber);
      return currentBlockNumber < oldBlockNumber;
    };

    const devClearLocalStorage = async () => {
      const signerInterface = new SignerInterface(api, signerInterfaceConfig);
      signerInterface.resetStorage();
      console.log('Reset local storage');
    };

    const maybeDoDevReset = async () => {
      if (!api || !externalAccountSigner) return;
      await api.isReady;
      let shouldDoDevReset = await shouldDevReset();
      if (shouldDoDevReset) {
        devClearLocalStorage();
      }
    };

    maybeDoDevReset();
  }, [api, externalAccountSigner]);

  let warningModal;
  if (onMobile) {
    warningModal = <MobileNotSupportedModal />;
  } else if (signerIsOutOfDate(signerVersion)) {
    warningModal = <NewerSignerVersionRequiredModal />;
  } else {
    warningModal = <MissingRequiredSoftwareModal />;
  }

  return (
    <div className="main-app bg-primary">
      <ScrollIntoView>
        <SidebarMenu />
        {warningModal}
        <Switch>
          <Route path="/" render={() => <Redirect to="/transact" />} exact />
          <Route path="/transact" component={TransactPage} exact />
          <Route path="/govern" component={GovernPage} exact />
          <Route path="/swap" component={SwapPage} exact />
        </Switch>
        <div className="p-4 hidden change-theme lg:block fixed right-0 bottom-0">
          <ChangeThemeButton />
        </div>
      </ScrollIntoView>
    </div>
  );
}

export default withRouter(MainApp);
