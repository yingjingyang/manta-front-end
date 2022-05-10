// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useSubstrate } from 'contexts/substrateContext';
import Svgs from 'resources/icons';
import SocialMenu from 'components/Sidebar/SocialMenu';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import NodeSelector from 'components/Navbar/NodeSelector';

const Sidebar = () => {
  const { blockNumber } = useSubstrate();

  return (
    <div className="sidebar-menu hidden lg:block bg-secondary">
      <div className="py-6 h-full flex flex-col justify-between overflow-visible">
        <div>
          <div className="logo-content pl-5 hidden w-full items-center lg:flex">
            <div className="logo border-white">
              <img src={Svgs.Logo} alt="logo" />
            </div>
            <div>
              <h1 className="text-3xl mb-0 pl-2 font-semibold text-accent">
                Dolphin
              </h1>
              <h3 className="text-l mb-0 pl-3 font-semibold text-secondary">
                V2: Spinner
              </h3>
            </div>
          </div>
          <div className="mt-4 flex justify-center items-center gap-4">
            <NodeSelector />
            <div
              className={`${
                blockNumber ? 'text-green-500' : 'text-red-500'
              } text-xss flex items-center gap-2`}
            >
              <a href="https://dolphin.subscan.io/block" target="_blank">
                <span class="flex h-2 w-2 relative">
                  <span
                    class={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      blockNumber ? 'bg-green-500' : 'bg-red-500'
                    } opacity-75`}
                  ></span>
                  <span
                    class={`relative inline-flex rounded-full h-2 w-2 ${
                      blockNumber ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                </span>
              </a>
              {blockNumber ? blockNumber.replace(',', '') : '??????'}
            </div>
          </div>
          <SidebarMenu />
        </div>
        <SocialMenu />
      </div>
    </div>
  );
};

export default Sidebar;
