// @ts-nocheck
import { useModal } from 'hooks';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConnectWalletModal from 'components/Modal/connectWalletModal';
import Button from 'components/Button';

const ConnectWallet = ({ isButtonShape, setIsMetamaskSelected }) => {
  const { ModalWrapper, showModal } = useModal();
  const handleOnClick = () => showModal();
  return (
    <>
      {isButtonShape ? (
        <Button
          className="btn-secondary rounded-lg relative z-10"
          onClick={handleOnClick}
        >
          Connect Wallet
        </Button>
      ) : (
        <FontAwesomeIcon
          className="w-6 h-6 px-5 py-4 cursor-pointer z-10 text-secondary"
          icon={faPlusCircle}
          onClick={handleOnClick}
        />
      )}
      <ModalWrapper>
        <ConnectWalletModal setIsMetamaskSelected={setIsMetamaskSelected} />
      </ModalWrapper>
    </>
  );
};


export default ConnectWallet;