import classNames from 'classnames';
import { useRef, useState } from 'react';
import mantaLogo from 'resources/images/manta.png';

type TransferModalProps = {
  hideModal: () => void;
};
const TransferModal = ({ hideModal }: TransferModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [disabled, toggleDisabled] = useState(true);
  const handleFocus = () => {
    toggleDisabled(false);
    // can not trigger focus immediately when input is disabled
    setTimeout(() => {
      inputRef?.current?.focus();
    });
  };
  return (
    <div className="text-white">
      <h2 className="text-2xl">Transfer</h2>
      <img src={mantaLogo} alt="logo" className="w-14 h-14 mt-6" />
      <p className="text-white text-opacity-70 my-4">
        Please enter zkAddress/zkName
      </p>
      <p className="text-white text-opacity-70 my-4 mr-4">
        Registrant
        <input
          placeholder="0xpp***889c"
          className={classNames(
            'flex-1 ml-4 px-4 py-2 text placeholder-gray-500 dark:placeholder-gray-500 text-black dark:text-white manta-bg-gray bg-opacity-0 outline-none rounded-lg w-96',
            { disabled: disabled }
          )}
          ref={inputRef}
          disabled={disabled}
        />
      </p>
      <div className="ml-24 cursor-pointer" onClick={handleFocus}>
        Click to modify
      </div>
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
export default TransferModal;
