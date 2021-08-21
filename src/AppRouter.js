import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainApp from 'MainApp';

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={MainApp} />
      </Switch>
    </Router>
  );
}

export default AppRouter;
