import React from 'react';
import './style.scss';

const SyncPercentage: React.FC<{ percentage?: number }> = ({
  percentage = 0
}) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="single-chart">
        <div className="relative">
          <svg
            viewBox="0 0 36 36"
            className="circular-chart blue text-dark dark:text-white"
          >
            <path
              className="circle-bg"
              d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              stroke-dasharray={`${percentage}, 100`}
              d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* <text
            x="18"
            y="20.35"
            className="percentage text-base fill-black dark:fill-white"
          >
            {percentage}%
          </text> */}
          </svg>
          <p className="text-base text-black dark:text-white absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {percentage}%
          </p>
        </div>
      </div>
      <p className="text-base font-bold text-black dark:text-white">
        Syncing to node
        <div className="inline-flex items-center">
          <div className={`loader-dot1 bg-black dark:bg-white`} />
          <div className={`loader-dot2 bg-black dark:bg-white`} />
          <div className={`loader-dot3 bg-black dark:bg-white`} />
        </div>
      </p>
    </div>
  );
};

export default SyncPercentage;
