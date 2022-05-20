// @ts-nocheck
import config from 'config';
import Version from 'types/Version';

const signerIsOutOfDate = (signerVersion) => {
  const minRequiredSignerVersion = new Version(config.MIN_REQUIRED_SIGNER_VERSION);
  return signerVersion && !signerVersion.gte(minRequiredSignerVersion);
};

export default signerIsOutOfDate;
