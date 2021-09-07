/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { ClockSvg } from 'resources/svgs';
import { NavLink } from 'react-router-dom';

const TransferItem = () => {
  return (
    <div className="p-4 mt-2 bg-thirdry rounded-lg w-full">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <div className="flex">
            <span className="pr-6 manta-gray">Block#</span>
            <NavLink to="/explore/block">
              <div className="font-semibold text-blue-thirdry text-lg">
                5,152,251
              </div>
            </NavLink>
          </div>
          <div className="flex">
            <span className="pr-4 manta-gray">Includes: </span>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-blue-thirdry">
                1 Extrinsic
              </span>
              <span className="font-semibold text-blue-thirdry sm:px-4">
                2 Events
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <ClockSvg className="fill-gray" />
          <span className="px-2 manta-dark-gray">51 secs ago</span>
        </div>
      </div>
    </div>
  );
};

export default TransferItem;
