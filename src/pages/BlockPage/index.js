import React from 'react';
import Images from 'common/Images';
import Search from 'components/elements/Search';
import { BlockContent, BlockExtrinsic } from 'components/resources/Blocks';
import { useHistory } from 'react-router-dom';
import Sticky from 'components/elements/ScrollFollow/Sticky';
import { Navbar } from 'components/elements/Layouts';

const BlockPage = () => {
  const history = useHistory();

  return (
    <div className="extrinsic-page pt-16 lg:pt-0">
      <Navbar isVisible isSearch />
      <Sticky>
        <div className="w-full bg-primary p-4 md:p-8 flex justify-between">
          <div className="flex items-center">
            <img
              className="w-5 h-5 cursor-pointer"
              onClick={() => history.push('/explore')}
              src={Images.ArrowLeftIcon}
              alt="arrow-left"
            />
            <span className="text-2xl px-6 font-semibold text-thirdry">Block #5449198</span>
          </div>
          <div className="w-2/5 hidden lg:block pl-5">
            <Search />
          </div>
        </div>
      </Sticky>
      <BlockContent />
      <BlockExtrinsic />
    </div>
  );
};

export default BlockPage;
