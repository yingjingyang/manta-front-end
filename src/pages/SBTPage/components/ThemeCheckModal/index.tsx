import { Step, useSBT } from 'pages/SBTPage/SBTContext';

const ThemeCheckModal = ({ hideModal }: { hideModal: () => void }) => {
  const { setCurrentStep } = useSBT();
  const toGeneratingPage = () => {
    hideModal();
    setTimeout(() => {
      setCurrentStep(Step.Generating);
    });
  };
  return (
    <div className="text-white w-128 text-center">
      <h2 className="text-2xl">Checkout</h2>
      <div className="bg-secondary rounded-lg mt-6 mb-4">
        <div className="flex justify-between p-4">
          <p>10 Avatars + ONE Free Mint SBT PLAN</p>
          <div className="flex flex-col">
            <span className="text-check">179.48 MANTA</span>
            <span className="text-white text-opacity-60">$30.9 USD</span>
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
      <p className="text-sm text-left">Balance: $8098.88 Manta</p>
      <button
        onClick={toGeneratingPage}
        className={
          'px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter mt-6'
        }>
        Confirm
      </button>
    </div>
  );
};

export default ThemeCheckModal;
