// @ts-nocheck
import React from 'react';
import { Notification } from 'element-react';

import NotificationContent from 'components/NotificationContent';

export const showError = (msg) => {
  Notification.error({
    title: 'Error',
    message: msg,
    duration: 15000,
    pauseOnHover: true
  });
};

export const showWarning = (msg) => {
  Notification({
    title: 'Warning',
    message: msg,
    type: 'warning',
    duration: 15000,
    pauseOnHover: true
  });
};

export const showSuccess = (msg, extrinsic = '') => {
  Notification({
    title: 'Success',
    message: <NotificationContent msg={msg} extrinsic={extrinsic} />,
    type: 'success',
    duration: 15000,
    pauseOnHover: true
  });
};

export const showInfo = (msg) => {
  Notification.info({
    title: 'Info',
    message: msg,
    duration: 15000,
    pauseOnHover: true
  });
};