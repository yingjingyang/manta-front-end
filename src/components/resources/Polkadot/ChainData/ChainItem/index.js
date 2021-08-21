import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ChainItem = ({ contentClass, leftIcon = null, itemTitle, itemValue }) => {
  return (
    <div className="flex justify-between pb-2 sm:flex-col">
      <div className={classNames('flex items-center', contentClass)}>
        <img className="w-4 h-4" src={leftIcon} alt="blocks" />
        <div className="manta-gray text-sm px-4">{itemTitle}</div>
      </div>
      <div className="text-sm sm:text-base font-semibold pl-8 text-accent">{itemValue}</div>
    </div>
  );
};

ChainItem.propTypes = {
  contentClass: PropTypes.string,
  itemTitle: PropTypes.string,
};

export default ChainItem;
