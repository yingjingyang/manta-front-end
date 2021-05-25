import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Transfer from './Transfer';
import Labs from './Labs';
import Labs2 from './Labs2';

import Governance from './Governance';

export default function Main (props) {
  const accountPair = props.accountPair;
  return (
      <Switch>
          <Redirect exact from="/" to="/transfer" />
          <Route path="/transfer" component={() => <Transfer accountPair={accountPair}/>} />
          <Route path="/labs" component={() => <Labs accountPair={accountPair}/>} />
          <Route path="/governance" component={Governance} />
      </Switch>
  );
}
