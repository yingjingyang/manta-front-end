// @ts-nocheck
import React, { useEffect } from 'react';
import config from 'config';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { SendPage } from 'pages';
import MissingRequiredSoftwareModal from 'components/Modal/missingRequiredSoftwareModal';
import MobileNotSupportedModal from 'components/Modal/mobileNotSupported';
import Sidebar from 'components/Sidebar';
import ThemeToggle from 'components/ThemeToggle';
import userIsMobile from 'utils/ui/userIsMobile';
import NewerSignerVersionRequiredModal from 'components/Modal/newerSignerVersionRequiredModal';
import DowntimeModal from 'components/Modal/downtimeModal';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useSubstrate } from 'contexts/substrateContext';
import { useKeyring } from 'contexts/keyringContext';
import { XcmVersionedMultiLocation, XcmV1MultilocationJunctions,  } from "@polkadot/types/lookup";
import { XcmVersionedMultiAsset } from "@polkadot/types/lookup";
import { XcmV1MultiLocation } from "@polkadot/types/lookup";
import { AcalaPrimitivesCurrencyCurrencyId } from '@acala-network/types/interfaces/types-lookup';
import BN from 'bn.js';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { ApiBase } from '@polkadot/api/base';
import BridgePage from 'pages/BridgePage';
import AssetType from 'types/AssetType';
import { hexAddPrefix, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { add } from 'husky';


const getCalamariDestinationFee = (assetId, tx) => {
  // const unitsPerSecond = await api.query.assetManager(assetId);
  // need to get weight on destination chain
  // const weight =
  // Dolphin / Calamari ---> 4000000000 weight 
  // Rococo / Kusama, 
  // Karura

  // KSM cost on Calamari = 666,666,666.668 KSM
  // KSM cost on Kusama = ?? KSM (check by transfering)

  // KAR cost on Calamari = 100000000000 KAR
  // KAR cost on Karura = ?? KAR (check by transfering)

  // let amount = unitsPerSecond * (weight as u128) / (WEIGHT_PER_SECOND as u128);
  // let amount = query_chain_state * (4000000000 const) / (1000000000000 const)
}

// for xcmPallet.limitedReserveTransferAsset
const assets_XcmPallet = (api, value) => {
  return api.createType("XcmVersionedMultiAssets", {
    v1: [api.createType("XcmV1MultiAsset", {
        id: api.createType("XcmV1MultiassetAssetId", {
            concrete: api.createType("XcmV1MultiLocation", {
                parents: 0,
                interior: api.createType('XcmV1MultilocationJunctions', 'Here')
            })
        }),
        fun: api.createType("XcmV1MultiassetFungibility", {
            fungible: value.toString()
        })
    })]}
  );
}

// for xcmPallet.limitedReserveTransferAsset
const relayChainToParachainDest_XcmPallet = (api, parachainId) => {
  return api.createType("XcmVersionedMultiLocation", {
    v1: api.createType("XcmV1MultiLocation", {
        parents: 0,
        interior: api.createType("XcmV1MultilocationJunctions", {
            x1: api.createType("XcmV1Junction", { 
                  parachain: parachainId
              })
            })
        })
    });
}

const beneficiary_XcmPallet = (api, accountId) => {
  return api.createType("XcmVersionedMultiLocation", {
    v1: api.createType("XcmV1MultiLocation", {
        parents: 0,
        interior: api.createType("XcmV1MultilocationJunctions", {
            x1: api.createType("XcmV1Junction", { 
                    accountId32: {
                        network: api.createType("XcmV0JunctionNetworkId", { any: true }),
                        id: accountId
                    }
                })
            })
        })
    });  
}



const parachainToParachainDest_Xtokens = (api, parachainId, accountId) => {
  return api.createType("XcmVersionedMultiLocation", {
    v1: api.createType("XcmV1MultiLocation", {
        parents: 1,
        interior: api.createType("XcmV1MultilocationJunctions", {
            x2: [
              api.createType("XcmV1Junction", { 
                  parachain: parachainId
              }),
              api.createType("XcmV1Junction", { 
                accountId32: {
                    network: api.createType("XcmV0JunctionNetworkId", { any: true }),
                    id: accountId
                }
              })
            ]})
        })
    });
}

const karuraAssetId_Xtoken = (api, assetType) => {
  return api.createType("AcalaPrimitivesCurrencyCurrencyId", {
    Token: api.createType("AcalaPrimitivesCurrencyTokenSymbol",  assetType.baseTicker)
  }) 
}

const calamariAssetIdXtoken = (api, assetType) => {
  return api.createType("CurrencyId", {
    MantaCurrency: api.createType("AssetId",  assetType.assetId)
  })

}


const assetId_Xtoken = (api, sourceParachainId, assetType) => {
  switch(sourceParachainId) {
    case 2084:
      return calamariAssetIdXtoken(api, assetType); // assetId
    case 2000:
      return karuraAssetId_Xtoken(api, assetType); // asset symbol (like "KAR")
    default:
      throw new Error("Unrecognized parachain")
  }
}



const getParachainWeightLimit = (parachainId) => {
  switch(parachainId) {
    case 2084:
      return 4 * 1000000000;
    case 2000:
      return 4 * 200000000;
    default:
      throw new Error("Unrecognized parachain")
  }
}

const getRelayChainWeightLimit = () => {
  return 4 * 1000000000
}

const getParachainWeightLimit_XcmPallet = (api) => {
    return api.createType("XcmV2WeightLimit", {
        unlimited: true,
        });
}



const transferRelayChainToParachain_XcmPallet = async (
    api,
    externalAccountSigner, 
    txResHandler,    
    valueAtomicUnits, 
    parachainId, 
    accountId
) => {
  const dest = relayChainToParachainDest_XcmPallet(api, parachainId)
  const assets = assets_XcmPallet(api, valueAtomicUnits)
  const beneficiary = beneficiary_XcmPallet(api, accountId)
  const feeAssetItem = 0; // index of asset that pays xcm fee
  const weightLimit = getParachainWeightLimit_XcmPallet(api)
  const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
    dest, beneficiary, assets, feeAssetItem, weightLimit
  );
  try {
    console.log(externalAccountSigner, 'externalAccountSigner')
    await tx.signAndSend(externalAccountSigner, txResHandler);
    console.log('tx sent')
  } catch (error) {
    console.error(error, 'tx failed to send')
  }
}

