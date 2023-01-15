import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import MantaIcon from 'resources/images/manta.png';
import GeneratedImgs from '../GeneratedImgs';
const MAX_MINT_SIZE = 8;

const Generated = () => {
  const { mintSet, setCurrentStep } = useSBT();
  const btnDisabled = mintSet.size <= 0 || mintSet.size > MAX_MINT_SIZE;
  const toMintPage = () => {
    return setCurrentStep(Step.Mint);
  };
  return (
    <div className="relative flex-1 flex flex-col mx-auto mb-20 bg-secondary rounded-xl p-6 w-75 relative mt-6 z-0">
      <div className="flex items-center">
        <img src={MantaIcon} className="w-8 h-8 mr-3" />
        <h2 className="text-2xl">SBT</h2>
      </div>
      <h1 className="text-3xl my-6">Generated</h1>
      <GeneratedImgs />
      <p className="text-sm text-opacity-60 text-white mt-6">
        Your AI-generated zkSBT results are unique; the same image will never be
        generated again. <br />
        You can select up to 8 images to mint as your zkSBTs.
      </p>
      <button
        onClick={toMintPage}
        className={`absolute px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter bottom-8 left-1/2 -translate-x-1/2 transform ${
          btnDisabled ? 'brightness-50 cursor-not-allowed' : ''
        }`}>
        Continue to Mint({mintSet.size})
      </button>
    </div>
  );
};

export default Generated;
