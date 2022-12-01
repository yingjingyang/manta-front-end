// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import MantaLoading from 'components/Loading';
import { useBridgeTx } from './BridgeContext/BridgeTxContext';

const SendButton = () => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const { send } = useBridgeTx();

  const onClick = () => {
    send();
  };

  return (

    <div >
      {disabled ? (
        <MantaLoading className="py-3" />
      ) : (
        <button
          onClick={onClick}
          className={
            classNames(
              'py-2 cursor-pointer text-xl btn-hover unselectable-text',
              'text-center rounded-lg btn-primary w-full',
            )}
        >
        Submit
        </button>)}
    </div>
  );
};

export default SendButton;
