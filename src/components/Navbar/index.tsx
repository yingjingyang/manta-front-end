// @ts-nocheck
import React from 'react';
import AccountSelectMenu from 'components/Accounts/AccountSelectMenu';
// import Navs from './Navs';
import ChainSelector from './ChainSelector';
import SignerConnectionStatusLabel from './SignerConnectionStatusLabel';


export const CalamariNavbar = () => {
  return (
    <div className="py-4 px-10 flex justify-between items-center relative sticky left-0 right-0 top-0 z-50 bg-primary">
      <ChainSelector />
      {/* <Navs /> */}
      <AccountSelectMenu />
      <div className="absolute inset-0 border-b pointer-events-none bg-slate-600 border-gray-600 translate-y-0" />
    </div>
  );
};

export const DolphinNavbar = () => {
  return (
    <div className="py-4 px-10 flex justify-between items-center relative sticky left-0 right-0 top-0 z-50 bg-primary">
      <ChainSelector className='justify-self-start' />
      {/* <Navs /> */}
      <div className='flex flex-wrap space-x-6 justify-self-end'>
        <AccountSelectMenu />
        <SignerConnectionStatusLabel />
      </div>
    </div>
  );
};
