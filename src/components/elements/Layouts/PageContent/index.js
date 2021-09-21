import classNames from 'classnames';
import React from 'react';

const PageContent = ({ children, className }) => {
  return (
    <section
      className={classNames(
        'py-4 px-4 md:p-8 page-content min-h-screen lg:flex flex-col justify-between',
        className,
      )}
    >
      {children}
    </section>
  );
};

export default PageContent;
