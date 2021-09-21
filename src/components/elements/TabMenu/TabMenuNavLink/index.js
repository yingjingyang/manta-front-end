import React from 'react';
import PropsType from 'prop-types';
import { NavLink } from 'react-router-dom';

const TabMenuNavLink = ({ label, onClick, to }) => {
  return (
    <li onClick={onClick} style={{ cursor: 'pointer' }}>
      <NavLink
        to={to}
        className="inline-block py-2 px-3 sub-menu text-primary-bold"
        activeClassName="active">
        {label}
      </NavLink>
    </li>
  );
};

TabMenuNavLink.propTypes = {
  label: PropsType.string,
  onClick: PropsType.func,
  to: PropsType.string,
};

export default TabMenuNavLink;
