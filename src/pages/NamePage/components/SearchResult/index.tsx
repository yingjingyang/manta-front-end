import { Link } from 'react-router-dom';
import SearchHeader from '../SearchHeader';
import StatusButton from '../StatusButton';

const SearchResult = () => {
  return (
    <div className="flex flex-col w-full text-accent pb-6">
      <SearchHeader />
      <Link
        className="flex items-center justify-between text-accent mx-4 px-6 py-4 mt-6 bg-sixth rounded-xl cursor-pointer"
        to={'/dolphin/mns/test'}>
        <p className="text-accent">123232</p>
        <StatusButton status="available">Available</StatusButton>
      </Link>
      <Link
        className="flex items-center justify-between text-accent mx-4 px-6 py-4 mt-4 bg-sixth rounded-xl cursor-pointer"
        to={'/dolphin/mns/test1'}>
        <p className="text-accent">123232</p>
        <StatusButton status="registered">Registered</StatusButton>
      </Link>
      <Link
        className="flex items-center justify-between text-accent mx-4 px-6 py-4 mt-4 bg-sixth rounded-xl cursor-pointer"
        to={'/dolphin/mns/test2'}>
        <p className="text-accent">123232</p>
        <StatusButton status="not-available">Not Available</StatusButton>
      </Link>
    </div>
  );
};

export default SearchResult;
