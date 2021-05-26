export const formatBase64StringForDisplay = base64String => {
  if (!base64String) {
    return '';
  }
  const LINE_LENGTH = 75;
  let formattedString = '\n';
  for (let i = 0; i < base64String.length; i++) {
    formattedString += base64String.slice(i, i + LINE_LENGTH);
    formattedString += '\n';
    i += LINE_LENGTH;
  }
  return formattedString;
};
