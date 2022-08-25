// @ts-nocheck
import React from 'react';

type IPercentageCircleSvgProps = {
    percentage?: number;
}

const PercentageCircleSvg: React.FC<IPercentageCircleSvgProps> = ({ percentage = 0 }) => {
  return (
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
    </svg>
  );
};

export default PercentageCircleSvg;
