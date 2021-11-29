import classNames from 'classnames';
import React from 'react';

const PageContent = ({ children, className }) => {
  return (
    <section
      className={classNames(
        'px-4 page-content min-h-screen lg:flex flex-col justify-top',
        className
      )}
    >
      {children}
    </section>
  );
};

export default PageContent;
