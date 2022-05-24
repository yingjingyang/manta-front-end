// @ts-nocheck
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
      // Close modal if app  first failed to detect required software,
      // but then subsequently detects it
      if (modalIsOpen && keyring && signerIsConnected) {
        setModalIsOpen(false);
      // Don't activate the modal during this session as long as we have seen
      // the required software once
      } else if (keyring && signerIsConnected) {
        setModalCanBeOpened(false);
      }
      // If modal has been opened before, don't open it again during this session
      else if (!modalCanBeOpened) {
        return;
      // Show the modal if web app tried and failed to detect some required software
      } else if (keyring === false || signerIsConnected === false) {
        openModal();
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
              href="https://signer.manta.network/"
              className="link-text"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manta Signer
            </a>
            {' '}if you have not yet done so, open the app, and sign in.
          </p>
        }
      </Modal.Content>
    </Modal>
  );
}

export default MissingRequiredSoftwareModal;





