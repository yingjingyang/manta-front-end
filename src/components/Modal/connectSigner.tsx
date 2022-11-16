import React from 'react';
import MantaIcon from 'resources/images/manta.png';

const ConnectSignerModal = () => {
  return (
    <div className="p-4 w-96 flex flex-col justify-center text-center text-sm">
      <img
        className="place-self-center w-12 h-12"
        src={MantaIcon}
        alt="Manta"
      />
      <p className="my-4 text-white">
        Log in Manta Signer to see your zkAssets and transact it.
      </p>
      <div className="my-4">
        <p className="text-secondary">Don't have Manta Signer installed?</p>
        <a
          href="https://signer.manta.network/"
          target="_blank"
          className="font-bold text-center text-link text-base"
          rel="noreferrer"
        >
          Download Now
        </a>
      </div>

      <a
        href="https://docs.manta.network/docs/concepts/Signer"
        className="text-xss link-text"
        target="_blank"
        rel="noopener noreferrer"
      >
        Why do I need Manta Signer?
      </a>

      <a
        href="https://docs.manta.network/docs/guides/DolphinPay"
        className=" text-xss link-text"
        target="_blank"
        rel="noopener noreferrer"
      >
        How do I use Dolphin Testnet?
      </a>
    </div>
  );
};

export default ConnectSignerModal;
