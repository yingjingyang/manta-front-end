// @ts-nocheck
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

import { SbtMantaPrivateWallet, Environment, Network } from 'manta.js-kg-dev';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { useSBT, UploadFile } from 'pages/SBTPage/SBTContext';
import { useConfig } from '../../../contexts/configContext';
import { useSubstrate } from '../../../contexts/substrateContext';
import { usePrivateWallet } from '../../../contexts/privateWalletContext';
import { useExternalAccount } from '../../../contexts/externalAccountContext';

export type SBTPrivateWalletValue = {
  mintSBT: () => string[];
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
  const { signerIsConnected, signerVersion, isReady } = usePrivateWallet();
  const { extensionSigner, externalAccount } = useExternalAccount();
  const { mintSet } = useSBT();

  useEffect(() => {
    const canInitWallet = () => {
      return (
        api &&
        signerIsConnected &&
        signerVersion &&
        !signerIsOutOfDate(config, signerVersion) &&
        !isInitialSync.current &&
        !sbtPrivateWallet
      );
    };

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

    if (canInitWallet() && !isReady) {
      initWallet();
    }
  }, [
    api,
    config,
    isReady,
    sbtPrivateWallet,
    signerIsConnected,
    signerVersion
  ]);

  const reserveSBT = useCallback(async () => {
    if (!sbtPrivateWallet || !externalAccount) {
      return;
    }
    await sbtPrivateWallet.reserveSbt(extensionSigner, externalAccount.address);
  }, [extensionSigner, externalAccount, sbtPrivateWallet]);

  const mintSBT = useCallback(async () => {
    if (!sbtPrivateWallet) {
      return;
    }

    const assetIds = await api?.query?.mantaSBT?.reservedIds(
      externalAccount.address
    );
    const assetId = assetIds?.unwrap()[0] ?? '';
    const numberOfMints = mintSet.size;
    const metadataList: string[] = [...mintSet].map(
      ({ metadata }: UploadFile) => {
        return metadata;
      }
    );
    await sbtPrivateWallet.initalWalletSync();

    const proofIds = await sbtPrivateWallet.mintSbt(
      assetId,
      numberOfMints,
      extensionSigner,
      externalAccount.address,
      metadataList
    );
    return proofIds;
  }, [
    api?.query?.mantaSBT,
    extensionSigner,
    externalAccount,
    mintSet,
    sbtPrivateWallet
  ]);

  const value = useMemo(() => {
    return {
      mintSBT,
      reserveSBT
    };
  }, [mintSBT, reserveSBT]);
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
