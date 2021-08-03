import React from 'react';

export default function Main ({ txStatus, prevStatuses = [], totalBatches = 1 }) {
  if (!txStatus) {
    return <div/>;
  }
  
  const BLOCK_EXPLORER_URL = 'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer/query/';

  const formatStatus = (status, batchNumber) => {
    let batchMessage = totalBatches > 1 ? `${batchNumber}/${totalBatches}` : '';
    if (status.isProcessing()) {
      return (
        <p>{`🕒 Transaction ${batchMessage} processing: ${status.message}`}</p>
      )
    } else if (status.isFinalized()) {
      return (
        <p>
          <a href={BLOCK_EXPLORER_URL + status.block}>
            {`✅ Transaction ${batchMessage} finalized`}
          </a>
        </p>
      );
    } else if (status.isFailed()) {
      return (
        <p>
          <a href={BLOCK_EXPLORER_URL + status.block}>
            {`❌ Transaction ${batchMessage} failed: ${status.message}`}
          </a>
        </p>
      )
    }
  }

  return <div>{prevStatuses.concat(txStatus).map((status, txIdx) => formatStatus(status, txIdx + 1))}</div>
}
