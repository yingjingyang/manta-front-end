// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const AccountDisplay = ({address, label}) => {
  const [addressCopied, setAddressCopied] = useState(false);

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(address);
    setAddressCopied(true);
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied && setAddressCopied(false),
      1500
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  return (
    <div className="px-6 py-5 leading-5 h-16 flex items-center gap-2 text-lg relative gradient-border rounded-full">
      <span className="text-black dark:text-white">
      {label}
      </span>
      <span className="manta-gray text-xs">
        {address?.slice(0, 10)}...{address?.slice(-10)}
      </span>
      <data id="clipBoardCopy" value={address}/>
      <div className="text-black dark:text-white ml-auto cursor-pointer absolute right-6 top-1/2 transform -translate-y-1/2 text-base">
        {addressCopied ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <FontAwesomeIcon
            icon={faCopy}
            onMouseDown={(e) => copyToClipboard(e)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountDisplay;
