// @ts-nocheck
const FINALIZED = 'finalized';
const FAILED = 'failed';
const PROCESSING = 'processing';

export default class TxStatus {
  status: string;
  extrinsic: string | null;
  block: string | null;
  message: string | null;
  batchNum: null;
  totalBatches: null;

  constructor(status: string, extrinsic: null | string = null, block: null | string = null, message: null | string = null) {
    this.status = status;
    this.extrinsic = extrinsic;
    this.block = block;
    this.message = message;
    this.batchNum = null;
    this.totalBatches = null;
  }

  static processing(message: string | null): TxStatus {
    return new TxStatus({status: PROCESSING, message: message});
  }

  static finalized(extrinsic: string | null, block: string | null): TxStatus {
    return new TxStatus({status: FINALIZED, extrinsic: extrinsic, block: block});
  }

  static failed(block: string | null, message: string | null): TxStatus {
    return new TxStatus({status: FAILED, block: block, message: message});
  }

  isProcessing(): boolean {
    return this.status === PROCESSING;
  }

  isFinalized(): boolean {
    return this.status === FINALIZED;
  }

  isFailed(): boolean {
    return this.status === FAILED;
  }

  toString(): string {
    let message = this.status;
    if (this.block) {
      message += `;\n block hash: ${this.block}`;
    }
    if (this.message) {
      message += `;\n ${this.message}`;
    }
    return message;
  }
}
