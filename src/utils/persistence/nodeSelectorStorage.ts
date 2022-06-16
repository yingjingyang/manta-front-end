// @ts-nocheck
import store from 'store';
import config from 'config';

const NODE_SELECTOR_STORAGE_KEY = 'lastSelectedNode';

export const getLastSelectedNodeUrl = () => {
  return store.get(
    `${config.BASE_STORAGE_KEY}${NODE_SELECTOR_STORAGE_KEY}`, null);
};

export const setLastSelectedNodeUrl = (lastSelectedNode) => {
  store.set(
    `${config.BASE_STORAGE_KEY}${NODE_SELECTOR_STORAGE_KEY}`, lastSelectedNode);
};
