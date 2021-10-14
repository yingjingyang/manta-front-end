import React from 'react';
import AppRouter from 'AppRouter';
import { ThemeProvider } from 'contexts/ThemeContext';
import { SignerContextProvider } from 'contexts/SignerContext';
import { SubstrateContextProvider } from 'contexts/SubstrateContext';
import { WalletContextProvider } from 'contexts/WalletContext';
import { ExternalAccountContextProvider } from 'contexts/ExternalAccountContext';
import DeveloperConsole from 'components/elements/Developer/DeveloperConsole';
import config from 'config';

function App() {
  return (
    <SubstrateContextProvider>
      <ExternalAccountContextProvider>
        <SignerContextProvider>
          <WalletContextProvider>
            <ThemeProvider>
              <AppRouter />
              {config.DEV_CONSOLE && <DeveloperConsole />}
            </ThemeProvider>
          </WalletContextProvider>
        </SignerContextProvider>
      </ExternalAccountContextProvider>
    </SubstrateContextProvider>
  );
}

export default App;
