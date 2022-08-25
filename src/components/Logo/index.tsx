// @ts-nocheck
import { network } from 'constants/NetworkConstants';
import React from 'react';
import config from 'config';
import Svgs from 'resources/icons';

const Logo = () => {
  let logo;
  if (config.NETWORK_NAME === network.dolphin) {
    logo = Svgs.Dolphin;
  } else if (config.NETWORK_NAME === network.calamari) {
    logo = Svgs.Calamari;
  } else {
    logo = Svgs.Manta;
  }

  // todo: get transparent svg for calamari
  if (config.NETWORK_NAME === network.calamari) {
    return (
      <img className='w-12 h-12 rounded-full' src={logo} alt="logo" />
    )
  }

  return (
    <img src={logo} alt="logo" />
  );
};

export default Logo;
