import React, { useState } from 'react';
import MantaIcon from 'resources/images/manta.png';
import OutsideClickHandler from 'react-outside-click-handler';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useModal } from 'hooks';
import ConnectSignerModal from 'components/Modal/connectSigner';
import ZkAccountModal from '../Accounts/ZkAccountModal';

const ZkAccountButton = () => {
  const [showZkModal, setShowZkModal] = useState(false);
  const { privateAddress } = usePrivateWallet();
  const { ModalWrapper, showModal } = useModal();

  const ZkAccountDisplay = () => {
    return (
      <div className="relative">
        <OutsideClickHandler onOutsideClick={() => setShowZkModal(false)}>
          <div
            className="flex gap-3 py-3 px-4 bg-secondary text-secondary font-medium cursor-pointer rounded-lg"
            onClick={() => setShowZkModal(!showZkModal)}
          >
            <img className="w-6 h-6" src={MantaIcon} alt="Manta" />
            zkAddress
          </div>
          {showZkModal && <ZkAccountModal />}
        </OutsideClickHandler>
      </div>
    );
  };

  const ZkAccountConnect = () => {
    return (
      <>
        <button
          className="btn-secondary py-3 px-4 font-medium cursor-pointer rounded-lg"
          onClick={showModal}
        >
          Connect Signer
        </button>
        <ModalWrapper>
          <ConnectSignerModal />
        </ModalWrapper>
      </>
    );
  };

  return privateAddress ? <ZkAccountDisplay /> : <ZkAccountConnect />;
};

export default ZkAccountButton;
