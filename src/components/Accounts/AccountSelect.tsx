// @ts-nocheck
import classNames from 'classnames';
import Button from 'components/Button';
import ConnectWalletModal from 'components/Modal/connectWallet';
import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useKeyring } from 'contexts/keyringContext';
import { useTxStatus } from 'contexts/txStatusContext';
import { useModal } from 'hooks';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { setHasAuthToConnectStorage } from 'utils/persistence/connectAuthorizationStorage';
import {
  faArrowUpRightFromSquare,
  faCheck,
  faCopy,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Identicon from '@polkadot/react-identicon';
import { getWallets } from '@talismn/connect-wallets';

const AccountSelect = () => {
  const config = useConfig();
  const { txStatus } = useTxStatus();
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    useExternalAccount();

  const { selectedWallet } = useKeyring();
  const [showAccountList, setShowAccountList] = useState(false);
  const [addressCopied, setAddressCopied] = useState(-1);
  const disabled = txStatus?.isProcessing();
  const { setHasAuthToConnectWallet } = useKeyring();
  const { ModalWrapper, showModal } = useModal();

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setAddressCopied(index);
    return false;
  };

  const ConnectAccountButton = ({ isButton }) => {
    const handleOnClick = () => {
      setHasAuthToConnectStorage(true);
      showModal();
      setHasAuthToConnectWallet(true);
    };
    return (
      <>
        {isButton ? (
          <Button
            className="btn-secondary rounded-lg relative z-10"
            onClick={handleOnClick}
          >
            Connect Wallet
          </Button>
        ) : (
          <FontAwesomeIcon
            className="w-6 h-6 cursor-pointer z-10"
            icon={faPlusCircle}
            onClick={handleOnClick}
          />
        )}
        <ModalWrapper>
          <ConnectWalletModal />
        </ModalWrapper>
      </>
    );
  };

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied >= 0 && setAddressCopied(-1),
      2000
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  const getBlockExplorerLink = (address) => {
    return `${config.SUBSCAN_URL}/account/${address}`;
  };

  const onClickAccountSelect = () => {
    !disabled && setShowAccountList(!showAccountList);
  };

  const AvaliableAccounts = () => {
    return externalAccountOptions.map((account: any, index: number) => (
      <div
        key={account.address}
        className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-xl px-3 py-2 mb-5 text-secondary"
        onClick={() => {
          changeExternalAccount(account, externalAccountOptions);
          setShowAccountList(false);
        }}
      >
        <div>
          <div className="text-sm flex flex-row items-center gap-3">
            <Identicon value={account.address} size={32} theme="polkadot" />
            <div className="flex flex-col gap-1">
              <div className="font-medium">{account.meta.name}</div>
              <div className="flex flex-row items-center gap-2">
                {`${account.address.slice(0, 4)}...${account.address.slice(
                  -5
                )}`}
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={getBlockExplorerLink(account.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faArrowUpRightFromSquare}
                    href={getBlockExplorerLink(account.address)}
                  />
                </a>
                {addressCopied === index ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faCopy}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(account.address, index);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="py-1 px-6">
          {externalAccount.address === account.address && (
            <FontAwesomeIcon
              className="fa-xl"
              icon={faCheck}
              style={{ color: 'green' }}
            />
          )}
        </div>
      </div>
    ));
  };

  const WalletSelect = () => {
    const { subscribeWalletAccounts, selectedWallet } = useKeyring();
    const enabledWallet = getWallets().filter((wallet) => wallet.extension);
    return enabledWallet.map((wallet) => (
      <button
      key={wallet.extensionName}
        onClick={() => {
          subscribeWalletAccounts(wallet);
        }}
      >
        <img
          className={classNames(
            `w-8 h-8 ${
              wallet.extensionName !== selectedWallet.extensionName
                ? 'filter grayscale'
                : ''
            }`
          )}
          src={wallet.logo.src}
          alt={wallet.logo.alt}
        />
      </button>
    ));
  };
  const DisplayAccountsButton = () => {
    return (
      <div className="relative">
        <OutsideClickHandler onOutsideClick={() => setShowAccountList(false)}>
          <div
            className={classNames(
              'flex gap-3 py-3 p-6 bg-secondary text-secondary',
              'font-medium cursor-pointer rounded-xl items-center',
              { disabled: disabled }
            )}
            onClick={onClickAccountSelect}
          >
            <img
              className="w-6 h-6"
              src={selectedWallet.logo.src}
              alt={selectedWallet.logo.alt}
            />
            {externalAccount?.meta.name}
          </div>
          {showAccountList ? (
            <div className="flex flex-col gap-4 mt-3 bg-secondary rounded-3xl p-6 pr-2 absolute right-0 top-full z-50 border border-manta-gray">
              <div className="text-lg font-medium">Wallet</div>
              <div className="flex flex-row items-center gap-4 pl-2">
                <WalletSelect />
                <ConnectAccountButton isButton={false} />
              </div>
              <div className="max-h-96 overflow-y-auto pr-4">
                <AvaliableAccounts />
              </div>
            </div>
          ) : null}
        </OutsideClickHandler>
      </div>
    );
  };

  return externalAccount ? (
    <DisplayAccountsButton />
  ) : (
    <ConnectAccountButton isButton={true} />
  );
};

export default AccountSelect;
