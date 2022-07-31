// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import MantaLoading from 'components/Loading';
import { useBridge } from './BridgeContext';

const SendButton = () => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const { send } = useBridge();

  const onClick = () => {
    send();
  };

  return (
    
    <div >
      {txStatus?.isProcessing() ? (
        <MantaLoading className="py-4" />
      ) : (
        <button
          onClick={!disabled && onClick}
          className={
            classNames(
              'py-3 cursor-pointer text-xl btn-hover unselectable-text',
              'text-center rounded-lg btn-primary w-full',
              {'disabled': disabled}
            )}
        >
        Submit
        </button>)}
    </div>
  );
};

export default SendButton;