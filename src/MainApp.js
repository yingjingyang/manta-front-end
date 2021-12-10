import React, { useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { TransactPage, GovernPage, SwapPage } from 'pages';
import MissingRequiredSoftwareModal from 'components/elements/Modal/missingRequiredSoftwareModal';
import { SidebarMenu } from 'components/elements/Layouts';
import ScrollIntoView from 'components/elements/ScrollFollow/ScrollIntoView';
import ChangeThemeButton from 'components/resources/Sidebar/ChangeThemeButton';
import store from 'store';
import { useSubstrate } from 'contexts/substrateContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import config from 'config';

function MainApp() {
  const { api } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();

  useEffect(() => {
    const shouldDevReset = async () => {
      if (process.env.NODE_ENV === 'production') return false;
      const blockNumberStorageKey = `${config.BASE_STORAGE_KEY}blockNumber`;
      const oldBlockNumber = store.get(blockNumberStorageKey) || 0;
      const currentBlock = await api.rpc.chain.getBlock();
      const currentBlockNumber = currentBlock.block.header.number.toNumber();
      store.set(blockNumberStorageKey, currentBlockNumber);
      return currentBlockNumber < oldBlockNumber;
    };

    const devClearLocalStorage = async () => {
      store.set(`${config.BASE_STORAGE_KEY}SpendableAssets`, []);
      store.set(`${config.BASE_STORAGE_KEY}InternalAddresses`, []);
      store.set(`${config.BASE_STORAGE_KEY}ExternalAddresses`, []);
      store.set(`${config.BASE_STORAGE_KEY}InternalAddressesUncommitedOffset`, 0);
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

  return (
    <div className="main-app bg-primary">
      <ScrollIntoView>
        <SidebarMenu />
        <MissingRequiredSoftwareModal />
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
