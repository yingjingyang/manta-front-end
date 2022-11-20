// @ts-nocheck
import { ConfigContextProvider } from "contexts/configContext"
import { ExternalAccountContextProvider } from "contexts/externalAccountContext"
import { SubstrateContextProvider } from "contexts/substrateContext"
import { Outlet } from "react-router-dom"
import NETWORK from 'constants/NetworkConstants';
import Navbar from "components/Navbar";
import DeveloperConsole from "components/Developer/DeveloperConsole";

const BasePage = ({children}) => {
  return (
    <SubstrateContextProvider>
      <ExternalAccountContextProvider>
        <DeveloperConsole />
        {children}
      </ExternalAccountContextProvider>
    </SubstrateContextProvider>
  )
}

export const CalamariBasePage = () => {
  return (
    <ConfigContextProvider network={NETWORK.CALAMARI}>
      <BasePage>
        <Navbar />
        <Outlet />
      </BasePage>
    </ConfigContextProvider>
  )
}

export const DolphinBasePage = () => {
  return (
    <ConfigContextProvider network={NETWORK.DOLPHIN}>
      <BasePage>
        <Navbar />
        <Outlet />
      </BasePage>
    </ConfigContextProvider>
  )
}
