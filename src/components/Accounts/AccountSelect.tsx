// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Identicon from '@polkadot/react-identicon';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Button from 'components/Button';
import Svgs from 'resources/icons';
import { useModal } from 'hooks';
import ConnectWalletModal from 'components/Modal/connectWallet';
import { useConfig } from 'contexts/configContext';
import { useTxStatus } from 'contexts/txStatusContext';
import classNames from 'classnames';
import { useKeyring } from 'contexts/keyringContext';

const AccountSelect = () => {
  const config = useConfig();
  const { txStatus } = useTxStatus();
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    useExternalAccount();
  const { ModalWrapper, showModal } = useModal();
  const { setHasAuthToConnectWallet, web3ExtensionInjected } = useKeyring();

  const [showAccountList, setShowAccountList] = useState(false);
  const [addressCopied, setAddressCopied] = useState(-1);
  const disabled = txStatus?.isProcessing();

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setAddressCopied(index);
    return false;
  };

  const getAccountIcon = (source: string) => {
    if (source === 'talisman') {
      return Svgs.Talisman;
    } else if (source === 'polkadot-js') {
      return Svgs.PolkadotJSIcon;
    } else {
      return Svgs.WalletIcon;
    }
  };

  const handleOnClick = () => {
    window.localStorage.setItem('hasAuthToConnectWallet', true);
    if (web3ExtensionInjected && web3ExtensionInjected.length === 0) {
      showModal();
    }
    setHasAuthToConnectWallet(true);
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

  const accountsComponent = (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowAccountList(false)}>
        <div
          className={classNames(
            'flex gap-3 py-3 p-6 bg-secondary text-secondary',
            'font-medium cursor-pointer rounded-xl',
            { disabled: disabled }
          )}
          onClick={onClickAccountSelect}
        >
          <img
            className="w-6 h-6"
            src={getAccountIcon(externalAccount?.meta.source)}
            alt={externalAccount?.meta.source}
          />
          {externalAccount?.meta.name}
        </div>
        {showAccountList ? (
          <div className="mt-3 bg-secondary rounded-3xl p-6 pr-2 absolute right-0 top-full z-50 border border-manta-gray">
            <div className="max-h-96 overflow-y-auto pr-4">
              {Array.isArray(externalAccountOptions)
                ? externalAccountOptions.map((account: any, index: number) => (
                    <div
                      key={account.address}
                      className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-xl px-6 py-4 mb-5 text-secondary"
                      onClick={() => {
                        changeExternalAccount(account, externalAccountOptions);
                        setShowAccountList(false);
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <Identicon
                            value={account.address}
                            size={32}
                            theme="polkadot"
                          />
                          {account.meta.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div>
                            {`${account.address.slice(
                              0,
                              4
                            )}...${account.address.slice(-5)}`}
                          </div>
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
                  ))
                : null}
            </div>
          </div>
        ) : null}
      </OutsideClickHandler>
    </div>
  );

  const connectedAccountComponent = (
    <div>
      <Button
        className="btn-secondary rounded-lg relative z-10"
        onClick={handleOnClick}
      >
        Connect Wallet
      </Button>
      <ModalWrapper>
        <ConnectWalletModal />
      </ModalWrapper>
    </div>
  );

  return externalAccount ? accountsComponent : connectedAccountComponent;
};

export default AccountSelect;
