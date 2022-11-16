// @ts-nocheck
import React from 'react';
import AccountSelectMenu from 'components/Accounts/AccountSelectMenu';
import Menu from 'components/Menu/DotMenu';
import Navs from './Navs';
import ChainSelector from './ChainSelector';
import SignerConnectionStatusLabel from './SignerConnectionStatusLabel';

export const Navbar = ({shouldShowZkAccount}) => {
  return (
    <div className="h-20 py-4 px-10 flex justify-between items-center relative sticky left-0 right-0 top-0 z-50 bg-primary">
      <ChainSelector className='justify-self-start' />
      <Navs />
      <div className="h-12 gap-4 flex flex-wrap space-x-6 justify-end items-center">
        {shouldShowZkAccount && <SignerConnectionStatusLabel />}
        <AccountSelectMenu />
        <Menu />
      </div>
    </div>
  );
};

export default Navbar;
