import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

type ICopyPastIconProps = {
  className?: string;
  textToCopy: string;
};

const CopyPasteIcon: React.FC<ICopyPastIconProps> = ({ className, textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return copied ? (
    <FontAwesomeIcon className={classNames(className)} icon={faCheck} />
  ) : (
    <FontAwesomeIcon
      icon={faCopy}
      className={classNames(`${className} cursor-pointer`)}
      onMouseDown={copyToClipboard}
    />
  );
};

export default CopyPasteIcon;
