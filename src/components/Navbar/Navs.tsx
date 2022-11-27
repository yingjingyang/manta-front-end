import React from 'react';
import { NavLink } from 'react-router-dom';
import { useConfig } from 'contexts/configContext';

const Navs = () => {
  return (
        <div className="flex rounded-full bg-secondary shadow-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <NavLink
            to="/transact"
            className="px-6 py-3 font-medium rounded-full text-secondary hover:bg-white"
          >
            Transact
          </NavLink>
          <NavLink
            to="/bridge"
            className="px-6 py-3 font-medium rounded-full text-secondary hover:bg-white"
          >
            Bridge
          </NavLink>
          <NavLink
            to="/stake"
            className="px-6 py-3 font-medium rounded-full text-secondary hover:bg-white"
          >
            Stake
          </NavLink>
          <a
            href="https://forum.manta.network/"
            className="px-6 py-3 font-medium rounded-full text-secondary hover:bg-white"
            target="_blank" rel="noreferrer"
          >
            Govern
          </a>
        </div>
  );
};

export default Navs;
