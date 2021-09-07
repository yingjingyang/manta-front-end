import React from 'react';
import classNames from 'classnames';
import Svgs from 'resources/Svgs';
import PropTypes from 'prop-types';

const Search = ({ className, onClick }) => {
  return (
    <div
      className={classNames(
        'flex items-center frame-box-shadow rounded-lg bg-white',
        className
      )}
    >
      <div className="w-2/3 flex">
        <img
          className="w-5 h-5 m-3 cursor-pointe focus:outline-none"
          src={Svgs.SearchIcon}
          alt="search"
        />
        <input placeholder="search" className="w-full focus:outline-none" />
      </div>
      <div
        onClick={onClick}
        className="w-1/3 text-lg text-center btn-primary py-2 btn-hover rounded-r-lg cursor-pointer"
      >
        Search
      </div>
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Search;
