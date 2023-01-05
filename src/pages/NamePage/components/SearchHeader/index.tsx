import MantaIcon from 'resources/images/manta.png';
import SearchForm from '../SearchForm';

const SearchHeader = () => {
  return (
    <div className="flex justify-between items-center p-6 border-b border-third">
      <img className="w-8 h-8" src={MantaIcon} alt="Manta" />
      <p className="text-2xl text-accent ml-4 mr-6">MNS</p>
      <SearchForm />
    </div>
  );
};

export default SearchHeader;
