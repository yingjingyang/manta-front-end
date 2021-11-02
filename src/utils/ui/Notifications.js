import { Notification } from 'element-react';

export const showError = (msg) => {
  Notification.error({
    title: 'Error',
    message: msg,
    duration: 0,
  });
};

export const showWarning = (msg) => {
  Notification({
    title: 'Warning',
    message: msg,
    type: 'warning',
    duration: 0,
  });
};

export const showSuccess = (msg) => {
  Notification({
    title: 'Success',
    message: msg,
    type: 'success',
    duration: 0,
  });
};

export const showInfo = (msg) => {
  Notification.info({
    title: 'Info',
    message: msg,
    duration: 0,
  });
};
