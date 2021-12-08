import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import PropTypes from 'prop-types';

const Sticky = ({ children, left = 250 }) => {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().top < 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  return (
    <div className={classNames({ 'sticky-content': isSticky })} ref={ref}>
      <div style={{ left }} className="sticky-inner w-full">
        {children}
      </div>
    </div>
  );
};

Sticky.propTypes = {
  children: PropTypes.any,
  left: PropTypes.number
};

export default Sticky;
