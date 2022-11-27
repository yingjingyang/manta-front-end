// @ts-nocheck
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as SunIcon } from 'resources/icons/sun.svg';
import { ReactComponent as ShieldIcon } from 'resources/icons/shield-lock.svg';

const PublicPrivateToggle = ({ isPrivate, onToggle, prefix }) => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  const onClick = () => {
    !disabled && onToggle();
  };

  let buttonId;
  if (isPrivate) {
    buttonId = `${prefix}PrivateTogglePublic`;
  } else {
    buttonId = `${prefix}PublicTogglePrivate`;
  }

  return (
    <>
      <div
        id={buttonId}
        onClick={onClick}
        className={classNames(
          'flex text-center cursor-pointer place-items-center btn-hover unselectable-text',
          'rounded-full bg-blue-button text-white',
          { disabled: disabled }
        )}
      >
        {isPrivate ? (
          <div className="flex flex-row w-24 justify-center">
            <ShieldIcon className="w-3 h-3 place-self-center" />
            <div className="text-xss ml-2">Private</div>
          </div>
        ) : (
          <div className="flex flex-row w-24 justify-center">
            <SunIcon className="w-3 h-3 place-self-center" />
            <div className="text-xss ml-2">Public</div>
          </div>
        )}
      </div>
    </>
  );
};

PublicPrivateToggle.propTypes = {
  isPrivate: PropTypes.bool,
  onToggle: PropTypes.func,
  label: PropTypes.string,
  prefix: PropTypes.string
};

export default PublicPrivateToggle;
