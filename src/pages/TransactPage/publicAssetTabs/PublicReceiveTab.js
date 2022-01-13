import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Svgs from 'resources/icons';
import { useExternalAccount } from 'contexts/externalAccountContext';

const PublicReceiveTab = () => {
  const { externalAccount } = useExternalAccount();

  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(externalAccount.address);
    setAddressCopied(true);
  };

  useEffect(() => {
    let interval;
    if (addressCopied) {
      interval = setInterval(() => {
        setAddressCopied(false);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [addressCopied]);

  return (
    <div className="receive-content">
      {externalAccount && (
        <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      )}
      <div className="py-2">
        {externalAccount && (
          <div className="flex pb-4 pt-2 px-2 items-center text-xl">
            <img className="pr-2" src={Svgs.WalletIcon} alt="setting-icon" />
            {addressCopied ? (
              <span className="text-lg wrap-text text-primary text-center flex-grow h-14 flex justify-center items-center -ml-5">
                <FontAwesomeIcon
                  icon={faCheck}
                  color="#24A148"
                  className="mr-1"
                />
                Address copied to clipboard
              </span>
            ) : (
              <span
                className="text-lg wrap-text manta-gray cursor-pointer underline h-14"
                onClick={handleCopyToClipboard}
              >
                {externalAccount.address}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicReceiveTab;
