import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TableColumnHeader = ({ label, className, width = 'auto', children }) => {
  return (
    <div
      style={{ width }}
      className={classNames(
        'box-border text-sm inline-block p-2 manta-gray font-semibold',
        className,
      )}
    >
      {label ? label : children}
    </div>
  );
};

TableColumnHeader.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.element
};

export default TableColumnHeader;
