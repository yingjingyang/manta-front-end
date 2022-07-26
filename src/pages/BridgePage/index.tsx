// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
import ChainDropdown from 'pages/BridgePage/ChainDropdown';
import SendButton from 'pages/BridgePage/SendButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SendAssetSelect from 'pages/SendPage/SendFromForm/SendAssetSelect';
import PublicFromAccountSelect from 'components/Accounts/PublicFromAccountSelect';
import Svgs from 'resources/icons';
import { BridgeContextProvider } from './BridgeContext';
import BridgeForm from './BridgeForm';

const BridgePage = () => {
    return (
    <BridgeContextProvider>
      <PageContent>
        <Navbar />
        <BridgeForm />
      </PageContent>
    </BridgeContextProvider>
  );
};

export default BridgePage;