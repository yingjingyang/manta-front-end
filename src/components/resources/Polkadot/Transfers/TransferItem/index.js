/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { ClockSvg } from 'resources/svgs';
import { NavLink } from 'react-router-dom';

const TransferItem = () => {
  return (
    <div className="p-4 mt-2 bg-thirdry flex flex-col sm:flex-row justify-between rounded-lg w-full">
      <div>
        <div className="flex justify-between sm:justify-start">
          <span className="pr-6 manta-gray">Extrinsic Index#</span>
          <NavLink to="/explore/extrinsic">
            <div className="font-semibold text-blue-thirdry text-lg">
              4342422-1
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex">
            <span className="pr-4 manta-gray">From: </span>
            <div className="font-semibold text-blue-thirdry">
              16jfsdjf2342f...
            </div>
          </div>
          <div className="flex sm:px-6">
            <span className="pr-4 manta-gray">To: </span>
            <div className="font-semibold text-blue-thirdry">
              21jkj423j4232...
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:block">
        <div className="flex items-center sm:justify-end">
          <ClockSvg className="fill-gray w-3 h-3" />
          <span className="pl-2 manta-dark-gray text-sm">51 secs ago</span>
        </div>
        <div className="flex items-center">
          <span className="pr-4 manta-gray">Amount: </span>
          <div className="font-semibold text-sm md:text-base text-thirdry">
            9,3324 DOT
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferItem;
