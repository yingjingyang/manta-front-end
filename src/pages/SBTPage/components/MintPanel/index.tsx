import { useModal } from 'hooks';
import { useSBT } from 'pages/SBTPage/SBTContext';
import MantaIcon from 'resources/images/manta.png';
import MintCheckModal from '../MintCheckModal';
import MintedModal from '../MintedModal';

const MintPanel = () => {
  const { mintSet } = useSBT();
  const { ModalWrapper, showModal, hideModal } = useModal();
  const { ModalWrapper: MintedModalWrapper, showModal: showMintedModal } =
    useModal();

  const firstMintedFile = [...mintSet][0];
  return (
    <div className="relative flex-1 flex flex-col mx-auto mb-20 bg-secondary rounded-xl p-6 w-75 relative mt-6 z-0">
      <div className="flex items-center">
        <img src={MantaIcon} className="w-8 h-8 mr-3" />
        <h2 className="text-2xl">zkSBT</h2>
      </div>
      <h1 className="text-3xl my-6">Mint Your zkSBT</h1>
      <div className="flex ml-6">
        <img
          src={URL.createObjectURL(firstMintedFile.file)}
          className="w-80 h-80 rounded-2xl"
        />
        <div className="bg-primary rounded-lg w-max ml-6 pb-4">
          <p className="text-white text-opacity-60 border-bottom border-split p-4">
            Please select up to one Crypto Watermark to include in your zkSBT.
          </p>
          <div className="grid mt-4 m-l-4 grid-cols-5 gap-4 px-4">
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1 bg-light-check border-check">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
            <span className="flex justify-between border-2 border-white rounded-2xl cursor-pointer w-32 px-3 py-1">
              <img src={MantaIcon} className="w-6 h-6 rounded-full" />
              MANTA
            </span>
          </div>
        </div>
        <button
          onClick={showModal}
          className="absolute px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter bottom-8 left-1/2 -translate-x-1/2 transform ">
          Mint
        </button>
      </div>
      <ModalWrapper>
        <MintCheckModal
          hideModal={hideModal}
          showMintedModal={showMintedModal}
        />
      </ModalWrapper>
      <MintedModalWrapper>
        <MintedModal />
      </MintedModalWrapper>
    </div>
  );
};

export default MintPanel;
