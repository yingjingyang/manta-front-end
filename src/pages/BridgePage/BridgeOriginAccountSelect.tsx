// @ts-nocheck
import PublicFromAccountSelect from 'pages/SendPage/SendFromForm/FromAccountSelect';
import React from 'react';
import AssetType from 'types/AssetType';
import { useBridge } from './BridgeContext';
import MetamaskAccountDisplay from './MetamaskAccountDisplay';

const BridgeOriginAccountSelect = () => {
  const {
    senderSubstrateAccount,
    senderSubstrateAccountOptions,
    setSenderSubstrateAccount,
    senderAssetType
  } = useBridge();

  console.log('lol', AssetType.Moonriver(false), AssetType.Moonriver(false).assetId);

  return (
    <>
      {
        (senderAssetType?.assetId === AssetType.Moonriver(false).assetId)
          ? <MetamaskAccountDisplay />
          : <div>todo</div>
          // <PublicFromAccountSelect
          //   senderPublicAccount={senderSubstrateAccount}
          //   senderPublicAccountOptions={senderSubstrateAccountOptions}
          //   setSenderPublicAccount={setSenderSubstrateAccount}
          // />
      }
    </>
  );
};

export default BridgeOriginAccountSelect;
