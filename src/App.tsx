// @ts-nocheck
import React from 'react';
import AppRouter from 'AppRouter';
import { ThemeProvider } from 'contexts/themeContext';
import { KeyringContextProvider } from './contexts/keyringContext';
import { PublicBalancesContextProvider } from 'contexts/publicBalancesContext';
import { UsdPricesContextProvider } from 'contexts/usdPricesContext';

function App() {
  return (
    <KeyringContextProvider>
      <ThemeProvider>
        <UsdPricesContextProvider>
          <AppRouter />
        </UsdPricesContextProvider>
      </ThemeProvider>
    </KeyringContextProvider>
  );
}

export default App;
