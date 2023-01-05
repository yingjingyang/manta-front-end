import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchIndex from './components/SearchIndex';
import SearchResult from './components/SearchResult';

const NameHome = () => {
  const [searchParams] = useSearchParams();
  const [showResult, toggleShowResult] = useState(false);
  useEffect(() => {
    if (searchParams.getAll('name').length) {
      toggleShowResult(true);
    } else {
      toggleShowResult(false);
    }
  }, [searchParams]);
  return (
    <div
      className={`2xl:inset-x-0 flex flex-col flex-1 items-center pb-2 mx-10 mb-32 ${
        showResult ? 'bg-secondary' : ''
      } rounded-xl`}>
      {showResult ? <SearchResult /> : <SearchIndex />}
    </div>
  );
};
export default NameHome;
