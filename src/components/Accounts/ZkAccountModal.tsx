//@ts-nocheck
import React, { useEffect, useState } from 'react';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import MantaIcon from 'resources/images/manta.png';
import { useUsdPrices } from 'contexts/usdPricesContext';
import { useSend } from 'pages/SendPage/SendContext';
import { useTxStatus } from 'contexts/txStatusContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import Usd from 'types/Usd';
import CopyPasteIcon from 'components/CopyPasteIcon';
import { useConfig } from 'contexts/configContext';

const AccountDisplay = () => {
  const config = useConfig();
  const { txStatus } = useTxStatus();
  const { privateAddress, getSpendableBalance, signerIsConnected, isReady } =
    usePrivateWallet();
  const {
    senderAssetCurrentBalance,
    senderAssetType,
    receiverAssetType,
    receiverCurrentBalance
  } = useSend();
  const { usdPrices } = useUsdPrices();

  const assets = AssetType.AllCurrencies(config, true);
  const [balances, setBalances] = useState([]);
  const [totalBalanceString, setTotalBalanceString] = useState('$0.00');

  const fetchPrivateBalanceHelper = async (assetType: any) => {
    try {
      let usdBalance = null;
      const privateBalance = await getSpendableBalance(assetType);
      if (privateBalance) {
        const assetUsdValue = usdPrices[assetType.baseTicker] || new Decimal(0);
        usdBalance = privateBalance.toUsd(assetUsdValue);
        const usdBalanceString = usdBalance.toUsdString();

        return {
          assetType,
          usdBalance,
          usdBalanceString,
          privateBalance
        };
      }

      return {
        assetType,
        usdBalance,
        usdBalanceString: '$0.00',
        privateBalance
      };
    } catch (err) {
      return {
        assetType,
        usdBalance: null,
        usdBalanceString: '',
        privateBalance: null
      };
    }
  };

  const fetchPrivateBalances = async () => {
    let totalUsd = new Usd(new Decimal(0));
    console.log('assets', assets);
    const updatedBalances = await Promise.all(
      assets.map(async (assetType: any) => {
        const fetchPrivateBalanceRes = await fetchPrivateBalanceHelper(
          assetType
        );
        fetchPrivateBalanceRes.usdBalance &&
          totalUsd.add(fetchPrivateBalanceRes.usdBalance.value);
        return fetchPrivateBalanceRes;
      })
    );

    setBalances([
      ...updatedBalances.filter(
        (balance) =>
          balance.privateBalance &&
          balance.privateBalance.gt(new Balance(balance.assetType, new BN(0)))
      )
    ]);
    setTotalBalanceString(totalUsd.toUsdString());
  };

  useEffect(() => {
    if (
      isReady &&
      privateAddress &&
      (senderAssetType?.isPrivate || receiverAssetType?.isPrivate)
    ) {
      fetchPrivateBalances();
    }
  }, [
    isReady,
    usdPrices,
    privateAddress,
    txStatus,
    senderAssetCurrentBalance,
    senderAssetType,
    receiverAssetType,
    receiverCurrentBalance
  ]);

  const ZkAccountModalContent = () => {
    if (privateAddress) {
      return (
        <>
          <div className="flex flex-col gap-3">
            <div className="border border-secondary bg-white bg-opacity-5 rounded-lg p-1 text-secondary flex items-center justify-center gap-3">
              <div className="flex items-center gap-3">
                <img className="w-6 h-6" src={MantaIcon} alt="Manta" />
                <span className="text-secondary font-light">
                  {privateAddress.slice(0, 9)}...
                  {privateAddress.slice(-9)}
                </span>
              </div>
              <CopyPasteIcon className="w-3 h-3" textToCopy={privateAddress} />
            </div>
            <div className="border border-secondary bg-white bg-opacity-5 rounded-lg p-1 text-secondary flex flex-col justify-center items-center">
              <span className="pt-3 pb-1 text-base">Total Balance</span>
              <div className="text-fourth pb-3 text-2xl font-bold">
                {totalBalanceString}
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-secondary rounded-lg px-6 py-4 mt-3 text-secondary overflow-y-auto h-48 bg-white bg-opacity-5">
            <PrivateTokenTableContent />
          </div>
        </>
      );
    } else {
      return (
        <div className="whitespace-nowrap text-center">
          You have no zkAccount yet.
        </div>
      );
    }
  };

  const PrivateTokenItem = ({ balance }) => {
    return (
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-3 items-center">
          <img className="w-8 h-8 rounded-full" src={balance.assetType.icon} />
          <div>
            <div className="text-fourth">{balance.assetType.ticker}</div>
            <div className="text-secondary">
              {balance.privateBalance.toString()}
            </div>
          </div>
        </div>
        <div className="text-fourth">
          {usdPrices[balance.assetType.baseTicker]
            ? balance.usdBalanceString
            : '$0.00'}
        </div>
      </div>
    );
  };

  const PrivateTokenTableContent = () => {
    if (balances && balances.length > 0) {
      return balances.map((balance, index) => (
        <PrivateTokenItem balance={balance} key={balance.assetType.assetId} />
      ));
    } else {
      return (
        <div className="whitespace-nowrap text-center">
          You have no zkAssets yet.
        </div>
      );
    }
  };

  return (
    <div className="w-80 mt-3 bg-secondary rounded-lg p-4 absolute right-0 top-full z-50 border border-manta-gray text-secondary ">
      <ZkAccountModalContent />
    </div>
  );
};

export default AccountDisplay;
