import React, { useState, useEffect, RefObject, MouseEvent } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Svgs from 'resources/icons';

type ICopyPastIconProps = {
  className?: string;
  textToCopy: string;
  copyRef?: RefObject<HTMLImageElement>;
};

const CopyPasteIcon: React.FC<ICopyPastIconProps> = ({
  className,
  textToCopy,
  copyRef
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e: MouseEvent<HTMLImageElement>) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    e.stopPropagation();
  };

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return copied ? (
    <FontAwesomeIcon className={classNames(className)} icon={faCheck} />
  ) : (
    <img
      className={classNames(`${className} cursor-pointer hover:text-link`)}
      src={Svgs.CopySquareIcon}
      onClick={(e) => copyToClipboard(e)}
      ref={copyRef}
    />
  );
};

export default CopyPasteIcon;
