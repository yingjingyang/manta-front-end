// @ts-nocheck
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import store from 'store';
import { localStorageKeys } from 'constants/LocalStorageConstants';

const PrivateWalletSyncContext = createContext();

export const PrivateWalletSyncContextProvider = (props) => {
  // sync state
  const currentSyncReceivers = useRef(0);
  const syncSenderIndex = useRef(0);
  const pullBatchStartTime = useRef(0);
  const pullBatchEndTime = useRef(0);
  const [syncPercentage, setSyncPercentage] = useState(0);
  const [nextSyncPercentage, setNextSyncPercentage] = useState(0);
  const [timePerPercentage, setTimePerPercentage] = useState(0);
  const syncError = useRef(false);

  const updateSyncProgress = async (
    receivers,
    senders,
    sender_index,
    senders_receivers_total
  ) => {
    try {
      if (!currentSyncReceivers.current || sender_index === 0) {
        currentSyncReceivers.current = receivers.length;
      } else {
        if (
          currentSyncReceivers.current + receivers.length <
          senders_receivers_total
        )
          currentSyncReceivers.current =
            currentSyncReceivers.current + receivers.length;
      }
      pullBatchEndTime.current = performance.now();
      const pullBatchTime =
        pullBatchEndTime.current - pullBatchStartTime.current;

      console.log('pullBatchTime - ', pullBatchTime);

      if (sender_index === 0) {
        setSyncPercentage(0);
        store.set(localStorageKeys.CurrentSyncReceiversCount, receivers.length);
        store.set(localStorageKeys.CurrentSyncSenderIndex, 0);
      } else {
        store.set(
          localStorageKeys.CurrentSyncReceiversCount,
          currentSyncReceivers.current
        );
        store.set(localStorageKeys.CurrentSyncSenderIndex, sender_index);
      }

      if (currentSyncReceivers.current) {
        const percentagePerBatch = parseInt(
          (
            ((receivers.length - syncSenderIndex.current + sender_index) /
              senders_receivers_total) *
            100
          ).toFixed(0)
        );
        setTimePerPercentage(pullBatchTime / percentagePerBatch);
        const newSyncPercentage = parseInt(
          (
            ((currentSyncReceivers.current + sender_index) /
              senders_receivers_total) *
            100
          ).toFixed(0)
        );
        setSyncPercentage(newSyncPercentage);

        if (newSyncPercentage >= 100) {
          setSyncPercentage(100);
        }

        setNextSyncPercentage(
          newSyncPercentage + percentagePerBatch >= 100
            ? 100
            : newSyncPercentage + percentagePerBatch
        );
      } else {
        setSyncPercentage(0);
      }
      pullBatchStartTime.current = performance.now();
      syncSenderIndex.current = sender_index;
    } catch (err) {
      console.log('sync callback error - ', err);
    }
  };

  const syncErrorCallback = async () => {
    syncError.current = true;
  };

  useEffect(() => {
    let interval;
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
    syncErrorCallback,
    syncPercentage,
    pullBatchStartTime,
    pullBatchEndTime,
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
