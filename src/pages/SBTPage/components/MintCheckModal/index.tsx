import DotLoader from 'components/Loaders/DotLoader';
import { useSBTPrivateWallet } from 'pages/SBTPage/SBTContext/sbtPrivateWalletContext';
import { UploadFile, useSBT } from 'pages/SBTPage/SBTContext';
import { useMemo, useState } from 'react';

const MintImgs = () => {
  const { mintSet } = useSBT();
  return (
    <div className="w-full p-4 overflow-hidden overflow-x-auto">
      <div className="w-max flex gap-4">
        {[...mintSet].map(({ file }, index) => {
          return (
            <img
              src={URL.createObjectURL(file)}
              className="w-24 h-24 rounded-2xl"
              key={index}
            />
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
  const mintInfo = useMemo(() => {
    if (mintSet.size === 1) {
      return {
        txt: '1 Free zkSTB',
        cost: 'Free'
      };
    }
    if (mintSet.size > 1) {
      return {
        txt: `1 Free + ${mintSet.size - 1} Extra Mint`,
        cost: `88.33 MANTA x ${mintSet.size - 1}`
      };
    }
  }, [mintSet]);

  return (
    <div className="text-white w-128 text-center">
      <h2 className="text-2xl text-left">Checkout</h2>
      <div className="bg-secondary rounded-lg mt-6 mb-4">
        <MintImgs />
        <div className="flex justify-between border-b border-split p-4">
          <p>{mintInfo?.txt}</p>
          <span
            className={` ${mintSet.size === 1 ? 'text-check' : 'text-white'}`}>
            {mintInfo?.cost}
          </span>
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
      <p className="text-sm text-left">Balance: $8098.88 Manta</p>
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
