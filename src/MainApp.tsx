// @ts-nocheck
import React, { useEffect } from 'react';
import config from 'config';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { SendPage } from 'pages';
import Sidebar from 'components/Sidebar';
import ThemeToggle from 'components/ThemeToggle';
import userIsMobile from 'utils/ui/userIsMobile';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useSubstrate } from 'contexts/substrateContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import BridgePage from 'pages/BridgePage';
import DowntimeModal from 'components/Modal/downtimeModal';
import MobileNotSupportedModal from 'components/Modal/mobileNotSupported';
import NewerSignerVersionRequiredModal from 'components/Modal/newerSignerVersionRequiredModal';
import MissingRequiredSoftwareModal from 'components/Modal/missingRequiredSoftwareModal';

function MainApp() {
  const  { api } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();
  const { signerVersion } = usePrivateWallet();
  const onMobile = userIsMobile();

  // let warningModal;
  // if (config.DOWNTIME) {
  //   warningModal = <DowntimeModal />;
  // } else if (onMobile) {
  //   warningModal = <MobileNotSupportedModal />;
  // } else if (signerIsOutOfDate(signerVersion)) {
  //   warningModal = <NewerSignerVersionRequiredModal />;
  // } else {
  //   warningModal = <MissingRequiredSoftwareModal />;
  // }

  document.title = config.PAGE_TITLE;

  return (
    <div className="main-app bg-primary flex">
      <Sidebar />
      {/* {warningModal} */}
      <Switch>
        <Route path="/" render={() => <Redirect to="/bridge" />} exact />
        {/* <Route path="/send" render={() => <Redirect to="/transact" />} exact /> */}
        {/* <Route path="/transact" component={SendPage} exact /> */}
        <Route path="/bridge" component={BridgePage} exact />
      </Switch>
      <div className="p-4 hidden change-theme lg:block fixed right-0 bottom-0">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default withRouter(MainApp);


