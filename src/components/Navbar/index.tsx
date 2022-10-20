// @ts-nocheck
import React from 'react';
import AccountSelect from 'components/Accounts/AccountSelect';
// import Navs from './Navs';
import ChainSelector from './ChainSelector';
import SignerConnectionStatusLabel from './SignerConnectionStatusLabel';


export const CalamariNavbar = () => {
  return (
    <div className="py-4 px-10 flex justify-between items-center relative sticky left-0 right-0 top-0 z-50 bg-primary">
      <ChainSelector />
      {/* <Navs /> */}
      <AccountSelect />
      <div className="absolute inset-0 border-b pointer-events-none bg-slate-600 border-gray-600 translate-y-0" />
    </div>
  );
};

export const DolphinNavbar = () => {
  return (
    <div className="py-4 px-10 flex justify-between items-center relative sticky left-0 right-0 top-0 z-50 bg-primary">
      <ChainSelector />
      {/* <Navs /> */}
      <SignerConnectionStatusLabel />
    </div>
  );
};
