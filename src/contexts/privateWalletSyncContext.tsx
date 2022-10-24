// @ts-nocheck
import { localStorageKeys } from 'constants/LocalStorageConstants';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import store from 'store';

const PrivateWalletSyncContext = createContext();

export const PrivateWalletSyncContextProvider = (props) => {
  // sync state
  const currentSyncReceivers = useRef(null);
  const syncSenderIndex = useRef(null);
  const pullBatchStartTime = useRef(null);
  const [syncPercentage, setSyncPercentage] = useState(0);
  const [nextSyncPercentage, setNextSyncPercentage] = useState(null);
  const [timePerPercentage, setTimePerPercentage] = useState(null);
  const syncError = useRef(false);


  // this function takes the restult of a "pull" from the manta-wasm-wallet Api
  // and updates the necessary percentages that are used to display sync progress.
  const updatePercentages = async (receivers, senderIndex, sendersReceiversTotal) => {
    const pullBatchTime = performance.now() - pullBatchStartTime.current;
    console.log('pullBatchTime - ', pullBatchTime);
    const percentagePerBatch = parseInt(
      (
        ((receivers.length - syncSenderIndex.current + senderIndex) /
          sendersReceiversTotal) *
        100
      ).toFixed(0)
    );
    setTimePerPercentage(pullBatchTime / percentagePerBatch);

    const newSyncPercentage = parseInt(
      (
        ((currentSyncReceivers.current + senderIndex) /
          sendersReceiversTotal) *
        100
      ).toFixed(0)
    );
    setSyncPercentage(newSyncPercentage >= 100 ? 100 : newSyncPercentage);
    setNextSyncPercentage(
      newSyncPercentage + percentagePerBatch >= 100
        ? 100
        : newSyncPercentage + percentagePerBatch
    );
  };

  // this function is passed to the manta-wasm-wallet Api upon creation
  // as the pullCallBack() method, which updates the sync percentage with respect to
  // the ledger data that is pulled and processed.
  const updateSyncProgress = async (
    receivers,
    senders,
    senderIndex,
    sendersReceiversTotal
  ) => {
    try {
      if (!currentSyncReceivers.current || senderIndex === 0) {
        // if it's the first batch or page refreshed during sync
        currentSyncReceivers.current = receivers.length;
      } else {
        if (
          currentSyncReceivers.current + receivers.length <
          sendersReceiversTotal
        )
          currentSyncReceivers.current =
            currentSyncReceivers.current + receivers.length;
      }

      if (senderIndex === 0) {
        // if it's the first batch response
        setSyncPercentage(0);
        store.set(localStorageKeys.CurrentSyncReceiversCount, receivers.length);
        store.set(localStorageKeys.CurrentSyncSenderIndex, 0);
      } else {
        store.set(
          localStorageKeys.CurrentSyncReceiversCount,
          currentSyncReceivers.current
        );
        store.set(localStorageKeys.CurrentSyncSenderIndex, senderIndex);
      }

      updatePercentages(receivers, senderIndex, sendersReceiversTotal);

      pullBatchStartTime.current = performance.now();
      syncSenderIndex.current = senderIndex;
      syncError.current = false;
    } catch (err) {
      console.log('Error syncing private wallet', err);
    }
  };

  useEffect(() => {
    let interval;

    if (!nextSyncPercentage || !timePerPercentage) return;
    if (timePerPercentage > 0) {
      interval = setInterval(() => {
        if (syncPercentage < 100 && syncPercentage < nextSyncPercentage) {
          setSyncPercentage(syncPercentage + 1);
        }
      }, [timePerPercentage + 1]);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timePerPercentage, nextSyncPercentage, syncPercentage]);

  const value = {
    syncPercentage,
    syncError,
    updateSyncProgress,
    pullBatchStartTime,
    currentSyncReceivers,
    syncSenderIndex,
    nextSyncPercentage
  };

  return (
    <PrivateWalletSyncContext.Provider value={value}>
      {props.children}
    </PrivateWalletSyncContext.Provider>
  );
};

PrivateWalletSyncContextProvider.propTypes = {
  children: PropTypes.any
};

export const usePrivateWalletSync = () => ({
  ...useContext(PrivateWalletSyncContext)
});
