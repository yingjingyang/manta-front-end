import CopyPasteIcon from 'components/CopyPasteIcon';
import GeneratedImgs from '../GeneratedImgs';

const MintedModal = () => {
  return (
    <div className="text-white w-max">
      <h2 className="text-2xl">MINTED！</h2>
      <p className="text-white text-opactity-60 text-xs mb-2">
        Your zkSBTs should appear in your Manta Signer. You can start using{' '}
        <span className="text-check">AsMatch</span> Match2Earn (Click to
        Download) using your newly minted
        <br /> zkSBTs. Begin by copying your zkSBT ID or by copying all zkSBT
        IDs.
      </p>
      <GeneratedImgs />
      <div className="flex flex-col items-center">
        <div className="bg-primary px-4 py-2 flex items-center mt-6 w-96 justify-between">
          <p className="text-white text-opacity-60">SBT ID</p>
          <p className="text-white">p9ijwpr09up0q3jrbpioqjpoijfqef</p>
          <CopyPasteIcon textToCopy="p9ijwpr09up0q3jrbpioqjpoijfqef" />
        </div>
        <button className="w-56 px-4 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter mt-6">
          Click to copy all SBT IDs
        </button>
      </div>
    </div>
  );
};

export default MintedModal;
