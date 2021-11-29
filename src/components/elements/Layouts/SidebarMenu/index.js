import React from 'react';
import Svgs from 'resources/icons';
import SocialMenu from 'components/resources/Sidebar/SocialMenu';
import MainMenu from 'components/resources/Sidebar/MainMenu';

const SidebarMenu = () => {
  return (
    <div className="sidebar-menu hidden lg:block bg-secondary lg:fixed left-0 h-full">
      <div className="p-6 h-full flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="logo-content hidden w-full items-center lg:flex">
            <div className="logo border-white">
              <img src={Svgs.Logo} alt="logo" />
            </div>
            <h1 className="text-3xl mb-0 font-semibold text-accent">Dolphin</h1>
          </div>
          <MainMenu />
        </div>
        <SocialMenu />
      </div>
    </div>
  );
};

export default SidebarMenu;
