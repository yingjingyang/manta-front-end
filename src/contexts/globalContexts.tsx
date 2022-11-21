// @ts-nocheck
import { KeyringContextProvider } from "./keyringContext"
import { ThemeProvider } from "./themeContext"
import PropTypes from 'prop-types';

const GlobalContexts = ({children}) => {
  return (
    <KeyringContextProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider >
    </KeyringContextProvider>
  )
}

KeyringContextProvider.propTypes = {
  children: PropTypes.any
};

export default GlobalContexts;

