// @ts-nocheck
import AssetType from 'types/AssetType';
import { hexAddPrefix, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import Chain from 'types/Chain';

// for xcmPallet.limitedReserveTransferAsset
const assets_XcmPallet = (api, value) => {
  return api.createType('XcmVersionedMultiAssets', {
    v1: [api.createType('XcmV1MultiAsset', {
      id: api.createType('XcmV1MultiassetAssetId', {
        concrete: api.createType('XcmV1MultiLocation', {
          parents: 0,
          interior: api.createType('XcmV1MultilocationJunctions', 'Here')
        })
      }),
      fun: api.createType('XcmV1MultiassetFungibility', {
        fungible: value.toString()
      })
    })]}
  );
};

// for xcmPallet.limitedReserveTransferAsset
const relayChainToParachainDest_XcmPallet = (api, parachainId) => {
  return api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 0,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          parachain: parachainId
        })
      })
    })
  });
};

const beneficiary_XcmPallet = (api, accountId) => {
  return api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 0,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          accountId32: {
            network: api.createType('XcmV0JunctionNetworkId', { any: true }),
            id: accountId
          }
        })
      })
    })
  });
};

const parachainToParachainDest_Xtokens = (api, parachainId, accountId) => {
  return api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 1,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x2: [
          api.createType('XcmV1Junction', {
            parachain: parachainId
          }),
          api.createType('XcmV1Junction', {
            accountId32: {
              network: api.createType('XcmV0JunctionNetworkId', { any: true }),
              id: accountId
            }
          })
        ]})
    })
  });
};

const karuraAssetId_Xtoken = (api, assetType) => {
  return api.createType('AcalaPrimitivesCurrencyCurrencyId', {
    Token: api.createType('AcalaPrimitivesCurrencyTokenSymbol',  assetType.baseTicker)
  });
};

const calamariAssetIdXtoken = (api, assetType) => {
  return api.createType('CurrencyId', {
    MantaCurrency: api.createType('AssetId',  assetType.assetId)
  });

};

const assetId_Xtoken = (api, sourceParachainId, assetType) => {
  switch(sourceParachainId) {
  case Chain.Calamari().parachainId:
    return calamariAssetIdXtoken(api, assetType); // assetId
  case Chain.Karura().parachainId:
    return karuraAssetId_Xtoken(api, assetType); // asset symbol (like "KAR")
  default:
    throw new Error('Unrecognized parachain');
  }
};

const getParachainWeightLimit = (parachainId) => {
  switch(parachainId) {
  case Chain.Calamari().parachainId:
    return 4 * 1000000000;
  case Chain.Karura().parachainId:
    return 4 * 2000000000;
  default:
    throw new Error('Unrecognized parachain');
  }
};

const getRelayChainWeightLimit = () => {
  return 4 * 1000000000;
};

const getParachainWeightLimit_XcmPallet = (api) => {
  return api.createType('XcmV2WeightLimit', {
    unlimited: true,
  });
};



const transferRelayChainToParachain_XcmPallet = (
  api,
  valueAtomicUnits,
  parachainId,
  accountId
) => {
  const dest = relayChainToParachainDest_XcmPallet(api, parachainId);
  const assets = assets_XcmPallet(api, valueAtomicUnits);
  const beneficiary = beneficiary_XcmPallet(api, accountId);
  const feeAssetItem = 0; // index of asset that pays xcm fee
  const weightLimit = getParachainWeightLimit_XcmPallet(api);
  return api.tx.xcmPallet.limitedReserveTransferAssets(
    dest, beneficiary, assets, feeAssetItem, weightLimit
  );
};

const parachainToRelayChainDest_Xtokens = (api, accountId) => {
  return api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 1,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          accountId32: {
            network: api.createType('XcmV0JunctionNetworkId', { any: true }),
            id: accountId
          }
        })
      })
    })
  });
};

const transferParachainToRelayChain_Xtokens = (
  api,
  sourceParachainId,
  assetType,
  accountId,
  valueAtomicUnits
) => {
  const assetId = assetId_Xtoken(api, sourceParachainId, assetType);
  const dest = parachainToRelayChainDest_Xtokens(api, accountId);
  const weightLimit = getRelayChainWeightLimit();
  return api.tx.xTokens.transfer(assetId, valueAtomicUnits, dest, weightLimit);
};

const transferParachainToParachain_Xtokens = (
  api,
  sourceParachainId,
  assetType,
  parachainId,
  accountId,
  valueAtomicUnits
) => {
  const assetId = assetId_Xtoken(api, sourceParachainId, assetType);
  const dest = parachainToParachainDest_Xtokens(api, parachainId, accountId);
  const weightLimit = getParachainWeightLimit(sourceParachainId);
  return api.tx.xTokens.transfer(assetId, valueAtomicUnits, dest, weightLimit);
};

const addressToAccountId = (address) => {
  return hexAddPrefix(u8aToHex(decodeAddress(address)));
};

export const transferKarFromCalamariToKarura = (
  api, address, valueAtomicUnits
) => {
  return transferParachainToParachain_Xtokens(
    api,
    Chain.Calamari().parachainId,
    AssetType.Karura(false),
    Chain.Karura().parachainId,
    addressToAccountId(address),
    valueAtomicUnits
  );
};

export const transferKarFromKaruraToCalamari = (api, address, valueAtomicUnits) => {
  return transferParachainToParachain_Xtokens(
    api,
    Chain.Karura().parachainId,
    AssetType.Karura(false),
    Chain.Calamari().parachainId,
    addressToAccountId(address),
    valueAtomicUnits
  );
};

export const transferRocFromCalamariToRococo = (api, address, valueAtomicUnits) => {
  return transferParachainToRelayChain_Xtokens(
    api,
    Chain.Calamari().parachainId,
    AssetType.Rococo(false),
    addressToAccountId(address),
    valueAtomicUnits
  );
};

export const transferRocFromRococoToCalamari = (api, address, valueAtomicUnits) => {
  return transferRelayChainToParachain_XcmPallet(
    api,
    valueAtomicUnits,
    Chain.Calamari().parachainId,
    addressToAccountId(address)
  );
};

export const transferMovrFromCalamariToMoonriver = (api, address, valueAtomicUnits) => {
  return transferParachainToRelayChain_Xtokens(
    api,
    Chain.Calamari().parachainId,
    AssetType.Moonriver(false),
    addressToAccountId(address),
    valueAtomicUnits
  );
};
