import React, { useState, useEffect } from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import Button from 'components/elements/Button';
import MantaLoading from 'components/elements/Loading';
import TabMenuWrapper from 'components/elements/TabMenu/TabMenuWrapper';
import TabMenu from 'components/elements/TabMenu/TabMenu';
import TabContentItemWrapper from 'components/elements/TabMenu/TabContentItemWrapper';
import FormSelect from 'components/elements/Form/FormSelect';
import { showSuccess } from 'utils/notifications.util';
import FormInput from 'components/elements/Form/FormInput';
import Images from 'common/Images';

const TABS = {
  Deposit: 'deposit',
  Withdraw: 'withdraw',
};

const AccountPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTabIdx, setSelectedTabIdx] = useState(TABS.Deposit);

  const onDepositHandler = () => {
    setLoading(true);
    setTimeout(() => {
      showSuccess('Deposited successfully!');
      setLoading(false);
    }, 3000);
  };

  return (
    <PageContent>
      <Navbar />
      <div className="flex pt-20 lg:py-0 justify-center">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <h1 className="text-3xl font-semibold pb-6 mb-0 text-accent">Account</h1>
          <TabMenuWrapper className="pb-6">
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
          <FormSelect label="Token" coinIcon={Images.TokenIcon} />
          <div className="pb-6">
            <FormInput step="0.01">Available: 100 DOT</FormInput>
          </div>
          <TabContentItemWrapper tabIndex={TABS.Deposit} currentTabIndex={selectedTabIdx}>
            {loading ? (
              <MantaLoading className='py-4' />
            ) : (
              <Button
                onClick={onDepositHandler}
                className="btn-primary btn-hover w-full text-lg py-3"
              >
                Deposit
              </Button>
            )}
          </TabContentItemWrapper>
          <TabContentItemWrapper tabIndex={TABS.Withdraw} currentTabIndex={selectedTabIdx}>
            <Button className="btn-primary btn-hover hover:animate-pulse w-full text-lg py-3">
              Withdraw
            </Button>
          </TabContentItemWrapper>
        </div>
      </div>
      <div className="hidden lg:block h-10" />
    </PageContent>
  );
};

export default AccountPage;
