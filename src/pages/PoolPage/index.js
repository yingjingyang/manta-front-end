import React, { useState } from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import Button from 'components/elements/Button';
import Images from 'common/Images';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import FormSelect from 'components/elements/Form/FormSelect';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import FormInput from 'components/elements/Form/FormInput';

const TABS = {
  Deposit: 'deposit',
  Withdraw: 'withdraw',
};

const PoolPage = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(TABS.Deposit);

  return (
    <PageContent>
      <Navbar />
      <div className="flex h-full justify-center pt-20 pb-4 lg:py-0">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <div className="flex justify-between pb-4">
            <h1 className="text-3xl font-semibold text-accent">Pool</h1>
            <div className="text-sm manta-gray">
              <span className="flex pb-1">
                <img className="pr-2 pl-4" src={Images.SettingIcon} alt="setting-icon" />
                Slippage: 18%
              </span>
              <span>Gas price: 134 GWEI</span>
            </div>
          </div>
          <TabMenuWrapper className="pb-4">
            <TabMenu
              label="Deposit"
              onClick={() => setSelectedTabIdx(TABS.Deposit)}
              active={selectedTabIdx === TABS.Deposit}
              className="rounded-l-lg"
            />
            <TabMenu
              label="Withdraw"
              onClick={() => setSelectedTabIdx(TABS.Withdraw)}
              active={selectedTabIdx === TABS.Withdraw}
              className="rounded-r-lg"
            />
          </TabMenuWrapper>
          <div className="py-2">
            <FormSelect label="From" coinIcon={Images.TokenIcon} />
            <FormInput step="0.01">Available: 100 DOT</FormInput>
          </div>
          <img className="mx-auto" src={Images.SwitchIcon} alt="switch-icon" />
          <div className="py-2 pb-4">
            <FormSelect label="To" coinIcon={Images.CoinIcon} />
            <FormInput step="0.01" isMax={false}>
              1 DOT = 0.00332 Matic
            </FormInput>
          </div>
          <TabContentItemWrapper tabIndex={TABS.Deposit} currentTabIndex={selectedTabIdx}>
            <Button className="btn-primary w-full text-lg py-3">Pool</Button>
          </TabContentItemWrapper>
          <TabContentItemWrapper tabIndex={TABS.Withdraw} currentTabIndex={selectedTabIdx}>
            <Button className="btn-primary w-full text-lg py-3">Withdraw</Button>
          </TabContentItemWrapper>
        </div>
      </div>
      <div className="hidden lg:block h-10" />
    </PageContent>
  );
};

export default PoolPage;
