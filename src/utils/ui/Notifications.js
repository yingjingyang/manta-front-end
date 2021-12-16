import React from 'react';
import { Notification } from 'element-react';

import NotificationContent from 'components/elements/NotificationContent';

export const showError = (msg) => {
  Notification.error({
    title: 'Error',
    message: msg,
    duration: 0
  });
};

export const showWarning = (msg) => {
  Notification({
    title: 'Warning',
    message: msg,
    type: 'warning',
    duration: 0
  });
};

export const showSuccess = (msg, extrinsic = '') => {
  Notification({
    title: 'Success',
    message: <NotificationContent msg={msg} extrinsic={extrinsic} />,
    type: 'success',
    duration: 0
  });
};

export const showInfo = (msg) => {
  Notification.info({
    title: 'Info',
    message: msg,
    duration: 0
  });
};
