import Navbar from 'components/Navbar';
import Main from './Main';
import { SBTContextProvider } from './SBTContext';

const SBT = () => {
  return (
    <SBTContextProvider>
      <div className="text-white min-h-screen flex flex-col">
        <Navbar showZkBtn={true} />
        <Main />
      </div>
    </SBTContextProvider>
  );
};
export default SBT;
