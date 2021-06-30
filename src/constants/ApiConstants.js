export const PALLET = Object.freeze({
  BALANCES: 'balances',
  MANTA_PAY: 'mantaPay'
});

export const CALLABLE = Object.freeze({
  BALANCES: { TRANSFER: 'transfer' },
  MANTA_PAY: {
    INIT_ASSET: 'initAsset',
    MINT_PRIVATE_ASSET: 'mintPrivateAsset',
    PRIVATE_TRANSFER: 'privateTransfer',
    RECLAIM: 'reclaim'
  }
});
