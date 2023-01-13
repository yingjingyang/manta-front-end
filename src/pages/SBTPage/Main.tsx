import Home from './components/Home';
import UploadPanel from './components/UploadPanel';
import { Step, useSBT } from './SBTContext';

const Main = () => {
  const { currentStep } = useSBT();
  if (currentStep === Step.Home) {
    return <Home />;
  }
  if (currentStep === Step.Upload) {
    return <UploadPanel />;
  }
  return <Home />;
};

export default Main;
