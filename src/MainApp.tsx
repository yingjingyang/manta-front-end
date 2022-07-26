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
import { XcmVersionedMultiLocation, XcmV1MultilocationJunctions,  } from '@polkadot/types/lookup';
import { XcmVersionedMultiAsset } from '@polkadot/types/lookup';
import { XcmV1MultiLocation } from '@polkadot/types/lookup';
import BN from 'bn.js';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { ApiBase } from '@polkadot/api/base';
import BridgePage from 'pages/BridgePage';


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
};

// for xcmPallet.limitedReserveTransferAsset
const assets_XcmPallet = (value) => {
  return api.createType('XcmVersionedMultiAssets', {
    v1: [api.createType('XcmV1MultiAsset', {
      id: api.createType('XcmV1MultiassetAssetId', {
        concrete: api.createType('XcmV1MultiLocation', {
          parents: 0,
          interior: api.createType('XcmV1MultilocationJunctions', 'Here')
        })
      }),
      fun: api.createType('XcmV1MultiassetFungibility', {
        fungible: value
      })
    })]}
  );
};

// for xcmPallet.limitedReserveTransferAsset
const relayChainToParachainDest_XcmPallet = (parachainId) => {
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

const beneficiary_XcmPallet = (accountId) => {
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

const parachainToRelayChainDest_Xtokens = (accountId) => {
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

const parachainToParachainDest_XTokens = (parachainId, accountId) => {
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

const karuraAssetId_Xtoken = (symbol = 'KAR') => {
  return api.createType('AcalaPrimitivesCurrencyCurrencyId', {
    Token: api.createType('AcalaPrimitivesCurrencyTokenSymbol',  symbol)
  });
};

const calamariAssetIdXtoken = (assetId) => {
  return api.createType('CurrencyId', {
    MantaCurrency: api.createType('AssetId',  assetId)
  });
};


const assetId_Xtoken = (sourceParachainId, assetIdentifier) => {
  switch(sourceParachainId) {
  case 2084:
    return calamariAssetIdXtoken(assetIdentifier); // assetId
  case 2000:
    return karuraAssetId_Xtoken(assetIdentifier); // asset symbol (like "KAR")
  default:
    throw new Error('Unrecognized parachain');
  }
};



const getParachainWeightLimit = (parachainId) => {
  switch(parachainId) {
  case 2084:
    return 4 * 1000000000;
  case 2000:
    return 4 * 200000000;
  default:
    throw new Error('Unrecognized parachain');
  }
};

const getRelayChainWeightLimit = () => {
  return 4 * 1000000000;
};



const transferRelayChainToParachain_XcmPallet = async (config, valueAtomicUnits, parachainId, accountId) => {
  const { api, externalAccountSigner, txResHandler } = config;
  const dest = relayChainToParachainDest_XcmPallet(parachainId);
  const assets = assets_XcmPallet(valueAtomicUnits);
  const beneficiary = beneficiary_XcmPallet(accountId);
  const feeAssetItem = 0; // index of asset that pays xcm fee
  const weightLimit = getParachainWeightLimit(parachainId);
  const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
    dest, beneficiary, assets, feeAssetItem, weightLimit
  );
  try {
    console.log(externalAccountSigner, 'externalAccountSigner');
    await tx.signAndSend(externalAccountSigner, txResHandler);
    console.log('tx sent');
  } catch (error) {
    console.error(error, 'tx failed to send');
  }
};

const transferParachainToRelayChain_Xtokens = async (config, sourceParachainId, assetIdentifier, accountId, valueAtomicUnits) => {
  const { api, externalAccountSigner, txResHandler } = config;
  const assetId = assetId_Xtoken(sourceParachainId, assetIdentifier);
  const dest = parachainToRelayChainDest_XTokens(accountId);
  const weightLimit = getRelayChainWeightLimit();
  const tx = api.tx.xTokens.transfer(assetId, valueAtomicUnits, dest, weightLimit);
  try {
    console.log(externalAccountSigner, 'externalAccountSigner');
    await tx.signAndSend(externalAccountSigner, txResHandler);
    console.log('tx sent');
  } catch (error) {
    console.error(error, 'tx failed to send');
  }
};

const transferParachainToParachain_Xtokens = async (config, sourceParachainId, assetIdentifier, parachainId, accountId, valueAtomicUnits) => {
  const { api, externalAccountSigner, txResHandler } = config;
  const assetId = assetId_Xtoken(sourceParachainId, assetIdentifier);
  const dest = parachainToParachainDest_XTokens(parachainId, accountId);
  const weightLimit = getParachainWeightLimit();
  const tx = api.tx.xTokens.transfer(assetId, valueAtomicUnits, dest, weightLimit);
  try {
    console.log(externalAccountSigner, 'externalAccountSigner');
    await tx.signAndSend(externalAccountSigner, txResHandler);
    console.log('tx sent');
  } catch (error) {
    console.error(error, 'tx failed to send');
  }
};

const transferKarFromCalamariToKarura = async (config, accountId, valueAtomicUnits) => {
  await transferParachainToParachain_Xtokens(
    config, CALAMARI_PARACHAIN_ID, KAR_ASSET_ID, KARURA_PARACHAIN_ID, accountId, valueAtomicUnits
  );
};
const transferKarFromKaruraToCalamari = async (config, accountId, valueAtomicUnits) => {
  await transferParachainToParachain_Xtokens(
    config, KARURA_PARACHAIN_ID, KAR_ASSET_SYMBOL, CALAMARI_PARACHAIN_ID, accountId, valueAtomicUnits
  );
};
const transferRocFromCalamariToRococo = async (config, accountId, valueAtomicUnits) => {
  await transferParachainToRelayChain_Xtokens(
    config, CALAMARI_PARACHAIN_ID, ROC_ASSET_ID, accountId, valueAtomicUnits
  );
};
const transferRocFromRococoToCalamari = async (config, accountId, valueAtomicUnits) => {
  await transferRelayChainToParachain_XcmPallet(
    config, valueAtomicUnits, CALAMARI_PARACHAIN_ID, accountId
  );
};

const KARURA_PARACHAIN_ID = 2000;
const CALAMARI_PARACHAIN_ID = 2084;
const KAR_ASSET_ID = 8;
const ROC_ASSET_ID = 9;
const KAR_ASSET_SYMBOL = 'KAR';




const transferRocFromDolphinToRococo = async () => {
  const dest = generateRococoDest();

  const tx = api.tx.xTokens.transfer(assetId, new BN(10000000000000), dest, 4000000000);
  try {
    console.log(externalAccountSigner, 'externalAccountSigner');
    await tx.signAndSend(externalAccountSigner, () => null);
    console.log('tx sent');
  } catch (error) {
    console.error(error, 'tx failed to send');
  }
  console.log('dest', dest);
};














function MainApp() {
  const  { api } = useSubstrate();
  const { externalAccountSigner } = useExternalAccount();


  useEffect(() => {
    if (!api || !externalAccountSigner) return;

    const tryXCMFromKarura = async () => {
      await api.isReady;

      const assetId = generateKaruraAssetId();
      const valueAtomicUnitsKar = new BN(10000000000000);
      const dest = generateDolphinDestXTokens();
      const tx = api.tx.xTokens.transfer(assetId, valueAtomicUnitsKar, dest, 4000000000);
      try {
        console.log(externalAccountSigner, 'externalAccountSigner');
        await tx.signAndSend(externalAccountSigner, () => null);
        console.log('tx sent');
      } catch (error) {
        console.error(error, 'tx failed to send');
      }

    };
    // tryXCMFromKarura()

    const tryXcmToKarura = async () => {
      await api.isReady;
      console.log('okay');

      const  assetId = api.createType('CurrencyId', {
        MantaCurrency: api.createType('AssetId',  8)
      });
      console.log('assetId', assetId);

      const dest = api.createType('XcmVersionedMultiLocation', {
        v1: api.createType('XcmV1MultiLocation', {
          parents: 1,
          interior: api.createType('XcmV1MultilocationJunctions', {
            x2: [
              api.createType('XcmV1Junction', {
                parachain: 2000
              }),
              api.createType('XcmV1Junction', {
                accountId32: {
                  network: api.createType('XcmV0JunctionNetworkId', { any: true }),
                  id: '0x067cd1c1f643afa675c6103c073188908a38f493771af44c71603f28b775370e' // param 1
                }
              }),
            ]
          })
        })
      });
      console.log('dest');

      const tx = api.tx.xTokens.transfer(assetId, new BN(1000000000000), dest, 800000000);
      try {
        console.log(externalAccountSigner, 'externalAccountSigner');
        await tx.signAndSend(externalAccountSigner, () => null);
        console.log('tx sent');
      } catch (error) {
        console.error(error, 'tx failed to send');
      }
      console.log('dest', dest);
    };
    // tryXcmToKarura()




    const tryXCMToRococo= async () => {
      await api.isReady;
      console.log('okay');

      const  assetId = api.createType('CurrencyId', {
        MantaCurrency: api.createType('AssetId',  8)
      });
      console.log('assetId', assetId);

      const dest = api.createType('XcmVersionedMultiLocation', {
        v1: api.createType('XcmV1MultiLocation', {
          parents: 1, // 0 if sending from relay chain
          interior: api.createType('XcmV1MultilocationJunctions', {
            x1: api.createType('XcmV1Junction', {
              accountId32: {
                network: api.createType('XcmV0JunctionNetworkId', { any: true }),
                id: '0x067cd1c1f643afa675c6103c073188908a38f493771af44c71603f28b775370e' // param 1
              }
            })
          })
        })
      });
      console.log('dest');

      const tx = api.tx.xTokens.transfer(assetId, new BN(10000000000000), dest, 4000000000);
      try {
        console.log(externalAccountSigner, 'externalAccountSigner');
        await tx.signAndSend(externalAccountSigner, () => null);
        console.log('tx sent');
      } catch (error) {
        console.error(error, 'tx failed to send');
      }
      console.log('dest', dest);
    };

    const tryXCMInbound = async () => {
      await api.isReady;

      const dest = api.createType('XcmVersionedMultiLocation', {
        v1: api.createType('XcmV1MultiLocation', {
          parents: 0,
          interior: api.createType('XcmV1MultilocationJunctions', {
            x1: api.createType('XcmV1Junction', {
              parachain: 2084
            })
          })
        })
      });

      const beneficiary = api.createType('XcmVersionedMultiLocation', {
        v1: api.createType('XcmV1MultiLocation', {
          parents: 0,
          interior: api.createType('XcmV1MultilocationJunctions', {
            x1: api.createType('XcmV1Junction', {
              accountId32: {
                network: api.createType('XcmV0JunctionNetworkId', { any: true }),
                id: '0x067cd1c1f643afa675c6103c073188908a38f493771af44c71603f28b775370e' // param 1
              }
            })
          })
        })
      });

      const assets = api.createType('XcmVersionedMultiAssets', {
        v1: [api.createType('XcmV1MultiAsset', {
          id: api.createType('XcmV1MultiassetAssetId', {
            concrete: api.createType('XcmV1MultiLocation', {
              parents: 0,
              interior: api.createType('XcmV1MultilocationJunctions', 'Here')
            })
          }),
          fun: api.createType('XcmV1MultiassetFungibility', {
            fungible: 5000000000000
          })
        })]}
      );

      // fee asset item = index of asset in array which pays fee
      const feeAssetItem = 0;

      // Manta runtime has a barrier called AllowTopLevelPaidExecutionFrom
      // which converts this "unlimited" to weight of 1 billion * 4 instructions = 4000000000
      const weightLimit = api.createType('XcmV2WeightLimit', {
        unlimited: true,
      });

      const tx = api.tx.xcmPallet.limitedReserveTransferAssets(dest, beneficiary, assets, feeAssetItem, weightLimit);
      try {
        console.log(externalAccountSigner, 'externalAccountSigner');
        await tx.signAndSend(externalAccountSigner, () => null);
        console.log('inbount tx sent');
      } catch (error) {
        console.error(error, 'inbound tx failed to send');
      }
    };

    tryXCMInbound();
    // tryXCMOutbound()
  }, [api, externalAccountSigner]);


  const { signerVersion } = usePrivateWallet();
  const onMobile = userIsMobile();

  // let warningModal;
  // if (config.DOWNTIME) {
  //   warningModal = <DowntimeModal />;
  // } else if (onMobile) {
  //   warningModal = <MobileNotSupportedModal />;
  // } else if (signerIsOutOfDate(signerVersion)) {
  //   warningModal = <NewerSignerVersionRequiredModal />;
  // } else {
  //   warningModal = <MissingRequiredSoftwareModal />;
  // }

  document.title = config.PAGE_TITLE;

  return (
    <div className="main-app bg-primary flex">
      <Sidebar />
      {/* {warningModal} */}
      <Switch>
        <Route path="/" render={() => <Redirect to="/transact" />} exact />
        <Route path="/send" render={() => <Redirect to="/transact" />} exact />
        <Route path="/transact" component={SendPage} exact />
        <Route path="/bridge" component={BridgePage} exact />
      </Switch>
      <div className="p-4 hidden change-theme lg:block fixed right-0 bottom-0">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default withRouter(MainApp);


