import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Transfer from './Transfer';
import Labs from './Labs';

import Governance from './Governance';

export default function Main (props) {
  const accountPair = props.accountPair;
  return (
      <Switch>
          <Redirect exact from="/" to="/ma_token" />
          <Redirect exact from="/substrate-front-end-template" to="/ma_token" />
          <Route path="/ma_token" component={() => <Transfer accountPair={accountPair}/>} />
          <Route path="/labs" component={() => <Labs accountPair={accountPair}/>} />
          <Route path="/governance" component={Governance} />
      </Switch>
  );
}
