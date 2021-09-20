import { Notification } from 'element-react';

export const showError = (msg) => {
  Notification.error({
    title: 'Error',
    message: msg,
  });
};

export const showWarning = (msg) => {
  Notification({
    title: 'Warning',
    message: msg,
    type: 'warning',
  });
};

export const showSuccess = (msg) => {
  Notification({
    title: 'Success',
    message: msg,
    type: 'success',
  });
};

export const showInfo = (msg) => {
  Notification.info({
    title: 'Info',
    message: msg,
  });
};
