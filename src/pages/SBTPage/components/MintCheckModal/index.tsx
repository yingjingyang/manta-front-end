import DotLoader from 'components/Loaders/DotLoader';
import { useSBTPrivateWallet } from 'pages/SBTPage/SBTContext/sbtPrivateWalletContext';
import { UploadFile, useSBT } from 'pages/SBTPage/SBTContext';
import { useState } from 'react';

const MintImgs = () => {
  const { mintSet } = useSBT();
  return (
    <div className="max-w-xs overflow-hidden overflow-x-auto">
      <div className="w-max flex gap-4">
        {[...mintSet].map(({ file }, index) => {
          return (
            <div className="relative" key={index}>
              <img
                src={URL.createObjectURL(file)}
                className="w-24 h-24 rounded-2xl"
              />
              {index === 0 && (
                <span className="absolute bg-button-fourth-light px-4 rounded-2xl border border-thirdry bottom-2 left-1/2 transform -translate-x-1/2">
                  Free
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const MintCheckModal = ({
  hideModal,
  showMintedModal
}: {
  hideModal: () => void;
  showMintedModal: () => void;
}) => {
  const [loading, toggleLoading] = useState(false);

  const { mintSet, setMintSet } = useSBT();
  const { mintSBT } = useSBTPrivateWallet();

  const mintSBTConfirm = async () => {
    toggleLoading(true);
    const proofIds = await mintSBT();
    const newMintSet = new Set<UploadFile>();
    [...mintSet].forEach((mintFile, index) => {
      newMintSet.add({
        ...mintFile,
        proofId: proofIds[index]
      });
    });
    setMintSet(newMintSet);

    toggleLoading(false);
    hideModal();
    setTimeout(() => {
      showMintedModal();
    });
  };
  return (
    <div className="text-white w-128 text-center">
      <h2 className="text-2xl">Checkout</h2>
      <div className="bg-secondary rounded-lg mt-6 mb-4">
        <div className="flex justify-between p-4">
          <MintImgs />
          <div className="flex flex-col items-center">
            {mintSet.size === 1 ? (
              <span className="text-check">FREE</span>
            ) : (
              <>
                <span className="text-check">179.48 MANTA</span>
                <span className="text-white text-opacity-60">$30.9 USD</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between border-b border-split p-4">
          <p>Gas Fee</p>
          <span className="ml-auto text-opacity-60 text-white mr-2">
            + approximately
          </span>
          <span className="text-white">1.88 MANTA</span>
        </div>
        <div className="flex justify-between p-4">
          <p>Total</p>
          <div className="flex flex-col">
            <span className="text-check">179.84 MANTA</span>
            <span className="text-white text-opacity-60">$30.9 USD</span>
          </div>
        </div>
      </div>
      <button
        onClick={mintSBTConfirm}
        disabled={loading}
        className={`px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter mt-6 ${
          loading ? 'brightness-50 cursor-not-allowed' : ''
        }`}>
        Confirm
        {loading && <DotLoader />}
      </button>
    </div>
  );
};

export default MintCheckModal;