const parachainToRelayChainDest_Xtokens = (api, accountId) => {
    return api.createType("XcmVersionedMultiLocation", {
      v1: api.createType("XcmV1MultiLocation", {
          parents: 1,
          interior: api.createType("XcmV1MultilocationJunctions", {
              x1: api.createType("XcmV1Junction", { 
                      accountId32: {
                          network: api.createType("XcmV0JunctionNetworkId", { any: true }),
                          id: accountId
                      }
              })
          })
      })
    });
  }

const transferParachainToRelayChain_Xtokens = async (
    api,
    externalAccountSigner, 
    txResHandler,
    sourceParachainId, 
    assetType, 
    accountId, 
    valueAtomicUnits
) => {
  const assetId = assetId_Xtoken(api, sourceParachainId, assetType);
  const dest = parachainToRelayChainDest_Xtokens(api, accountId);
  const weightLimit = getRelayChainWeightLimit();
  const tx = api.tx.xTokens.transfer(assetId, valueAtomicUnits, dest, weightLimit);
  console.log(
    'tx', tx
  )
  try {
    await tx.signAndSend(externalAccountSigner, txResHandler);
    console.log('tx sent')
  } catch (error) {
    console.error(error, 'tx failed to send')
  }
}

const transferParachainToParachain_Xtokens = async (
    api,
    externalAccountSigner, 
    txResHandler,
    sourceParachainId, 
    assetType, 
    parachainId, 
    accountId, 
    valueAtomicUnits
) => {
  console.log('assetType 1', assetType)
  const assetId = assetId_Xtoken(api, sourceParachainId, assetType);
  const dest = parachainToParachainDest_Xtokens(api, parachainId, accountId);
  const weightLimit = getParachainWeightLimit(sourceParachainId);
  const tx = api.tx.xTokens.transfer(assetId, valueAtomicUnits, dest, weightLimit);
  console.log('tx', tx);
  try {
    await tx.signAndSend(externalAccountSigner, txResHandler);
    console.log('tx sent')
  } catch (error) {
    console.error(error, 'tx failed to send')
  }
}

const addressToAccountId = (address) => {
    return hexAddPrefix(u8aToHex(decodeAddress(address)))
}

export const transferKarFromCalamariToKarura = async (
    api, externalAccountSigner, txResHandler, address, valueAtomicUnits
) => {
  await transferParachainToParachain_Xtokens(
    api,
    externalAccountSigner, 
    txResHandler,    
    CALAMARI_PARACHAIN_ID, 
    AssetType.Karura(false), 
    KARURA_PARACHAIN_ID, 
    addressToAccountId(address), 
    valueAtomicUnits
  )
}



export const transferKarFromKaruraToCalamari = async (api, externalAccountSigner, txResHandler, address, valueAtomicUnits) => {
    
    await transferParachainToParachain_Xtokens(
    api,
    externalAccountSigner, 
    txResHandler,  
    KARURA_PARACHAIN_ID, 
    AssetType.Karura(false), 
    CALAMARI_PARACHAIN_ID, 
    addressToAccountId(address), 
    valueAtomicUnits
  )
}

export const transferRocFromCalamariToRococo = async (api, externalAccountSigner, txResHandler, address, valueAtomicUnits) => {
  await transferParachainToRelayChain_Xtokens(
    api,
    externalAccountSigner, 
    txResHandler,
    CALAMARI_PARACHAIN_ID, 
    AssetType.Rococo(false), 
    addressToAccountId(address), 
    valueAtomicUnits
  )
}

export const transferRocFromRococoToCalamari = async (api, externalAccountSigner, txResHandler, address, valueAtomicUnits) => {
  await transferRelayChainToParachain_XcmPallet(
    api,
    externalAccountSigner, 
    txResHandler,
    valueAtomicUnits, 
    CALAMARI_PARACHAIN_ID, 
    addressToAccountId(address)
  )
}





const KARURA_PARACHAIN_ID = 2000;
const CALAMARI_PARACHAIN_ID = 2084
const KAR_ASSET_ID = 8;
const ROC_ASSET_ID = 9;
const KAR_ASSET_SYMBOL = "KAR"
















