// @ts-nocheck
import React, { useState } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import Images from 'resources/icons';
import Sidebar from 'components/Sidebar';
import SocialMenu from 'components/Sidebar/SocialMenu';
import ThemeToggle from 'components/ThemeToggle';
import { MenuSvg, CloseMenuSvg } from 'resources/svgs';
import SignerConnectionStatusLabel from './SignerConnectionStatusLabel';

const Navbar = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={classNames(
          'navbar z-50 items-center fixed left-0  lg:top-4 right-0 lg:relative px-4 py-2 lg:py-0 lg:ml-6 md:pl-6 flex justify-between lg:justify-end',
          { 'lg:hidden': isVisible }
        )}
      >
        <div className="lg:hidden flex items-center">
          {!isOpen ? (
            <MenuSvg
              onClick={() => setIsOpen(!isOpen)}
              className="fill-current group-hover:fill-primary cursor-pointer"
            />
          ) : (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 cursor-pointer"
            >
              <CloseMenuSvg className="fill-current group-hover:fill-primary" />
            </div>
          )}
          <img
            className="logo w-8 h-8 ml-6 rounded-full"
            src={Images.Logo}
            alt="logo"
          />
        </div>
        <span className="flex">
          <SignerConnectionStatusLabel />
        </span>
      </div>
      <div
        style={{ transform: isOpen && 'none', overflow: isOpen && 'visible' }}
        className="nav-menu-mobile lg:hidden bg-primary z-40"
      >
        <div className="h-full overflow-y-auto flex flex-col justify-between py-6 pb-14 px-5">
          <Sidebar />
          <div>
            <div className="pb-4 pl-2">
              <ThemeToggle isHidden={false} />
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

Navbar.propTypes = {
  isVisible: PropTypes.bool,
  isSearch: PropTypes.bool,
  hidden: PropTypes.bool
};

export default Navbar;
