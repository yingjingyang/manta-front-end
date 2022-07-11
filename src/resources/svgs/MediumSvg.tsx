// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

const MediumSvg = ({ className, fill }) => {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      className={className}
      fill={fill}
    >
      <path d="M14.7233 1.41032L16 0.253263V0H11.5773L8.42533 7.43242L4.83933 0H0.202V0.253263L1.69333 1.95411C1.83867 2.07979 1.91467 2.26358 1.89533 2.44863V9.13263C1.94133 9.37326 1.85867 9.62084 1.68 9.79579L0 11.7246V11.9747H4.76333V11.7215L3.08333 9.79579C2.90133 9.62021 2.81533 9.37705 2.852 9.13263V3.35116L7.03333 11.9779H7.51933L11.1147 3.35116V10.2234C11.1147 10.4046 11.1147 10.4419 10.9893 10.5606L9.696 11.7461V12H15.9707V11.7467L14.724 10.5903C14.6147 10.512 14.558 10.3806 14.5813 10.2531V1.74758C14.558 1.61937 14.614 1.488 14.7233 1.41032Z" />
    </svg>
  );
};

MediumSvg.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
};

export default MediumSvg;