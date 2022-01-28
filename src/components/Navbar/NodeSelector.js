import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import config from 'config';
import { useSubstrate } from 'contexts/substrateContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronCircleRight,
  faChevronCircleDown,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const NodeSelector = () => {
  const nodes = config.NODES ?? [];
  const { apiState, socket, updateSubstrateContext } = useSubstrate();
  const [showPopup, setShowPopup] = useState(false);
  const [nodeSelected, setNodeSelected] = useState(
    nodes.length > 0 ? nodes[0] : {}
  );

  const handleNodeChange = (node) => {
    updateSubstrateContext({ socket: node.url });
    setNodeSelected(node);
  };

  return (
    <div className="mr-auto relative">
      <p
        className="text-primary text-sm pb-1 cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        {config.NETWORK_NAME} Node{' '}
        <FontAwesomeIcon
          icon={showPopup ? faChevronCircleDown : faChevronCircleRight}
        />
      </p>
      <p
        className="text-primary flex items-center gap-2 cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        {apiState === 'READY' ? (
          <FontAwesomeIcon icon={faCheck} color="#24A148" />
        ) : apiState === 'CONNECTING' || apiState === 'CONNECT_INIT' ? (
          <div className="flex items-center justify-center space-x-2">
            <div
              className="spinner-border animate-spin inline-block w-4 h-4 border-1 rounded-full"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <FontAwesomeIcon icon={faTimes} color="#FA4D56" />
        )}
        {socket}
      </p>
      {showPopup && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setShowPopup(false);
          }}
        >
          <div className="absolute 0 bg-overlay dark:bg-fourth px-6 py-4 top-full rounded-lg z-50 whitespace-nowrap mt-3">
            <h2 className="relative text-xl text-accent font-semibold mb-3">
              Available Nodes
              <FontAwesomeIcon
                className="absolute right-0 top-0 cursor-pointer fill-primary"
                icon={faTimes}
                onClick={() => setShowPopup(false)}
              />
            </h2>
            {nodes.map((node) => (
              <div className="flex items-center mr-4 mb-4" key={node.name}>
                <input
                  id={`node-${node.name}`}
                  type="radio"
                  value={node.name}
                  checked={nodeSelected.name === node.name}
                  className="hidden"
                  onChange={() => {}}
                />
                <label
                  htmlFor={`node-${node.name}`}
                  className="flex items-center cursor-pointer text-xl text-primary"
                  onClick={() => handleNodeChange(node)}
                >
                  <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                  {node.url}
                </label>
              </div>
            ))}
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};

NodeSelector.propTypes = {};

export default NodeSelector;
