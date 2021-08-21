import React from 'react';
import Balance from './Balance';
import HashInfo from './HashInfo';

const HashContent = () => {
  return (
    <div className="w-full flex-col md:flex-row flex-wrap p-4 md:px-8 flex">
      <div className="md:w-1/2 pb-4 md:pb-0 flex-wrap flex">
        <Balance />
      </div>
      <div className="md:w-1/2 flex-wrap flex">
        <HashInfo />
      </div>
    </div>
  );
};

export default HashContent;
