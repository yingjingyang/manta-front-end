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
  const nodes = config.NODES;
  const { apiState, socket, resetSocket } = useSubstrate();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  const [showPopup, setShowPopup] = useState(false);
  const [nodeSelected, setNodeSelected] = useState(

  );
  const [customNode, setCustomNode] = useState({});
  const [nodeError, setNodeError] = useState('');
  const [nodeDisconnected, setNodeDisconnected] = useState(
    apiState === 'DISCONNECTED' || apiState === 'ERROR'
  );

  useEffect(() => {
    if (nodes.find((node) => node.url === socket)) {
      setNodeSelected(nodes.find((node) => node.url === socket));
    } else {
      setCustomNode({
        name: 'custom node',
        url: socket
      });
    }
  }, [socket]);

  const handleNodeChange = (node) => {
    resetSocket(node.url);
    setNodeSelected(node);
    setCustomNode({});
    setNodeError('');
    setLastSelectedNodeUrl(node.url);
  };

  const onClick = () => {
    if (!disabled) {
      setShowPopup(true);
    }
  };

  const handleCustomNodeChange = () => {
    if (customNode && customNode.url) {
      if (
        customNode.url.slice(0, 5) === 'ws://' ||
        customNode.url.slice(0, 6) === 'wss://'
      ) {
        setNodeError('');
        setNodeSelected(null);
        resetSocket(customNode.url);
        setLastSelectedNodeUrl(customNode.url);
      } else {
        setNodeError('Invalid node endpoint');
      }
    }
  };

  useEffect(() => {
    let timeout;
    if (apiState === 'DISCONNECTED' || apiState === 'ERROR') {
      timeout = setTimeout(() => {
        setNodeDisconnected(true);
      }, 1000);
    } else {
      timeout && clearTimeout(timeout);
      setNodeDisconnected(false);
    }
  }, [apiState, nodeDisconnected]);

  return (
    <div className={classNames(
      'relative mt-2 border border-primary dark:border-white py-1 px-2 rounded-lg',
      {'disabled': disabled}
    )}
    >
      <div
        className="text-primary flex items-center gap-2 cursor-pointer capitalize"
        onClick={onClick}
      >
        {nodeDisconnected ? (
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
        {nodeSelected ? nodeSelected.name : 'Custom Node'}
      </div>
      {showPopup && (
        <OutsideClickHandler
          onOutsideClick={() => {
            if (nodeError) {
              setNodeError('');
              setCustomNode({});
            }
            setShowPopup(false);
          }}
        >
          <div className="absolute w-80 bg-overlay dark:bg-fourth px-6 py-4 top-full rounded-lg z-50 whitespace-nowrap mt-3">
            <h2 className="relative text-xl text-accent font-semibold mb-3">
              Available Nodes
              <FontAwesomeIcon
                className="absolute right-0 top-0 cursor-pointer fill-primary"
                icon={faTimes}
                onClick={() => setShowPopup(false)}
              />
            </h2>
            {nodes.map((node) => (
              <div className="mb-2 overflow-hidden" key={node.name}>
                <input
                  id={`node-${node.name}`}
                  type="radio"
                  value={node.name}
                  checked={!!(nodeSelected && nodeSelected.name === node.name)}
                  className="hidden"
                  onChange={() => {}}
                />
                <label
                  htmlFor={`node-${node.name}`}
                  className="flex items-center cursor-pointer text-lg text-primary capitalize"
                  onClick={() => handleNodeChange(node)}
                >
                  <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink flex-shrink-0"></span>
                  {node.name}
                </label>
              </div>
            ))}
            <div className="mb-4 relative">
              <NodeSelectorInput
                value={customNode.url ?? ''}
                onChange={(e) => {
                  setNodeError('');
                  setCustomNode({
                    name: 'custom node',
                    url: e.target.value
                  });
                }}
              >
                <p className={nodeError && 'text-red-500'}>
                  {nodeError ? nodeError : 'custom endpoint'}
                </p>
              </NodeSelectorInput>
              <span
                className="absolute top-4 right-4  uppercase cursor-pointer text-center rounded-lg"
                onClick={handleCustomNodeChange}
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

const NodeSelectorInput = ({
  onChange,
  value,
}) => {
  return (
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
