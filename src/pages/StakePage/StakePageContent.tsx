import React, { useEffect } from 'react';
import { useTxStatus } from 'contexts/txStatusContext';
import { showError, showInfo, showSuccess } from 'utils/ui/Notifications';
import { useConfig } from 'contexts/configContext';
import DowntimeModal from 'components/Modal/downtimeModal';
import MobileNotSupportedModal from 'components/Modal/mobileNotSupported';
import userIsMobile from 'utils/ui/userIsMobile';
import { useKeyring } from 'contexts/keyringContext';
import CalamariFooter from 'components/Footer';
import initAxios from 'utils/api/initAxios';
import AccountDisplay from './AccountDisplay';
import StakingTable from './Tables/StakingTable';
import UnstaktingTable from './Tables/UnstakingTable';
import CollatorsTable from './Tables/CollatorsTable';

const StakePageContent = () => {
  const { keyring } = useKeyring();
  const { txStatus } = useTxStatus();
  const config = useConfig();
  initAxios(config);

  document.title = config.PAGE_TITLE;

  useEffect(() => {
    if (keyring) {
      keyring.setSS58Format(config.SS58_FORMAT);
    }
  }, [keyring]);

  useEffect(() => {
    if (txStatus?.isFinalized()) {
      showSuccess(config, 'Transaction succeeded', txStatus?.extrinsic);
    } else if (txStatus?.isFailed()) {
      showError('Transaction failed');
    } else if (txStatus?.isProcessing()) {
      showInfo(txStatus.message);
    }
  }, [txStatus]);

  let warningModal = <div />;
  if (config.DOWNTIME) {
    warningModal = <DowntimeModal />;
  } else if (userIsMobile()) {
    warningModal = <MobileNotSupportedModal />;
  }

  return (
    <div className="w-full px-10 py-10">
      {warningModal}
      <AccountDisplay />
      <StakingTable />
      <UnstaktingTable />
      <CollatorsTable />
      <CalamariFooter />
    </div>
  );
};

export default StakePageContent;
