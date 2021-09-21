import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import './index.css';

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

export default Sticky;
