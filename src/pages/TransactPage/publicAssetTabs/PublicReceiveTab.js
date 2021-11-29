import React from 'react';
import Svgs from 'resources/icons';
import { useExternalAccount } from 'contexts/externalAccountContext';

const PublicReceiveTab = () => {
  const { externalAccount } = useExternalAccount();

  return (
    <div className="receive-content">
      {externalAccount && (
        <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      )}
      <div className="py-2">
        {externalAccount && (
          <div className="flex pb-4 pt-2 px-2 items-center text-xl">
            <img className="pr-2" src={Svgs.WalletIcon} alt="setting-icon" />
            <span className="text-lg wrap-text manta-gray">
              {externalAccount.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicReceiveTab;
