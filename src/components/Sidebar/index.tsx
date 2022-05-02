// @ts-nocheck
import React from 'react';
import Svgs from 'resources/icons';
import SocialMenu from 'components/Sidebar/SocialMenu';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import NodeSelector from 'components/Navbar/NodeSelector';

const Sidebar = () => {
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
          <div className="mt-2 flex justify-center">
            <NodeSelector />
          </div>
          <SidebarMenu />
        </div>
        <SocialMenu />
      </div>
    </div>
  );
};

export default Sidebar;
