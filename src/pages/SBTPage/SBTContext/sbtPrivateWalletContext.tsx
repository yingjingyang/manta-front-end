import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback
} from 'react';
// @ts-ignore:next-line
import { SbtMantaPrivateWallet, Environment, Network } from 'mantasbt.js';
import { useConfig } from '../../../contexts/configContext';
import { useSubstrate } from '../../../contexts/substrateContext';
import { usePrivateWallet } from '../../../contexts/privateWalletContext';
import { useExternalAccount } from '../../../contexts/externalAccountContext';

export type SBTPrivateWalletValue = {
  reserveSBT: () => void;
};

const SBTPrivateWalletContext = createContext<SBTPrivateWalletValue | null>(
  null
);

export const SBTPrivateContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [sbtPrivateWallet, setSBTPrivateWallet] =
    useState<SbtMantaPrivateWallet | null>(null);
  const isInitialSync = useRef(false);

  const config = useConfig();
  const { api } = useSubstrate();
  const { isReady } = usePrivateWallet();
  const { extensionSigner, externalAccount } = useExternalAccount();

  useEffect(() => {
    const canInitWallet = api && !isInitialSync.current && !sbtPrivateWallet;

    const initWallet = async () => {
      isInitialSync.current = true;
      const privateWalletConfig = {
        environment: Environment.Development,
        network: Network.Dolphin,
        loggingEnabled: true
      };
      const sbtPrivateWallet = await SbtMantaPrivateWallet.initSBT(
        privateWalletConfig
      );
      await sbtPrivateWallet.initalWalletSync();
      setSBTPrivateWallet(sbtPrivateWallet);
      isInitialSync.current = false;
    };

    if (canInitWallet && !isReady) {
      initWallet();
    }
  }, [api, config, isReady, sbtPrivateWallet]);

  const reserveSBT = useCallback(async () => {
    if (!sbtPrivateWallet || !externalAccount) {
      return;
    }
    await sbtPrivateWallet.reserveSbt(extensionSigner, externalAccount.address);
  }, [extensionSigner, externalAccount, sbtPrivateWallet]);

  const value = useMemo(() => {
    return {
      reserveSBT
    };
  }, [reserveSBT]);
  return (
    <SBTPrivateWalletContext.Provider value={value}>
      {children}
    </SBTPrivateWalletContext.Provider>
  );
};

export const useSBTPrivateWallet = () => {
  const data = useContext(SBTPrivateWalletContext);
  if (!data || !Object.keys(data)?.length) {
    throw new Error(
      'useSBTPrivateWallet can only be used inside of <SBTPrivateWalletContext />, please declare it at a higher level.'
    );
  }
  return data;
};
