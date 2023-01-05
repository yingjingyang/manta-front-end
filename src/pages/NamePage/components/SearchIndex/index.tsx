import MantaIcon from 'resources/images/manta.png';
import SearchForm from '../SearchForm';

const SearchIndex = () => {
  return (
    <div className="flex flex-col w-128 p-12 rounded-xl items-center bg-secondary">
      <img className="w-20 h-20" src={MantaIcon} alt="Manta" />
      <p className="text-2xl text-accent pt-6 pb-12">
        MANTA NETWORK
        <br />
        NAME SERVICE
      </p>
      <SearchForm />
    </div>
  );
};

export default SearchIndex;
