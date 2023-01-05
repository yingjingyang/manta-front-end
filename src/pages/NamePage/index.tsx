import Navbar from 'components/Navbar';
import { useParams } from 'react-router-dom';
import NameDetail from './NameDetail';
import NameHome from './NameHome';
const NamePage = () => {
  const { name } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar showZkAccountButton={true} />
      {name ? <NameDetail /> : <NameHome />}
    </div>
  );
};
export default NamePage;
