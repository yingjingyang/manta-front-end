import React from 'react';

const StakeErrorDisplay = () => {
  const primaryText = 'Network Error';
  const secondaryText = 'Please check your internet connection';
  return (
    <div className="mt-4 w-full p-6 shadow-2xl bg-secondary rounded-lg">
      <h1 className="text-secondary text-lg font-semibold">{primaryText}</h1>
      <h1 className="text-secondary text-lg mt-4 font-semibold">
        {secondaryText}
      </h1>
    </div>
  );
};

export default StakeErrorDisplay;
