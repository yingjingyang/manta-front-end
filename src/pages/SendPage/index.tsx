import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import { SendContextProvider } from './SendContext';
import SendForm from './SendForm';

const SendPage = () => {
  return (
    <SendContextProvider>
      <Navbar showZkAccountButton={true} />
      <PageContent>
        <SendForm />
      </PageContent>
    </SendContextProvider>
  );
};

export default SendPage;
