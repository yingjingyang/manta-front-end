// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

const TelegramSvg = ({ className, fill }) => {
  return (
    <svg
      width="15"
      height="12"
      viewBox="0 0 15 12"
      className={className}
      fill={fill}
    >
      <path d="M5.88588 7.9088L5.63775 11.2592C5.99276 11.2592 6.14651 11.1128 6.33089 10.937L7.9953 9.41L11.4441 11.8346C12.0767 12.173 12.5223 11.9948 12.6929 11.276L14.9567 1.09284L14.9573 1.09224C15.158 0.194642 14.6192 -0.156356 14.0029 0.063843L0.696378 4.95442C-0.211769 5.29282 -0.198019 5.77881 0.541999 5.99901L3.94396 7.01481L11.846 2.26823C12.2179 2.03183 12.556 2.16263 12.2779 2.39903L5.88588 7.9088Z" />
    </svg>
  );
};

TelegramSvg.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
};

export default TelegramSvg;