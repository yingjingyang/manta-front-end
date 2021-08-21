import React from 'react';
import Images from 'common/Images';
import Search from 'components/elements/Search';
import { ExtrinsicContent, ExtrinsicEvent } from 'components/resources/Extrinsic';
import { useHistory } from 'react-router-dom';
import Sticky from 'components/elements/ScrollFollow/Sticky';
import { Navbar } from 'components/elements/Layouts';

const ExtrinsicPage = () => {
  const history = useHistory();

  return (
    <div className="extrinsic-page pt-16 lg:pt-0">
      <Navbar isVisible isSearch />
      <Sticky>
        <div className="w-full p-4 bg-primary md:p-8 flex justify-between">
          <div className="flex items-center">
            <img
              className="w-5 h-5 cursor-pointer"
              onClick={() => history.push('/explore')}
              src={Images.ArrowLeftIcon}
              alt="arrow-left"
            />
            <span className="text-2xl px-6 font-semibold text-thirdry">Extrinsic #5449190-1</span>
          </div>
          <div className="w-2/5 hidden lg:block pl-5">
            <Search />
          </div>
        </div>
      </Sticky>
      <ExtrinsicContent />
      <ExtrinsicEvent />
    </div>
  );
};

export default ExtrinsicPage;
