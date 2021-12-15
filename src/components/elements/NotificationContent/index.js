import React from 'react';
import PropTypes from 'prop-types';

import config from 'config';

const NotificationContent = ({ msg, block = '' }) => {
  return (
    <>
      <p style={{ fontSize: '1rem' }}>{msg}</p>
      {block && (
        <a
          className="link-text"
          href={`${config.SUBSCAN_URL}/extrinsic/${block}`}
          target="_blank"
          rel="noreferrer"
        >
          View Transaction
        </a>
      )}
    </>
  );
};

NotificationContent.propTypes = {
  msg: PropTypes.string,
  block: PropTypes.string
};

export default NotificationContent;
