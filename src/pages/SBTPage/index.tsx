import Navbar from 'components/Navbar';
import Main from './Main';
import { SBTContextProvider } from './SBTContext';
import { SBTPrivateContextProvider } from './SBTContext/sbtPrivateWalletContext';

const SBT = () => {
  return (
    <SBTContextProvider>
      <SBTPrivateContextProvider>
        <div className="text-white min-h-screen flex flex-col">
          <Navbar showZkBtn={true} />
          <Main />
        </div>
      </SBTPrivateContextProvider>
    </SBTContextProvider>
  );
};
export default SBT;
