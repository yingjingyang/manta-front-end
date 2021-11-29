import React, { useState } from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import FormSelect from 'components/elements/Form/FormSelect';
import AssetType from 'types/AssetType';
import { useTxStatus } from 'contexts/txStatusContext';
import PublicPrivateToggle from 'pages/TransactPage/publicPrivateToggle';
import PrivateAssetTabs from './privateAssetTabs';
import PublicAssetTabs from './publicAssetTabs';
import NativeTokenTabs from './nativeTokenTabs';

const TransactPage = () => {
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [selectedAssetIsPrivate, setSelectedAssetIsPrivate] = useState(false);
  const { txStatus } = useTxStatus();

  let tabs;
  if (selectedAssetType?.isNativeToken) {
    tabs = <NativeTokenTabs selectedAssetType={selectedAssetType} />;
  } else if (selectedAssetIsPrivate) {
    tabs = <PrivateAssetTabs selectedAssetType={selectedAssetType} />;
  } else {
    tabs = <PublicAssetTabs selectedAssetType={selectedAssetType} />;
  }

  return (
    <PageContent>
      <Navbar />
      <div className="flex justify-center pt-20 lg:pt-8 pb-4">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <div>
            <h1 className="text-3xl pb-4 mb-0 font-semibold text-accent">
              Transact
            </h1>
            <PublicPrivateToggle
              selectedAssetIsPrivate={selectedAssetIsPrivate}
              setSelectedAssetIsPrivate={setSelectedAssetIsPrivate}
            />
          </div>
          <FormSelect
            label="Token"
            selectedOption={selectedAssetType}
            setSelectedOption={setSelectedAssetType}
            options={AssetType.AllCurrencies(selectedAssetIsPrivate)}
            disabled={txStatus?.isProcessing()}
            selectedAssetIsPrivate={selectedAssetIsPrivate}
          />
          {tabs}
        </div>
      </div>
    </PageContent>
  );
};

export default TransactPage;
