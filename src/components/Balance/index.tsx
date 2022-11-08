import React from 'react';
import DotLoader from 'components/Loaders/DotLoader';

interface IBalanceProps {
  balance: string;
  className: string;
  loaderClassName: string;
  loader: boolean;
}

const Balance: React.FC<IBalanceProps> = ({
  balance,
  className,
  loaderClassName,
  loader
}) => {
  return (
    <div id="balanceText" className={className}>
      Balance:&nbsp;{balance}
      {loader && <DotLoader />}
    </div>
  );
};

export default Balance;
