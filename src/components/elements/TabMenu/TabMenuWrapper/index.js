import classNames from 'classnames';
import React from 'react';

// eslint-disable-next-line react/prop-types
const TabMenuWrapper = ({ children, className }) => {
  return (
    <div className={classNames('flex w-full text-center rounded-lg pb-2', className)}>
      {children}
    </div>
  );
};

export default TabMenuWrapper;
