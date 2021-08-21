import RestClient from './rest-client';

const setAuthorizationToken = (authToken) => {
  RestClient.defaults.headers.common.Authorization = `Bearer ${authToken}`;
};

const deleteAuthorizationToken = () => {
  delete RestClient.defaults.headers.common.Authorization;
};

const RestClientHelper = {
  setAuthorizationToken,
  deleteAuthorizationToken,
};

export default RestClientHelper;
