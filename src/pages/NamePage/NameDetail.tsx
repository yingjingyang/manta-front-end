import CopyPasteIcon from 'components/CopyPasteIcon';
import mnsLogo from 'resources/images/mnsLogo.png';
import arrowRight from 'resources/icons/arrow-right.svg';
import { useRef } from 'react';
import { useModal } from 'hooks';
import SearchHeader from './components/SearchHeader';
import StatusButton from './components/StatusButton';
import TransferModal from './components/TransferModal';
import RegisterConfirmModal from './components/RegisterConfirmModal';
const NameDetail = () => {
  const copyRef = useRef<HTMLImageElement>(null);
  const { ModalWrapper, showModal, hideModal } = useModal();
  const {
    ModalWrapper: ConfirmModalWrapper,
    showModal: showConfirmModal,
    hideModal: hideConfirmModal
  } = useModal();
  const handleCopy = () => {
    copyRef?.current?.click();
  };
  return (
    <div className="2xl:inset-x-0 flex flex-col flex-1 mx-10 mb-32 bg-secondary rounded-xl pb-6 ">
      <SearchHeader />
      <div className="flex">
        <div className="flex flex-col m-6 w-max">
          <div className="w-max bg-secondary rounded-xl py-12 px-20">
            <img src={mnsLogo} className="w-48 h-48 rounded-xl" />
          </div>
          <button
            className="px-8 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter mt-4"
            onClick={showConfirmModal}>
            Register
          </button>
        </div>
        <div className="flex flex-col flex-1 m-6 ml-5">
          <h2
            className="flex items-center text-white text-3xl cursor-pointer"
            onClick={handleCopy}>
            qwertyuiop...fghjklzxcvb.zk
            <CopyPasteIcon
              textToCopy="qwertyuiop"
              className="border border-1 border-forth rounded-lg p-1 ml-6 w-6 h-6 box-content"
              copyRef={copyRef}
            />
          </h2>
          <StatusButton status="available" className="mt-2 mb-4 w-max">
            Available
          </StatusButton>
          <div className="bg-sixth rounded-lg text-white text-opacity-60 pb-4">
            <h3 className="py-2 px-4 border-1 border-b border-third">Price</h3>
            <p className="text-white text-2xl px-4 pt-2">
              90.68 MANTA
              <span className="text-white text-opacity-60 ml-4 text-base">
                $30.9 USD
              </span>
            </p>
            <p className="text-white text-opacity-60 ml-4 text-sm">
              88.8 MANTA + ( ≈1.88 MANTA gas fee) = 90.68 MANTA
            </p>
          </div>
          <div className="bg-sixth rounded-lg text-white text-opacity-60 mt-4 pb-4">
            <h3 className="py-2 px-4 border-1 border-b border-third">Info</h3>
            <p className="text-white text-opacity-60 text-sm flex justify-between m-4 mb-2">
              Parent
              <span className="text-opacity-100 text-white">zk</span>
            </p>
            <p className="text-white text-opacity-60 text-sm flex justify-between m-4">
              Registrant
              <span className="text-opacity-100 text-white">000</span>
            </p>
            <p className="text-manta-register flex justify-end m-4">
              <button className="flex items-center" onClick={() => showModal()}>
                Transfer
                <img src={arrowRight} className="w-3.5 h-3.5 ml-2.5" />
              </button>
            </p>
          </div>
        </div>
      </div>
      <ModalWrapper>
        <TransferModal hideModal={hideModal} />
      </ModalWrapper>
      <ConfirmModalWrapper>
        <RegisterConfirmModal hideModal={hideConfirmModal} />
      </ConfirmModalWrapper>
    </div>
  );
};
export default NameDetail;
