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
    const syncPercentage = useRef(0);
    const nextSyncPercentage = useRef(0);
    const pullBatchStartTime = useRef(0);
    const pullBatchEndTime = useRef(0);
    const timePerPercentage = useRef(0);
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
          if (currentSyncReceivers.current + receivers.length < senders_receivers_total)
            currentSyncReceivers.current = currentSyncReceivers.current + receivers.length;
        }
        pullBatchEndTime.current = performance.now();
        const pullBatchTime =
          pullBatchEndTime.current - pullBatchStartTime.current;
  
        console.log('pullBatchTime - ', pullBatchTime);
  
        if (sender_index === 0) {
          syncPercentage.current = 0;
          store.set(localStorageKeys.CurrentSyncReceiversCount, receivers.length);
          store.set(localStorageKeys.CurrentSyncSenderIndex, 0);
        } else {
          store.set(localStorageKeys.CurrentSyncReceiversCount, currentSyncReceivers.current);
          store.set(localStorageKeys.CurrentSyncSenderIndex, sender_index);
        }
  
        if (currentSyncReceivers.current) {
          const percentagePerBatch =
          parseInt((
            ((receivers.length - syncSenderIndex.current + sender_index) / senders_receivers_total) *
            100
          ).toFixed(0));
          timePerPercentage.current =
            pullBatchTime / parseInt(percentagePerBatch);
          syncPercentage.current = parseInt((
            ((currentSyncReceivers.current + sender_index) / senders_receivers_total) *
            100
          ).toFixed(0));
  
          if (syncPercentage.current >= 100) {
            syncPercentage.current = 100;
          }
  
          nextSyncPercentage.current =
            syncPercentage.current +
              percentagePerBatch >=
            100
              ? 100
              : syncPercentage.current +
                percentagePerBatch;
        } else {
          syncPercentage.current = 0;
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
      if (timePerPercentage.current > 0) {
        interval = setInterval(() => {
          if (
            syncPercentage.current < 100 &&
            syncPercentage.current < nextSyncPercentage.current
          ) {
            syncPercentage.current = syncPercentage.current + 1;
          }
        }, [timePerPercentage.current + 1]);
      }
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [
      timePerPercentage.current,
      nextSyncPercentage.current,
      syncPercentage.current
    ]);
  
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
  
  export const usePrivateWalletSync = () => ({ ...useContext(PrivateWalletSyncContext) });
  