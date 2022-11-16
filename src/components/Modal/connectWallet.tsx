// @ts-nocheck
import React from 'react';
import { getWallets } from '@talismn/connect-wallets';
import { useKeyring } from 'contexts/keyringContext';

const ConnectWalletBlock = ({
  walletName,
  isWalletInstalled,
  walletInstallLink,
  walletLogo,
  isWalletEnabled
}) => {
  const { connectWalletExtension } = useKeyring();

  if (isWalletEnabled) {
    return (
      <div className="mt-6 p-4 flex items-center justify-between border border-manta-gray text-secondary rounded-xl w-full block">
        <div className="flex flex-row items-center gap-2">
          <img src={walletLogo.src} alt={walletLogo.alt} className="w-8 h-8" />
          {walletName}
        </div>
        <div className="text-black dark:text-white">Connected</div>
      </div>
    )
  } else if (isWalletInstalled) {
    return (
      <button
        onClick={() => connectWalletExtension(walletName)}
        className="mt-6 p-4 flex items-center justify-between border border-manta-gray text-secondary rounded-xl w-full block"
      >
        <div className="flex flex-row items-center gap-2">
          <img src={walletLogo.src} alt={walletLogo.alt} className="w-8 h-8" />
          {walletName}
        </div>
        <div className="text-link">Connect</div>
      </button>
    );
  } else {
    return (
      <a
        href={walletInstallLink}
        target="_blank"
        className="mt-6 p-4 text-sm flex items-center justify-between border border-manta-gray text-secondary rounded-xl w-full block"
        rel="noreferrer"
      >
        <div className="flex flex-row items-center gap-2">
          <img src={walletLogo.src} alt={walletLogo.alt} className="w-8 h-8" />
          {walletName}
        </div>
        <div className="text-link">Install</div>
      </a>
    );
  }
};

const ConnectWalletModal = () => {
  return (
    <div className="p-4 w-96">
      <h1 className="text-secondary text-xl">Connect wallet</h1>
      {getWallets().map((wallet) => (
        <ConnectWalletBlock
          key={wallet.extensionName}
          walletName={wallet.extensionName}
          isWalletInstalled={wallet.installed}
          walletInstallLink={wallet.installUrl}
          walletLogo={wallet.logo}
          // wallet.extension would not be defined if enabled not called
          isWalletEnabled={wallet.extension}
        />
      ))}
    </div>
  );
};

export default ConnectWalletModal;
