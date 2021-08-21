import React, { useState } from 'react';
import Images from 'common/Images';
import MainMenu from 'components/resources/Sidebar/MainMenu';
import SocialMenu from 'components/resources/Sidebar/SocialMenu';
import ChangeThemeButton from 'components/resources/Sidebar/ChangeThemeButton';
import MantaSelect from 'components/elements/MantaSelect';
import { SearchSvg, MenuSvg, CloseMenuSvg } from 'common/Svgs';
import classNames from 'classnames';

const options = [
  { value: 'key1', label: '0xb43f3...0Fz' },
  { value: 'key2', label: '0xb43f3...0Aa' },
  { value: 'key3', label: '0xb43f3...0Dp' },
];

const Navbar = ({ isVisible = false, isSearch = false, hidden }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={classNames(
          'navbar bg-secondary z-50 lg:bg-primary items-center fixed left-0 top-0 right-0 lg:relative p-4 lg:py-0 md:px-6 flex justify-between lg:justify-end',
          { 'lg:hidden': isVisible },
        )}
      >
        <div className="lg:hidden flex items-center">
          {!isOpen ? (
            <MenuSvg
              onClick={() => setIsOpen(!isOpen)}
              className="fill-current group-hover:fill-primary cursor-pointer"
            />
          ) : (
            <div onClick={() => setIsOpen(!isOpen)} className="p-2.5 cursor-pointer">
              <CloseMenuSvg className="fill-current group-hover:fill-primary" />
            </div>
          )}
          <img className="logo w-8 h-8 ml-6 rounded-full" src={Images.Logo} alt="logo" />
        </div>
        {!isSearch ? (
          <MantaSelect
            options={options}
            className="w-40 border-0"
            defaultValue={{ value: 'key1', label: '0xb43f3...0Fz' }}
          />
        ) : (
          <div>{!hidden && <SearchSvg className="fill-current" />}</div>
        )}
      </div>
      <div
        style={{ transform: isOpen && 'none', overflow: isOpen && 'visible' }}
        className="nav-menu-mobile lg:hidden bg-primary z-40"
      >
        <div className="h-full overflow-y-auto flex flex-col justify-between py-6 pb-14 px-5">
          <MainMenu />
          <div>
            <div className="pb-4 pl-2">
              <ChangeThemeButton isHidden={false} />
            </div>
            <SocialMenu />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="navbar-mobile-overlay overflow-hidden fixed bg-overlay top-0 right-0 left-0 bottom-0 z-30 opacity-75"
        ></div>
      )}
    </div>
  );
};

export default Navbar;
