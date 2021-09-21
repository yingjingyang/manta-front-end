import React from 'react';
import Button from 'components/elements/Button';
import Svgs from 'resources/icons';
import classNames from 'classnames';

const GovernCard = ({ className }) => {
  return (
    <div
      className={classNames(
        'govern-card p-6 bg-thirdry rounded-lg frame-box-shadow',
        className
      )}
    >
      <div className="flex flex-col xl:flex-row justify-between">
        <span className="block pb-3 text-lg sm:text-xl font-semibold text-accent">
          Manta Network Redemption Fee Update
        </span>
        <div className="flex items-center pb-2">
          <img src={Svgs.ClockIcon} className="pr-2" alt="clock-time" />
          <span className="manta-prime-blue text-xs sm:text-sm">
            Time left: 3 Days, 12 Hours, 27 minutes
          </span>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row xl:items-center">
        <div className="w-full pb-4 xl:pb-0 xl:w-3/4">
          <span className="manta-dark-gray text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </span>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/4 flex xl:justify-end">
          <Button className="btn-primary w-full sm:w-auto py-3">
            Read More and Vote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GovernCard;
