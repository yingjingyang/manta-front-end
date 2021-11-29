import React from 'react';
import AppRouter from 'AppRouter';
import { ThemeProvider } from 'contexts/themeContext';
import { SubstrateContextProvider } from 'contexts/substrateContext';
import { PrivateWalletContextProvider } from 'contexts/privateWalletContext';
import { ExternalAccountContextProvider } from 'contexts/externalAccountContext';
import DeveloperConsole from 'components/elements/Developer/DeveloperConsole';
import config from 'config';
import { TxStatusContextProvider } from 'contexts/txStatusContext';

function App() {
  return (
    <SubstrateContextProvider>
      <ExternalAccountContextProvider>
        <PrivateWalletContextProvider>
          <TxStatusContextProvider>
            <ThemeProvider>
              <AppRouter />
              {config.DEV_CONSOLE && <DeveloperConsole />}
            </ThemeProvider>
          </TxStatusContextProvider>
        </PrivateWalletContextProvider>
      </ExternalAccountContextProvider>
    </SubstrateContextProvider>
  );
}

export default App;
