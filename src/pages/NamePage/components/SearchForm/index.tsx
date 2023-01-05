import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MIN_LENGTH = 2;

const SearchForm = () => {
  const [showError, toggleError] = useState(false);
  const [name, setName] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };
  useEffect(() => {
    if (searchParams.getAll('name').length) {
      setName(searchParams.getAll('name')[0]);
    }
  }, [searchParams]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setName(value);
    if (showError && value.length > MIN_LENGTH) {
      toggleError(false);
    }
  };

  const handleSearch = () => {
    if (name.length <= MIN_LENGTH) {
      toggleError(true);
      return;
    }
    toggleError(false);

    setSearchParams({
      name
    });
  };

  return (
    <form
      className="w-full flex items-center justify-between relative"
      onSubmit={handleSubmit}>
      <input
        placeholder="Search names..."
        className="flex-1 mr-4 px-4 py-2 text placeholder-gray-500 dark:placeholder-gray-500 text-black dark:text-white manta-bg-gray bg-opacity-0 outline-none rounded-lg"
        value={name}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="px-8 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter"
        onClick={handleSearch}>
        SEARCH
      </button>
      {showError && (
        <p className="absolute flex items-center top-11 text-xxs text-red-500">
          <svg
            className="mr-2 w-3.5 h-3.5"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.00008 1.16638C5.84636 1.16638 4.71854 1.5085 3.75926 2.14948C2.79997 2.79045 2.0523 3.70149 1.61079 4.76739C1.16928 5.8333 1.05376 7.00619 1.27884 8.13774C1.50392 9.2693 2.05949 10.3087 2.87529 11.1245C3.6911 11.9403 4.7305 12.4959 5.86206 12.721C6.99361 12.946 8.1665 12.8305 9.2324 12.389C10.2983 11.9475 11.2093 11.1998 11.8503 10.2405C12.4913 9.28125 12.8334 8.15344 12.8334 6.99971C12.8334 6.23367 12.6825 5.47513 12.3894 4.76739C12.0962 4.05966 11.6665 3.4166 11.1249 2.87493C10.5832 2.33325 9.94014 1.90357 9.2324 1.61042C8.52467 1.31727 7.76613 1.16638 7.00008 1.16638ZM7.58342 9.33305C7.58342 9.48776 7.52196 9.63613 7.41256 9.74553C7.30317 9.85492 7.15479 9.91638 7.00008 9.91638C6.84537 9.91638 6.697 9.85492 6.5876 9.74553C6.47821 9.63613 6.41675 9.48776 6.41675 9.33305V6.41638C6.41675 6.26167 6.47821 6.1133 6.5876 6.0039C6.697 5.89451 6.84537 5.83305 7.00008 5.83305C7.15479 5.83305 7.30317 5.89451 7.41256 6.0039C7.52196 6.1133 7.58342 6.26167 7.58342 6.41638V9.33305ZM7.00008 5.24971C6.88471 5.24971 6.77193 5.2155 6.676 5.15141C6.58007 5.08731 6.50531 4.9962 6.46115 4.88961C6.417 4.78302 6.40545 4.66573 6.42796 4.55258C6.45047 4.43942 6.50602 4.33548 6.5876 4.2539C6.66919 4.17232 6.77313 4.11677 6.88628 4.09426C6.99944 4.07175 7.11673 4.0833 7.22332 4.12745C7.32991 4.1716 7.42101 4.24637 7.48511 4.3423C7.54921 4.43823 7.58342 4.55101 7.58342 4.66638C7.58342 4.82109 7.52196 4.96946 7.41256 5.07886C7.30317 5.18826 7.15479 5.24971 7.00008 5.24971Z"
              fill="#FF4E4E"
            />
          </svg>
          Name length must be longer than {MIN_LENGTH} characters
        </p>
      )}
    </form>
  );
};
export default SearchForm;
