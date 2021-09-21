import React from 'react';
import AppRouter from 'AppRouter';
import { ThemeProvider } from 'contexts/ThemeContext';
import { SignerContextProvider } from 'contexts/SignerContext';
import { SubstrateContextProvider } from 'contexts/SubstrateContext';
import { ExternalAccountContextProvider } from 'contexts/ExternalAccountContext';
import DeveloperConsole from 'components/elements/Developer/DeveloperConsole';
import config from 'config';

function App() {
  return (
    <SubstrateContextProvider>
      <ExternalAccountContextProvider>
        <SignerContextProvider>
          <ThemeProvider>
            <AppRouter />
            {config.DEV_CONSOLE && <DeveloperConsole />}
          </ThemeProvider>
        </SignerContextProvider>
      </ExternalAccountContextProvider>
    </SubstrateContextProvider>
  );
}

export default App;
