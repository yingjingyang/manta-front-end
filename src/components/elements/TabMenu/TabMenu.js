import React from 'react';
import PropsType from 'prop-types';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';

const TabMenu = ({ label, active, onClick, className }) => {
  const { txStatus } = useTxStatus();

  const handleClickIfAllowed = () => {
    if(txStatus?.isProcessing()) {
      return;
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClickIfAllowed}
      className={classNames(
        'w-1/2 cursor-pointer text-lg py-3',
        active ? 'btn-primary' : 'bg-thirdry manta-gray',
        txStatus?.isProcessing() && 'disabled',
        className
      )}
    >
      {label}
    </div>
  );
};

TabMenu.propTypes = {
  label: PropsType.string,
  active: PropsType.bool,
  onClick: PropsType.func,
  className: PropsType.string
};

export default TabMenu;
