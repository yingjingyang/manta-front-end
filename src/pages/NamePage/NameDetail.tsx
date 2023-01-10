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
          <div className="flex flex-col mt-4">
            <div className="bg-primary h-1 w-full rounded-xl">
              <div className="gradient-button rounded-xl h-1 w-1/2"></div>
            </div>
            <h3 className="text-white text-sm mt-2 mb-1">2.Wait...</h3>
            <p className="text-white text-opacity-40 text-xs">Ensuring time</p>
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
              className="border border-1 border-fourth rounded-lg p-1 ml-6 w-6 h-6 box-content bg-secondary"
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
            <p className="text-fourth flex justify-end m-4">
              <button className="flex items-center" onClick={showModal}>
                Transfer
                <svg
                  className="w-3.5 h-3.5 ml-2.5"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.33374 6.66654C0.33374 7.98509 0.724733 9.27402 1.45728 10.3703C2.18982 11.4667 3.23101 12.3212 4.44918 12.8257C5.66736 13.3303 7.0078 13.4623 8.30101 13.2051C9.59422 12.9479 10.7821 12.3129 11.7145 11.3806C12.6468 10.4482 13.2817 9.26035 13.539 7.96715C13.7962 6.67394 13.6642 5.3335 13.1596 4.11532C12.655 2.89715 11.8005 1.85596 10.7042 1.12341C9.60788 0.390871 8.31895 -0.00012207 7.00041 -0.00012207C6.12493 -0.00012207 5.25802 0.172316 4.44918 0.507348C3.64035 0.842379 2.90542 1.33344 2.28636 1.9525C1.03612 3.20274 0.33374 4.89843 0.33374 6.66654ZM8.24041 4.20654L10.1471 6.20654C10.1753 6.23547 10.1979 6.26937 10.2137 6.30654C10.242 6.33791 10.2646 6.37402 10.2804 6.41321C10.3157 6.49301 10.3339 6.5793 10.3339 6.66654C10.3339 6.75379 10.3157 6.84008 10.2804 6.91988C10.2487 7.00171 10.2011 7.07648 10.1404 7.13988L8.14041 9.13988C8.01487 9.26541 7.84461 9.33594 7.66707 9.33594C7.48954 9.33594 7.31928 9.26541 7.19374 9.13988C7.0682 9.01434 6.99768 8.84408 6.99768 8.66654C6.99768 8.48901 7.0682 8.31875 7.19374 8.19321L8.06041 7.33321H4.33374C4.15693 7.33321 3.98736 7.26297 3.86234 7.13795C3.73731 7.01292 3.66707 6.84336 3.66707 6.66654C3.66707 6.48973 3.73731 6.32016 3.86234 6.19514C3.98736 6.07012 4.15693 5.99988 4.33374 5.99988H8.10707L7.27374 5.12654C7.15174 4.99836 7.08566 4.82695 7.09004 4.65004C7.09441 4.47314 7.16888 4.30521 7.29707 4.18321C7.42526 4.06121 7.59666 3.99513 7.77357 3.99951C7.95048 4.00388 8.11841 4.07836 8.24041 4.20654Z"
                    fill="#00E3D6"
                  />
                </svg>
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
