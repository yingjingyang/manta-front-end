// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import ChainDropdown from 'pages/BridgePage/ChainDropdown';
import SendButton from 'pages/BridgePage/SendButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SendAssetSelect from 'pages/SendPage/SendFromForm/SendAssetSelect';
import PublicFromAccountSelect from 'components/Accounts/PublicFromAccountSelect';
import Svgs from 'resources/icons';
import { useBridge } from './BridgeContext';
import BridgeAssetSelect from './BridgeAssetSelect';

const BridgeForm = () => {
    const { 
        senderPublicAccount,
        senderPublicAccountOptions,
        setSenderPublicAccount
    } = useBridge()

    return (
        <div className="justify-center flex pt-4 pb-4 m-auto">
          <div className="px-3 py-2 sm:p-8 bg-secondary rounded-lg w-[26rem]">
          <h2 className="text-primary text-white mb-2">Account</h2>
            <PublicFromAccountSelect
                senderPublicAccount={senderPublicAccount}
                senderPublicAccountOptions={senderPublicAccountOptions}
                setSenderPublicAccount={setSenderPublicAccount}
            />
            <div className="flex gap-8 flex-y items-end">
              <div className="">
                <h2 className="text-primary text-white mb-2">Origin chain</h2>
                <ChainDropdown />
              </div>
                <img
                className="mx-auto pb-7"
                src={Svgs.ArrowRightIcon}
                alt="switch-icon"
                />
              <div className="">
                <h2 className="text-primary text-white mb-2">Destination chain</h2>
                <ChainDropdown />
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-y mt-4">
              <div>
                <h2 className="text-primary text-white mb-2">Amount</h2>
                <BridgeAssetSelect />
              </div>
              <SendButton />
            </div>
          </div>
        </div>
  );
};

export default BridgeForm;