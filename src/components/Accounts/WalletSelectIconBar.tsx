// @ts-nocheck
import Svgs from 'resources/icons';
import classNames from 'classnames';
import { useMetamask } from 'contexts/metamaskContext';
import { getWallets } from '@talismn/connect-wallets';
import { useKeyring } from 'contexts/keyringContext';

const SubstrateWallets = ({ isMetamaskSelected, setIsMetamaskSelected }) => {
  const { subscribeWalletAccounts, selectedWallet } = useKeyring();
  const enabledWallet = getWallets().filter((wallet) => wallet.extension);
  const onIconClickHandler = (wallet) => () => {
    subscribeWalletAccounts(wallet);
    setIsMetamaskSelected(false);
  };

  return enabledWallet.map((wallet) => (
    <button
      className={classNames(
        `px-5 py-4 rounded-l-lg ${
          wallet.extensionName === selectedWallet.extensionName &&
          !isMetamaskSelected
            ? 'bg-primary'
            : ''
        }`
      )}
      key={wallet.extensionName}
      onClick={onIconClickHandler(wallet)}
    >
      <img className="w-8 h-8" src={wallet.logo.src} alt={wallet.logo.alt} />
    </button>
  ));
};

const MetamaskWallet = ({ isMetamaskSelected, setIsMetamaskSelected }) => (
  <button
    className={classNames(
      `px-5 py-4 ${isMetamaskSelected ? 'bg-primary' : ''}`
    )}
    onClick={() => {
      setIsMetamaskSelected(true);
    }}
  >
    <img className="w-8 h-8" src={Svgs.Metamask} alt={'metamask'} />
  </button>
);

const WalletSelectIconBar = ({ isMetamaskSelected, setIsMetamaskSelected }) => {
  const { ethAddress} = useMetamask();
  const isBridgePage = window?.location?.pathname?.includes('dolphin/bridge');
  return (
    <>
      <SubstrateWallets
        isMetamaskSelected={isMetamaskSelected}
        setIsMetamaskSelected={setIsMetamaskSelected}
      />
      {isBridgePage && ethAddress && (
        <MetamaskWallet
          isMetamaskSelected={isMetamaskSelected}
          setIsMetamaskSelected={setIsMetamaskSelected}
        />
      )}
    </>
  );
};

export default WalletSelectIconBar;
