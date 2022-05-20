// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

import config from 'config';

const NotificationContent = ({ msg, extrinsic = '' }) => {
  return (
    <>
      <p style={{ fontSize: '1rem' }}>{msg}</p>
      {extrinsic && (
        <a
          className="link-text"
          href={`${config.SUBSCAN_URL}/extrinsic/${extrinsic}`}
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
  extrinsic: PropTypes.string
};

export default NotificationContent;
