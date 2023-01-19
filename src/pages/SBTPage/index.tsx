import Navbar from 'components/Navbar';
import { SBTPrivateContextProvider } from 'pages/SBTPage/SBTContext/sbtPrivateWalletContext';
import Main from './Main';
import { SBTContextProvider } from './SBTContext';

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
