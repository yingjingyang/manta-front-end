import React from 'react';
import Images from 'common/Images';
import { useHistory } from 'react-router-dom';
import { HashContent, HashExtrinsic } from 'components/resources/Hash';
import { Navbar } from 'components/elements/Layouts';

const HashDetailPage = () => {
  const history = useHistory();

  return (
    <div className="extrinsic-page min-h-screen pt-16 lg:pt-0">
      <Navbar isVisible hidden isSearch />
      <div className="w-full break-all p-4 md:p-8 flex justify-between">
        <div className="flex items-center">
          <img
            className="w-5 h-5 cursor-pointer"
            onClick={() => history.push('/explore')}
            src={Images.ArrowLeftIcon}
            alt="arrow-left"
          />
          <div className="flex px-3 items-center">
            <img className="w-5 h-5 cursor-pointer" src={Images.FlowerIcon} alt="flower" />
            <span className="text-blue-thirdry mx-3">
              0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
            </span>
            <img className="w-4 h-4 cursor-pointer" src={Images.CopyIcon} alt="copy" />
            <img className="w-3 h-3 mx-3 cursor-pointer" src={Images.UserIcon} alt="user" />
            <img className="w-3 h-3 cursor-pointer" src={Images.KeyIcon} alt="key" />
          </div>
        </div>
      </div>
      <div>
        <HashContent />
        <HashExtrinsic />
      </div>
    </div>
  );
};

export default HashDetailPage;
