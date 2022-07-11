// @ts-nocheck
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { TelegramSvg, AngelListSvg, GithubSvg, MediumSvg, NewsletterSvg, TwitterSvg } from 'resources/svgs';

const SocialMenu = () => {
  return (
    <div className="flex justify-center">
      <a
        className="px-2"
        target="_blank"
        href="https://t.me/mantanetworkofficial"
      >
        <TelegramSvg className="fill-current hover:fill-primary" />
      </a>
      <a
        className="px-2"
        target="_blank"
        href="https://twitter.com/mantanetwork"
      >
        <TwitterSvg className="fill-current hover:fill-primary" />
      </a>
      <a
        className="px-2"
        target="_blank"
        href="https://github.com/Manta-Network"
      >
        <GithubSvg className="fill-current hover:fill-primary" />
      </a>
      <a
        className="px-2"
        target="_blank"
        href="https://medium.com/@mantanetwork"
      >
        <MediumSvg className="fill-current hover:fill-primary" />
      </a>
      <a
        className="px-2"
        target="_blank"
        href="https://angel.co/company/manta-network/jobs"
      >
        <AngelListSvg className="fill-current hover:fill-primary" />
      </a>
      <a className="px-2" target="_blank" href="http://eepurl.com/hnoWQv">
        <NewsletterSvg className="fill-current hover:fill-primary" />
      </a>
    </div>
  );
};

export default SocialMenu;
