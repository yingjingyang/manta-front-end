import mantaLogo from 'resources/images/manta.png';

type RegisterConfirmModal = {
  hideModal: () => void;
};
const RegisterConfirmModal = ({ hideModal }: RegisterConfirmModal) => {
  return (
    <div className="text-white">
      <h2 className="text-2xl">Registered!</h2>
      <img src={mantaLogo} alt="logo" className="w-14 h-14 mt-6" />
      <p className="text-white text-opacity-70 my-4">
        Please check your names and setup your primary name from your Signer.
      </p>
      <div className="flex justify-between mt-4">
        <button className="flex-1 px-8 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter mr-6">
          Confirm
        </button>
        <button
          className="bg-fourth border border-transparent ml-4 w-full rounded-lg btn-secondary-grident flex-1 px-8 py-2 text-center"
          onClick={hideModal}>
          <span className="gradient-text">Cancel</span>
        </button>
      </div>
    </div>
  );
};
export default RegisterConfirmModal;
