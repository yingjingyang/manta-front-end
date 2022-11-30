// @ts-nocheck
import { useEffect, useState } from 'react';
import { useConfig } from 'contexts/configContext';
import { useMetamask } from 'contexts/metamaskContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Svgs from 'resources/icons';
import Identicon from '@polkadot/react-identicon';
import {
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeBlockie from 'ethereum-blockies-base64';
import CopyPasteIcon from 'components/CopyPasteIcon';

const SingleAccountDisplay = ({
  accountName,
  accountAddress,
  isAccountSelected,
  isMetamaskSelected,
  onClickAccountHandler
}) => {
  const config = useConfig();
  const succinctAddress = `${accountAddress?.slice(
    0,
    5
  )}...${accountAddress?.slice(-4)}`;

  const succinctAccountName =
    accountName.length > 12
      ? `${accountName?.slice(0, 12)}...`
      : accountName;

  const blockExplorerLink = isMetamaskSelected
    ? `${config.ETHERSCAN_URL}/address/${accountAddress}`
    : `${config.SUBSCAN_URL}/account/${accountAddress}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountAddress);
    return false;
  };

  const BlockExplorerButton = () => (
    <a
      className="place-self-center"
      onClick={(e) => e.stopPropagation()}
      href={blockExplorerLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        className="cursor-pointer w-3 h-3"
        icon={faArrowUpRightFromSquare}
        href={blockExplorerLink}
      />
    </a>
  );


  const AccountIcon = () =>
    isMetamaskSelected ? (
      <img
        className="ml-1 rounded-full w-6 h-6"
        src={makeBlockie(accountAddress)}
        alt={'blockie address icon'}
      />
    ) : (
      <Identicon
        value={accountAddress}
        size={24}
        theme="polkadot"
        className="px-1"
      />
    );

  return (
    <div
      key={accountAddress}
      className="bg-white bg-opacity-5 cursor-pointer flex items-center gap-5 justify-between border border-white border-opacity-20 rounded-lg px-3 text-green w-68 h-16"
      onClick={onClickAccountHandler}
    >
      <div>
        <div className="flex flex-row items-center gap-3">
          <AccountIcon />
          <div className="flex flex-col">
            <div className="text-base">{succinctAccountName}</div>
            <div className="flex flex-row items-center gap-2 text-white text-opacity-60 text-sm">
              {succinctAddress}
              <div className="w-3 h-5 flex">
                <BlockExplorerButton />
              </div>
              <div className="w-5 h-5">
                <CopyPasteIcon className='place-self-center cursor-pointer w-full h-full hover:text-link' textToCopy={accountAddress} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative right-2">
        {isAccountSelected && (
          <img src={Svgs.GreenCheckIcon} alt={'green check'} />
        )}
      </div>
    </div>
  );
};

const AccountSelectDropdown = ({ isMetamaskSelected }) => {
  const { ethAddress } = useMetamask();
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    useExternalAccount();

  return isMetamaskSelected ? (
    <SingleAccountDisplay
      accountName={'Metamask Account'}
      accountAddress={ethAddress}
      isAccountSelected={true}
      isMetamaskSelected={isMetamaskSelected}
      onClickAccountHandler={() => {}}
    />
  ) : (
    <div className="flex flex-col gap-5">
      {externalAccountOptions.map((account: any) => (
        <SingleAccountDisplay
          key={account.address}
          accountName={account.meta.name}
          accountAddress={account.address}
          isAccountSelected={account.address === externalAccount.address}
          isMetamaskSelected={isMetamaskSelected}
          onClickAccountHandler={() => changeExternalAccount(account)}
        />
      ))}
    </div>
  );
};

export default AccountSelectDropdown;
