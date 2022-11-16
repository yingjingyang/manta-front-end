// @ts-nocheck
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { BN } from 'bn.js';
import Balance from 'types/Balance';
import { useExternalAccount } from './externalAccountContext';
import { useSubstrate } from './substrateContext';
import AssetType from 'types/AssetType';

interface IPublicBalances {
  [key: number]: Balance;
}

const PublicBalancesContext = createContext();

export const PublicBalancesContextProvider = (props) => {
  const { api } = useSubstrate();
  const { externalAccount } = useExternalAccount();

  const [publicBalances, setPublicBalances] = useState<
    IPublicBalances | undefined
  >();

  const subscribeBalanceChange = async (
    address: string,
    assetType: AssetType
  ) => {
    if (!api || !address) {
      return null;
    }

    if (assetType.isNativeToken) {
      const unsub = await api.query.system.account(address, (balance) => {
        setPublicBalances((prev) => {
          return {
            ...prev,
            [assetType.assetId]: new Balance(
              assetType,
              new BN(balance.data.free.toString())
            )
          };
        });
      });
      return;
    }
    const unsub = await api.query.assets.account(
      assetType.assetId,
      address,
      ({ value }: any) => {
        const balanceString = value.isEmpty ? '0' : value.balance.toString();
        setPublicBalances((prev) => {
          return {
            ...prev,
            [assetType.assetId]: new Balance(assetType, new BN(balanceString))
          };
        });
      }
    );
  };

  const subscribeBalanceChanges = async (address: string) => {
    if (!api || !address) {
      return null;
    }

    const assetTypes = AssetType.AllCurrencies(false);
    await Promise.all(
      assetTypes.map(async (assetType) => {
        await subscribeBalanceChange(address, assetType);
      })
    );
  };

  const getPublicBalance = (assetType: AssetType) => {
    return publicBalances[assetType.assetId];
  };

  useEffect(() => {
    if (api && externalAccount) {
      subscribeBalanceChanges(externalAccount?.address);
    }
  }, [api, externalAccount]);

  const value = {
    publicBalances,
    getPublicBalance
  };

  return (
    <PublicBalancesContext.Provider value={value}>
      {props.children}
    </PublicBalancesContext.Provider>
  );
};

PublicBalancesContextProvider.propTypes = {
  children: PropTypes.any
};

export const usePublicBalances = () => ({
  ...useContext(PublicBalancesContext)
});
