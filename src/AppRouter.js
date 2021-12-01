import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import MainApp from 'MainApp';

function AppRouter() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default AppRouter;
