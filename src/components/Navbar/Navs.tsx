import React from 'react';
import { NavLink } from 'react-router-dom';
import { useConfig } from 'contexts/configContext';

const Navs = () => {
  return (
    <div className="flex flex-row justify-between rounded-full bg-secondary w-113.5 shadow-2xl items-center text-sm">
      <NavLink
        to="/transact"
        className="py-3 w-1/4 rounded-full text-secondary text-center hover:bg-button-secondary hover:text-white hover:font-bold"
      >
        zkTransact
      </NavLink>
      <NavLink
        to="/bridge"
        className="py-3 w-1/4 rounded-full text-secondary text-center hover:bg-button-secondary hover:text-white hover:font-bold"
      >
        Bridge
      </NavLink>
      <NavLink
        to="/stake"
        className="py-3 w-1/4 rounded-full text-secondary text-center hover:bg-button-secondary hover:text-white hover:font-bold"
      >
        Stake
      </NavLink>
      <a
        href="https://docs.manta.network/docs/calamari/Governance"
        className="py-3 w-1/4 rounded-full text-secondary text-center hover:bg-button-secondary hover:text-white hover:font-bold"
        target="_blank"
        rel="noreferrer"
      >
        Govern
      </a>
    </div>
  );
};

export default Navs;
