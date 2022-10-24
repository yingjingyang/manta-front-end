// @ts-nocheck
import Version from 'types/Version';

const getSignerIsOutOfDate = (config, signerVersion) => {
  const minRequiredSignerVersion = new Version(config.MIN_REQUIRED_SIGNER_VERSION);
  return signerVersion && !signerVersion.gte(minRequiredSignerVersion);
};

export default getSignerIsOutOfDate;
