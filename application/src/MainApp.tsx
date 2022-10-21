// @ts-nocheck
import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { SendPage, StakePage } from 'pages';
import ThemeToggle from 'components/ThemeToggle';

function MainApp() {
  return (
    <div className="main-app bg-primary">
      <div className="flex flex-col m-auto">
        <Switch>
          <Route
            path="/"
            render={() => <Redirect to="/calamari/stake" />}
            exact
          />
          <Route
            path="/send"
            render={() => <Redirect to="/dolphin/transact" />}
            exact
          />
          <Route
            path="/transact"
            render={() => <Redirect to="/dolphin/transact" />}
            exact
          />
          <Route
            path="/dolphin"
            render={() => <Redirect to="/dolphin/transact" />}
            exact
          />
          <Route
            path="/calamari"
            render={() => <Redirect to="/calamari/stake" />}
            exact
          />
          <Route path="/dolphin/transact" component={SendPage} exact />
          <Route path="/calamari/stake" component={StakePage} exact />
        </Switch>
        <div className="p-4 hidden change-theme lg:block fixed right-0 bottom-0">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default withRouter(MainApp);
