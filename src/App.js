import React from 'react';
import AppRouter from 'AppRouter';
import { ThemeProvider } from 'contexts/ThemeContext';
import { SignerContextProvider } from 'contexts/SignerContext';
import { SubstrateContextProvider } from 'contexts/SubstrateContext';
import { DeveloperConsole } from 'utils/substrate-lib/components';


function App() {
  return (
    <SubstrateContextProvider>
      <SignerContextProvider>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </SignerContextProvider>
      <DeveloperConsole />
    </SubstrateContextProvider>

  );
}

export default App;
