// @ts-nocheck
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTxStatus } from 'contexts/txStatusContext';
import classNames from 'classnames';
import PopupIconSvg from 'resources/svgs/PopupIconSvg';
import FaucetSvg from 'resources/svgs/FaucetSvg';
import AirdropSvg from 'resources/svgs/AirdropSvg';
import BlockSvg from 'resources/svgs/BlockSvg';
import TransactSvg from 'resources/svgs/TransactSvg';
import SwapSvg from 'resources/svgs/SwapSvg';
import GovernSvg from 'resources/svgs/GovernSvg';
import GuideSvg from 'resources/svgs/GuideSvg';


const SidebarMenu = () => {
  const { txStatus } = useTxStatus();

  const onClickNavlink = (e) => {
    if (txStatus?.isProcessing()) {
      e.preventDefault();
    }
  };

  const navlinksDisabled = txStatus?.isProcessing();

  return (
    <div className="menu-content lg:py-4">
      <NavLink
        onClick={onClickNavlink}
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active "
        to="/transact"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center',
            { disabled: navlinksDisabled }
          )}
        >
          <div className="p-3">
            <TransactSvg className="fill-current -ml-1 mr-1 lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Transact
          </span>
        </div>
      </NavLink>
      <NavLink
        onClick={onClickNavlink}
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active"
        to="/bridge"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center',
            { disabled: navlinksDisabled }
          )}
        >
          <div className="p-3">
            <SwapSvg className="fill-current lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Bridge
          </span>
        </div>
      </NavLink>
      <a
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active bg-button"
        href="https://docs.manta.network/docs/calamari/Governance"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center'
          )}
        >
          <div className="p-3">
            <GovernSvg className="fill-current lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Govern
          </span>
          <PopupIconSvg className="fill-current lg:group-hover:fill-primary m-2" />
        </div>
      </a>
      <a
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active bg-button"
        href="https://docs.manta.network/docs/guides/DolphinPay"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center'
          )}
        >
          <div className="p-3 flex items-center justify-center">
            <GuideSvg className="fill-current lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            How to Guide
          </span>
          <PopupIconSvg className="fill-current lg:group-hover:fill-primary m-2" />
        </div>
      </a>
      <a
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active bg-button"
        href="https://docs.manta.network/docs/guides/DolphinPay#get-testnet-tokens"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center'
          )}
        >
          <div className="p-3 flex items-center justify-center">
            <FaucetSvg className="fill-current lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Faucet
          </span>
          <PopupIconSvg className="fill-current lg:group-hover:fill-primary m-2" />
        </div>
      </a>
      <a
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active bg-button"
        href="https://gleam.io/ye0bg/dolphin-testnet-v2-airdrop"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center'
          )}
        >
          <div className="p-3 flex items-center justify-center">
            <AirdropSvg className="fill-current lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Airdrop
          </span>
          <PopupIconSvg className="fill-current lg:group-hover:fill-primary m-2" />
        </div>
      </a>
      <a
        className="text-secondary block pl-4 pr-7"
        activeClassName="text-primary active bg-button"
        href="https://forms.gle/XP3ZsJHP6ZcG8CYA7"
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center'
          )}
        >
          <div className="p-3 flex items-center justify-center">
            <BlockSvg className="fill-current lg:group-hover:fill-primary" />
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Bug Report
          </span>
          <PopupIconSvg className="fill-current lg:group-hover:fill-primary m-2" />
        </div>
      </a>
    </div>
  );
};

export default SidebarMenu;
