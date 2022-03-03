const buildTransaction = (state) => {
  const { senderAccountIsPrivate, receiverIsPrivate } = state;
  if (senderAccountIsPrivate && receiverIsPrivate) {
    return buildPrivateTransfer(state);
  } else if (!senderAccountIsPrivate && !receiverIsPrivate) {
    return buildPublicTransfer(state);
  } else if (!senderAccountIsPrivate && receiverIsPrivate) {
    return buildMint(state);
  } else {
    return buildReclaim(state);
  }
};

const buildPublicTransfer = (state) => {

};

const buildPrivateTransfer = (state) => {

};

const buildMint = (state) => {

};

const buildReclaim = (state) => {

};

export default buildTransaction;

// public send
// private send
// mint
// reclaim
