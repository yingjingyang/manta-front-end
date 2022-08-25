// @ts-nocheck
import React from 'react';

const FormErrorText = ({
  errorText,
  warningText
}) => {
  if (errorText) {
    return <p className="text-xss text-red-500 ml-2">{errorText}</p>;
  } else if (warningText) {
    return (
      <p className="text-xss tracking-tight text-yellow-500 ml-2">
        {warningText}
      </p>
    );
  } else {
    return (
      <p className="text-xss text-red-500 ml-2 invisible">Okay</p>
    );
  }
};

export default FormErrorText;
