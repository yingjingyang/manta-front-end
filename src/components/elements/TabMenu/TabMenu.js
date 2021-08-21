import React from 'react';
import PropsType from 'prop-types';
import classNames from 'classnames';

const TabMenu = ({ label, active, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'w-1/2 cursor-pointer text-lg py-3',
        active ? 'btn-primary' : 'bg-thirdry manta-gray',
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
};

export default TabMenu;
