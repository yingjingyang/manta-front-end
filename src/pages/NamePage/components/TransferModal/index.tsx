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
      <div
        className="flex items-center ml-24 cursor-pointer"
        onClick={handleFocus}>
        <svg
          className="mr-2"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.33325 8.00004C1.33325 7.63185 1.63173 7.33337 1.99992 7.33337H3.99992C4.36811 7.33337 4.66658 7.63185 4.66658 8.00004C4.66658 8.36823 4.36811 8.66671 3.99992 8.66671H1.99992C1.63173 8.66671 1.33325 8.36823 1.33325 8.00004Z"
            fill="white"
            fillOpacity="0.7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99992 1.33337C8.36811 1.33337 8.66659 1.63185 8.66659 2.00004V4.00004C8.66659 4.36823 8.36811 4.66671 7.99992 4.66671C7.63173 4.66671 7.33325 4.36823 7.33325 4.00004V2.00004C7.33325 1.63185 7.63173 1.33337 7.99992 1.33337Z"
            fill="white"
            fillOpacity="0.7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.26191 3.26191C3.52226 3.00156 3.94437 3.00156 4.20472 3.26191L5.67139 4.72858C5.93174 4.98893 5.93174 5.41104 5.67139 5.67139C5.41104 5.93174 4.98893 5.93174 4.72858 5.67139L3.26191 4.20472C3.00156 3.94437 3.00156 3.52226 3.26191 3.26191Z"
            fill="white"
            fillOpacity="0.7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.738 3.26191C12.9984 3.52226 12.9984 3.94437 12.738 4.20472L11.2714 5.67139C11.011 5.93174 10.5889 5.93174 10.3286 5.67139C10.0682 5.41104 10.0682 4.98893 10.3286 4.72858L11.7952 3.26191C12.0556 3.00156 12.4777 3.00156 12.738 3.26191Z"
            fill="white"
            fillOpacity="0.7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.67139 10.3286C5.93174 10.5889 5.93174 11.011 5.67139 11.2714L4.20472 12.738C3.94437 12.9984 3.52226 12.9984 3.26191 12.738C3.00156 12.4777 3.00156 12.0556 3.26191 11.7952L4.72858 10.3286C4.98893 10.0682 5.41104 10.0682 5.67139 10.3286Z"
            fill="white"
            fillOpacity="0.7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.52853 7.52865C7.70709 7.3501 7.9712 7.28775 8.21076 7.3676L14.2108 9.3676C14.4666 9.45287 14.6458 9.68384 14.6649 9.9528C14.684 10.2218 14.5393 10.4758 14.2981 10.5963L11.8302 11.8303L10.5962 14.2982C10.4756 14.5394 10.2216 14.6842 9.95268 14.665C9.68371 14.6459 9.45275 14.4667 9.36748 14.2109L7.36748 8.21088C7.28763 7.97132 7.34998 7.70721 7.52853 7.52865ZM9.05403 9.05415L10.1234 12.2624L10.737 11.0352C10.8015 10.9062 10.9061 10.8016 11.0351 10.7371L12.2622 10.1236L9.05403 9.05415Z"
            fill="white"
            fillOpacity="0.7"
          />
        </svg>
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
