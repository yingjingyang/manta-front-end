//@ts-nocheck
import React, { useState } from 'react';
import { useConfig } from 'contexts/configContext';
import OutsideClickHandler from 'react-outside-click-handler';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useModal } from 'hooks';
import ConnectSignerModal from 'components/Modal/connectSigner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import classNames from 'classnames';
import { API_STATE, useSubstrate } from 'contexts/substrateContext';
import Icon from 'components/Icon';
import ZkAccountInfoModal from '../Accounts/ZkAccountInfoModal';
import ZkAccountModal from '../Accounts/ZkAccountModal';

const ZkAccountDisplay = () => {
  const [showZkModal, setShowZkModal] = useState(false);
  const { apiState } = useSubstrate();
  const isDisconnected = apiState === API_STATE.DISCONNECTED  || apiState === API_STATE.ERROR;

  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowZkModal(false)}>
        {isDisconnected && (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="absolute top-0 right-0 w-5 h-5"
            color="#FFFFFF"
          />
        )}
        <div
          className="flex flex-row justify-center items-center gap-3 h-10 w-36 text-white font-medium cursor-pointer bg-fifth border border-#FFFFFF1A rounded-lg"
          onClick={() => setShowZkModal(!showZkModal)}>
          <Icon className="w-6 h-6" name="manta" />
          zkAddress
        </div>
        {showZkModal && <ZkAccountModal />}
      </OutsideClickHandler>
    </div>
  );
};

const ZkAccountWarning = ({
  title,
  text,
  showInstallButton,
  showWarningIcon
}) => {
  const [showZkModal, setShowZkModal] = useState(false);
  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowZkModal(false)}>
        {showWarningIcon && (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="absolute top-0 right-0 w-5 h-5"
            color="#FFFFFF"
          />
        )}
        <div
          className="flex gap-3 py-3 px-4 text-white font-medium cursor-pointer bg-fifth border border-#FFFFFF1A rounded-lg"
          onClick={() => setShowZkModal(!showZkModal)}>
          <Icon className="w-6 h-6" name="manta" />
          zkAddress
        </div>
        {showZkModal && (
          <ZkAccountInfoModal
            title={title}
            text={text}
            showInstallButton={showInstallButton}
          />
        )}
      </OutsideClickHandler>
    </div>
  );
};

export const ZkAccountConnect = ({ className = '' }) => {
  const { ModalWrapper, showModal } = useModal();
  return (
    <>
      <button className={classNames(className)} onClick={showModal}>
        Connect Signer
      </button>
      <ModalWrapper>
        <ConnectSignerModal />
      </ModalWrapper>
    </>
  );
};

const ZkAccountButton = () => {
  const { privateAddress, signerVersion } = usePrivateWallet();
  const config = useConfig();

  if (privateAddress) {
    return <ZkAccountDisplay />;
  } else if (signerIsOutOfDate(config, signerVersion)) {
    return (
      <ZkAccountWarning
        title={'Manta Signer Out of Date'}
        text={
          'Your Manta Signer install is out of date. Please install the latest version to view your zkAddress and zkAssets.'
        }
        showWarningIcon={true}
        showInstallButton={true}
      />
    );
  } else {
    return (
      <ZkAccountConnect
        className={
          'bg-connect-signer-button text-white h-10 w-36 font-medium cursor-pointer rounded-lg'
        }
      />
    );
  }
};

export default ZkAccountButton;
