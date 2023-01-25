// @ts-nocheck
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSubstrate } from 'contexts/substrateContext';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useConfig } from 'contexts/configContext';
import { useTxStatus } from 'contexts/txStatusContext';
import Icon from 'components/Icon';

const ChainDropdownItem = ({ node, activeNode }) => {
  const selectedNetwork = activeNode.name === node.name;

  ChainDropdownItem.propTypes = {
    node: PropTypes.object,
    activeNode: PropTypes.object
  };

  return (
    <Link to={node.path}>
      <div
        className="border border-#FFFFFF1A bg-white bg-opacity-5 rounded-lg py-3 pl-3.5"
        key={node.name}>
        <div className="flex items-center gap-5 w-full">
          <Icon
            name={(node.name as string).toLowerCase()}
            className="w-6 h-6"
          />
          <div className="text-white w-32">
            {node.name}&nbsp;
            {node.testnet ? 'Testnet' : 'Network'}
          </div>
          <div>
            {selectedNetwork ? (
              <Icon name={'greenCheck'} className="w-4 h-4" />
            ) : (
              <Icon name={'unfilledCircle'} className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const ChainSelector = () => {
  const config = useConfig();
  const { socket } = useSubstrate();
  const { txStatus } = useTxStatus();

  const nodes = config.NODES;
  const activeNode = nodes.find((node) => node.url === socket);
  const [showNetworkList, setShowNetworkList] = useState(false);

  const disabled = txStatus?.isProcessing();
  const onClickChainSelector = () => !disabled && setShowNetworkList(true);

  return (
    <OutsideClickHandler onOutsideClick={() => setShowNetworkList(false)}>
      <div className="relative" onClick={onClickChainSelector}>
        <div
          className={classNames(
            'logo-content flex items-center lg:flex relative cursor-pointer w-52',
            { disabled: disabled }
          )}>
          <div className="logo">
            <Icon
              name={(activeNode.name as string).toLowerCase()}
              className="w-6 h-6"
            />
          </div>
          <div>
            <h1 className="mb-0 pl-5 font-light text-accent">
              {activeNode.name}&nbsp;
              {activeNode.testnet ? 'Testnet' : 'Network'}
            </h1>
          </div>
          <div className="text-white text-lg ml-4">
            <FontAwesomeIcon icon={showNetworkList ? faAngleUp : faAngleDown} />
          </div>
        </div>
        {showNetworkList && (
          <div className="flex flex-col w-67 gap-4 bg-fifth rounded-lg p-4 absolute left-0 top-16 z-50 border border-#FFFFFF1A font-light text-secondary">
            <div>Select a network</div>
            {nodes.map((node) => (
              <ChainDropdownItem
                key={node.name}
                node={node}
                activeNode={activeNode}
              />
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default ChainSelector;
