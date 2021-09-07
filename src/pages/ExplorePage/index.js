import React from 'react';
import Svgs from 'resources/Svgs';
import Sticky from 'components/elements/ScrollFollow/Sticky';
import Search from 'components/elements/Search';
import { Navbar } from 'components/elements/Layouts';
import {
  ChainData,
  TokenStatus,
  Transfers,
  LatestBlocks,
  Validators,
} from 'components/resources/Polkadot';

const ExplorePage = () => {
  return (
    <div className="explore-page pt-16 lg:pt-0">
      <Navbar isVisible isSearch />
      <Sticky>
        <div className="w-full bg-primary p-4 lg:p-8 flex justify-between">
          <div className="flex items-center">
            <img
              className="w-5 h-5 cursor-pointer"
              src={Svgs.ArrowLeftIcon}
              alt="arrow-left"
            />
            <div className="px-6">
              <img
                className="w-14 h-14 p-3 manta-bg-secondary rounded-full"
                src={Svgs.TokenIcon}
                alt="p"
              />
            </div>
            <span className="text-2xl font-semibold text-thirdry">
              Polkadot
            </span>
          </div>
          <div className="w-2/5 hidden lg:block pl-5">
            <Search />
          </div>
        </div>
      </Sticky>
      <div className="flex flex-col xl:flex-row flex-wrap px-4 md:px-8">
        <div className="w-full pb-4 xl:pb-0 xl:w-3/5 flex-wrap flex">
          <ChainData />
        </div>
        <div className="w-full xl:w-2/5 flex-wrap flex">
          <TokenStatus />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row flex-wrap p-4 md:px-8">
        <div className="w-full pb-4 xl:pb-0 xl:w-3/5 flex-wrap flex">
          <Transfers />
        </div>
        <div className="w-full xl:w-2/5 flex-wrap flex">
          <LatestBlocks />
        </div>
      </div>
      <div className="flex px-4 py-4 md:px-8">
        <Validators />
      </div>
    </div>
  );
};

export default ExplorePage;
