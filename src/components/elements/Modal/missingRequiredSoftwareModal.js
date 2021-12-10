import React, { useState, useEffect } from 'react';
import { Header, Icon, Modal } from 'semantic-ui-react';
import { useKeyring } from 'contexts/keyringContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import classNames from 'classnames';


function MissingRequiredSoftwareModal() {
  const [modalCanBeOpened, setModalCanBeOpened] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { keyring } = useKeyring();
  const { signerIsConnected } = usePrivateWallet();

  useEffect(() => {
    const maybeOpenModal = () => {
      if (!modalCanBeOpened) {
        return;
      // Show the modal if web app tried and failed to detect required software
      } else if (keyring === false || signerIsConnected === false) {
        openModal();
      // Close modal if app  first failed to detect required software,
      // but then subsequently detects it
      } else if (modalIsOpen) {
        setModalIsOpen(false);
      // If required software is ever detected, don't allow modal to be opened later
      // (for the case where the user quits Manta Signer)
      } else if (keyring && signerIsConnected) {
        setModalCanBeOpened(false);
      }
    };
    maybeOpenModal();
  }, [modalCanBeOpened, keyring, signerIsConnected]);

  const openModal = () => {
    setModalIsOpen(true);
    // Modal should only ever be shown once
    setModalCanBeOpened(false);
  };

  return (
    <Modal
      basic
      centered={false}
      dimmer="blurring"
      open={modalIsOpen}
      onClose={() => setModalIsOpen(false)}
      size="small"
      className="pt-12"
    >
      <Header icon style={{'borderBottom': '0px'}}>
        <Icon name="download" size="small"/>
        Missing required software
      </Header>
      <Modal.Content>
        {(keyring === false) &&
          <p className="pl-16">
            Install{' '}
            <a
              href="https://polkadot.js.org/extension/"
              className="link-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              polkadot.js
            </a>
            , create an account, and allow it to access this site.
          </p>
        }
        {(signerIsConnected === false) &&
          <p className={classNames('pl-16', {'pt-6': (keyring === false)})}>
            Install{' '}
            <a
              href="https://github.com/Manta-Network/manta-signer/releases/"
              className="link-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manta Signer
            </a>
            , open it, and sign in or create an account.
          </p>
        }
      </Modal.Content>
    </Modal>
  );
}

export default MissingRequiredSoftwareModal;





