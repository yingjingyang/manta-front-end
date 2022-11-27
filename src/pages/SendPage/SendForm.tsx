// @ts-nocheck
import React, { useEffect } from 'react';
import Svgs from 'resources/icons';
import MissingRequiredSoftwareModal from 'components/Modal/missingRequiredSoftwareModal';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import NewerSignerVersionRequiredModal from 'components/Modal/newerSignerVersionRequiredModal';
import { useConfig } from 'contexts/configContext';
import DowntimeModal from 'components/Modal/downtimeModal';
import Navs from 'components/Navbar/Navs';
import MobileNotSupportedModal from 'components/Modal/mobileNotSupported';
import userIsMobile from 'utils/ui/userIsMobile';
import { useKeyring } from 'contexts/keyringContext';
import SendFromForm from './SendFromForm';
import SendToForm from './SendToForm';

const SendForm = () => {
  const config = useConfig();
  const { keyring } = useKeyring();
  const { signerVersion } = usePrivateWallet();

  useEffect(() => {
    if (keyring) {
      keyring.setSS58Format(config.SS58_FORMAT);
    }
  }, [keyring]);

  document.title = config.PAGE_TITLE;

  let warningModal = <div />;
  if (config.DOWNTIME) {
    warningModal = <DowntimeModal />;
  } else if (userIsMobile()) {
    warningModal = <MobileNotSupportedModal />;
  } else if (signerIsOutOfDate(config, signerVersion)) {
    warningModal = <NewerSignerVersionRequiredModal />;
  }

  return (
    <div>
      {warningModal}
      <div className="2xl:inset-x-0 justify-center min-h-full flex flex-col gap-6 items-center pb-2">
        <Navs />
        <div className="w-113.5 px-12 py-6 bg-secondary rounded-3xl">
          <SendFromForm />
          <img
            className="mx-auto pt-1 pb-4 manta-gray"
            src={Svgs.ArrowUpDownIcon}
            alt="arrow-up-down-icon"
          />
          <SendToForm />
        </div>
      </div>
    </div>
  );
};

export default SendForm;
