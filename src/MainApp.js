import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import {
  TransactPage,
  SwapPage,
  GovernPage,
  PoolPage,
  AuditPage,
  ExplorePage,
  ExtrinsicPage,
  BlockPage,
  HashDetailPage,
  ExtrinsicHistory,
  AccountPage,
} from 'pages';
import { SidebarMenu } from 'components/elements/Layouts';
import ScrollIntoView from 'components/elements/ScrollFollow/ScrollIntoView';
import ChangeThemeButton from 'components/resources/Sidebar/ChangeThemeButton';

function MainApp() {
  return (
    <div className="main-app bg-primary">
      <ScrollIntoView>
        <SidebarMenu />
        <Switch>
          <Route path="/" render={() => <Redirect to="/account" />} exact />
          <Route path="/account" component={AccountPage} exact />
          <Route path="/transact" component={TransactPage} exact />
          <Route path="/swap" component={SwapPage} exact />
          <Route path="/pool" component={PoolPage} exact />
          <Route path="/govern" component={GovernPage} exact />
          <Route path="/audit" component={AuditPage} exact />
          <Route path="/explore" component={ExplorePage} exact />
          <Route path="/explore/extrinsic" component={ExtrinsicPage} exact />
          <Route path="/explore/block" component={BlockPage} exact />
          <Route path="/explore/extrinsic-history" component={ExtrinsicHistory} exact />
          <Route path="/explore/hash/:id" component={HashDetailPage} exact />
        </Switch>
        <div className="p-4 hidden change-theme lg:block fixed right-0 bottom-0">
          <ChangeThemeButton />
        </div>
      </ScrollIntoView>
    </div>
  );
}

export default withRouter(MainApp);
