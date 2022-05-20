// @ts-nocheck
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import config from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { PropTypes } from 'prop-types';
import { useSubstrate } from 'contexts/substrateContext';
import { useTxStatus } from 'contexts/txStatusContext';
import classNames from 'classnames';
import { setLastSelectedNodeUrl } from 'utils/persistence/nodeSelectorStorage';

const NodeSelector = () => {
  const defaultNodeOptions = config.NODES;
  const { apiState, socket, resetSocket } = useSubstrate();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing() || apiState === 'CONNECTING';
  const [showPopup, setShowPopup] = useState(false);

  const getNodeIsDisconnected = () =>
    apiState === 'ERROR' || apiState === 'DISCONNECTED';

  const [selectedDefaultNodeOption, setSelectedDefaultNodeOption] =
    useState(null);
  const [customNodeInput, setCustomNodeInput] = useState('');
  const [nodeError, setNodeError] = useState('');
  const [disconnectedIndicator, setDisconnectedIndicator] = useState(
    getNodeIsDisconnected()
  );
  const selectedNodeName = selectedDefaultNodeOption
    ? selectedDefaultNodeOption.name
    : 'Custom Node';

  useEffect(() => {
    const selectedDefaultNode = defaultNodeOptions.find(
      (node) => node.url === socket
    );
    if (selectedDefaultNode) {
      setSelectedDefaultNodeOption(selectedDefaultNode);
    } else {
      setCustomNodeInput(socket);
    }
  }, [socket]);

  const onClickNodeSelector = () => {
    if (!disabled) {
      setShowPopup(true);
    }
  };

  const onClickOutsideNodeSelector = () => {
    if (nodeError) {
      setNodeError('');
    }
    setShowPopup(false);
  };

  const handleChangeDefaultNodeOption = (defaultNodeOption) => {
    if (socket === defaultNodeOption.url || disabled) {
      return;
    }
    resetSocket(defaultNodeOption.url);
    setSelectedDefaultNodeOption(defaultNodeOption);
    setNodeError('');
    setLastSelectedNodeUrl(defaultNodeOption.url);
  };

  const handleChangeCustomNodeInput = (e) => {
    setCustomNodeInput(e.target.value);
    setNodeError('');
  };

  const handleSetCustomNode = () => {
    if (socket === customNodeInput || disabled) {
      return;
    } else if (
      customNodeInput.slice(0, 5) === 'ws://' ||
      customNodeInput.slice(0, 6) === 'wss://'
    ) {
      resetSocket(customNodeInput);
      setSelectedDefaultNodeOption(null);
      setNodeError('');
      setLastSelectedNodeUrl(customNodeInput);
    } else {
      setNodeError('Invalid node endpoint');
    }
  };

  useEffect(() => {
    let timeout;
    if (getNodeIsDisconnected()) {
      timeout = setTimeout(() => {
        if (getNodeIsDisconnected()) {
          setDisconnectedIndicator(true);
        }
      }, 1000);
    } else {
      timeout && clearTimeout(timeout);
      setDisconnectedIndicator(false);
    }
  }, [apiState]);

  return (
    <div
      className={classNames(
        'relative border border-primary dark:border-white py-1 px-2 rounded-lg',
        { disabled: disabled }
      )}
    >
      <div
        className="text-primary flex items-center gap-2 cursor-pointer capitalize"
        onClick={onClickNodeSelector}
      >
        {disconnectedIndicator ? (
          <FontAwesomeIcon icon={faTimes} color="#FA4D56" />
        ) : apiState === 'READY' ? (
          <FontAwesomeIcon icon={faCheck} color="#24A148" />
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <div
              className="spinner-border animate-spin inline-block w-4 h-4 border-1 rounded-full"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {selectedNodeName}
      </div>
      {showPopup && (
        <OutsideClickHandler onOutsideClick={onClickOutsideNodeSelector}>
          <div className="absolute w-80 bg-overlay dark:bg-fourth px-6 py-4 top-full rounded-lg z-50 whitespace-nowrap mt-3">
            <h2 className="relative text-xl text-accent font-semibold mb-3">
              Available Nodes
              <FontAwesomeIcon
                className="absolute right-0 top-0 cursor-pointer fill-primary"
                icon={faTimes}
                onClick={() => setShowPopup(false)}
              />
            </h2>
            {defaultNodeOptions.map((defaultNodeOption) => (
              <div
                className="mb-2 overflow-hidden"
                key={defaultNodeOption.name}
              >
                <input
                  id={`node-${defaultNodeOption.name}`}
                  type="radio"
                  value={defaultNodeOption.name}
                  checked={!!(defaultNodeOption.url === socket)}
                  className="hidden"
                  onChange={() => {}}
                />
                <label
                  htmlFor={`node-${defaultNodeOption.name}`}
                  className="flex items-center cursor-pointer text-lg text-primary capitalize"
                  onClick={() =>
                    handleChangeDefaultNodeOption(defaultNodeOption)
                  }
                >
                  <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink flex-shrink-0"></span>
                  {defaultNodeOption.name}
                </label>
              </div>
            ))}
            <div className="mb-4 relative">
              <NodeSelectorInput
                value={customNodeInput}
                onChange={handleChangeCustomNodeInput}
                nodeError={nodeError}
              />
              <span
                className="absolute top-4 right-4  uppercase cursor-pointer text-center rounded-lg"
                onClick={handleSetCustomNode}
              >
                <FontAwesomeIcon icon={faSave} />
              </span>
            </div>
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};

const NodeSelectorInput = ({ onChange, value, nodeError }) => {
  return (
    <div>
      <div
        className={
          'flex items-start w-full field-box-shadow p-3 rounded-lg bg-gray-50 my-2 pr-16'
        }
      >
        <div className="flex">
          <input
            type="text"
            onChange={onChange}
            className={'w-full text-lg outline-none bg-gray-50'}
            value={value}
          />
        </div>
      </div>
      <p className={nodeError && 'text-red-500'}>
        {nodeError ? nodeError : 'custom endpoint'}
      </p>
    </div>
  );
};

NodeSelectorInput.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  className: PropTypes.string,
  isMax: PropTypes.bool,
  value: PropTypes.any,
  onClickMax: PropTypes.func,
  prefixIcon: PropTypes.string,
  type: PropTypes.string,
  step: PropTypes.string,
  isDisabled: PropTypes.bool
};

NodeSelector.propTypes = {};

export default NodeSelector;
