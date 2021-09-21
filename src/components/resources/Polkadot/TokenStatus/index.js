import React from 'react';
import { PoolSvg } from 'resources/svgs';
import CardContent from 'components/elements/CardContent';

const TokenStatus = () => {
  return (
    <div className="p-6 bg-secondary flex-1 xl:ml-6 w-full rounded-lg">
      <CardContent
        leftIcon={<PoolSvg className="fill-secondary" />}
        isShowAll={false}
        cardTitle="Token Status"
      />
      <div className="pt-3 sm:flex">
        <div className="w-full sm:w-2/5 px-2">
          <div className="flex justify-between sm:flex-col">
            <div className="flex items-center">
              <div className="w-3 h-3 manta-bg-primary-blue rounded-sm"></div>
              <div className="manta-gray text-sm px-4">Circulating</div>
            </div>
            <div className="text-sm sm:text-base font-semibold pl-8 text-accent">
              224,434M (32,4%)
            </div>
          </div>
          <div className="py-2 flex justify-between sm:flex-col">
            <div className="flex items-center">
              <div className="w-3 h-3 manta-bg-secondary-blue rounded-sm"></div>
              <div className="manta-gray text-sm px-4">Staking</div>
            </div>
            <div className="text-sm sm:text-base font-semibold pl-8 text-accent">
              224,434M (32,4%)
            </div>
          </div>
          <div className="flex justify-between sm:flex-col">
            <div className="flex items-center">
              <div className="w-3 h-3 manta-bg-gray rounded-sm"></div>
              <div className="manta-gray text-sm px-4">Others</div>
            </div>
            <div className="text-sm sm:text-base font-semibold pl-8 text-accent">
              224,434M (32,4%)
            </div>
          </div>
        </div>
        <div className="w-full pt-6 sm:pt-0 sm:w-3/5 sm:pl-6 ">
          <div className="h-32 text-sm flex w-full">
            <div className="w-3/6 flex items-end rounded-l-md justify-center text-white manta-bg-primary-blue">
              32,4%
            </div>
            <div className="w-2/6 flex items-end justify-center text-white  manta-bg-secondary-blue">
              32,4%
            </div>
            <div className="w-1/6 flex items-end rounded-r-md justify-center manta-bg-gray">
              10,4%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStatus;
