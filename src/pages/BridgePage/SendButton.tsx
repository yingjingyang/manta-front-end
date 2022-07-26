// @ts-nocheck
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import React from 'react';

const SendButton = () => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  const onClick = () => {
    console.log('Sent :)');
  };

  return (
    <div >
      <button
        // onClick={!disabled && onClick}
        className={
          classNames(
            'py-3 cursor-pointer text-xl btn-hover unselectable-text',
            'text-center rounded-lg btn-primary w-full',
            {'disabled': disabled}
          )}
      >
        Submit
      </button>
    </div>
  );
};

export default SendButton;