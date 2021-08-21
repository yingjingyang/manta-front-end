import React, { useContext } from 'react';
import Images from 'common/Images';
import SocialMenu from 'components/resources/Sidebar/SocialMenu';
import MainMenu from 'components/resources/Sidebar/MainMenu';
import { ThemeContext } from 'contexts/theme.context';
import { LogoNameSvg } from 'common/Svgs';
import { themeType } from 'constants/theme.constant';

const SidebarMenu = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="sidebar-menu hidden lg:block bg-secondary lg:fixed left-0 h-full">
      <div className="p-6 h-full flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="logo-content hidden w-full items-center lg:flex">
            <div className="border-4 rounded-full logo border-white">
              <img src={Images.Logo} alt="logo" />
            </div>
            <LogoNameSvg className="ml-4" fill={theme === themeType.Light ? '#104EA1' : 'white'} />
          </div>
          <MainMenu />
        </div>
        <SocialMenu />
      </div>
    </div>
  );
};

export default SidebarMenu;
