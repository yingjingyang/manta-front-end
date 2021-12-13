import React from 'react';

import config from 'config';

const NotificationContent = ({ msg, block = '' }) => {
  return (
    <>
      <p style={{ fontSize: '1rem' }}>{msg}</p>
      {block && (
        <a
          className="link-text"
          href={`${config.SUBSCAN_URL}/block/${block}`}
          target="_blank"
        >
          View Transaction
        </a>
      )}
    </>
  );
};

export default NotificationContent;
