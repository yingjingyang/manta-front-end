import React from 'react';

type IBalanceProps = {
  balance: string;
  className: string;
  loaderClassName: string;
  loader: boolean;
};

const Balance: React.FC<IBalanceProps> = ({
  balance,
  className,
  loaderClassName,
  loader
}) => {
  return (
    <div id="balanceText" className={className}>
      Balance:&nbsp;<strong>{balance}</strong>
      {loader ? (
        <div className="inline-flex items-center">
          <div className={`loader-dot1 ${loaderClassName}`} />
          <div className={`loader-dot2 ${loaderClassName}`} />
          <div className={`loader-dot3 ${loaderClassName}`} />
        </div>
      ) : null}
    </div>
  );
};

export default Balance;
