import React from 'react';
import PercentageCircleSvg from 'resources/svgs/PercentageCircle';
import DotLoader from './DotLoader';

const SyncPercentage: React.FC<{ percentage?: number }> = ({
  percentage = 0
}) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="single-chart">
        <div className="relative">
          <PercentageCircleSvg percentage={percentage} />
          <p className="text-base text-black dark:text-white absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {percentage ?? 0}%
          </p>
        </div>
      </div>
      <p className="text-base font-bold text-black dark:text-white">
        Syncing to network
        <DotLoader />
      </p>
    </div>
  );
};

export default SyncPercentage;
