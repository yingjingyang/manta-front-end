import React from 'react';
import { SwitchSvg } from 'resources/svgs';
import TransferItem from './TransferItem';
import CardContent from 'components/elements/CardContent';

const Transfers = () => {
  return (
    <div className="p-6 bg-secondary w-full rounded-lg">
      <CardContent
        leftIcon={<SwitchSvg className="fill-secondary" />}
        cardTitle="Transfers"
      />
      <div className="py-3">
        <TransferItem />
        <TransferItem />
        <TransferItem />
        <TransferItem />
      </div>
    </div>
  );
};

export default Transfers;
