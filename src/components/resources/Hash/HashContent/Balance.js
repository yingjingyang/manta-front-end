import React from 'react';
import Svgs from 'resources/icons';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';

const Balance = () => {
  return (
    <div className="py-6 bg-secondary w-full rounded-lg">
      <p className="text-xl block px-8 font-semibold text-thirdry">Balance</p>
      <TableRow className="px-6">
        <TableRowItem width="30%" className="px-2">
          <span className="manta-gray">Balance</span>
        </TableRowItem>
        <TableRowItem width="70%" className="flex items-center">
          <span className="text-accent px-2">0 DOT</span>
          <img
            className="w-5 h-5 cursor-pointer"
            src={Svgs.WarningIcon}
            alt="warning"
          />
        </TableRowItem>
      </TableRow>
      <TableRow highlight className="px-6">
        <TableRowItem width="30%" className="px-2">
          <span className="manta-gray">Reserved</span>
        </TableRowItem>
        <TableRowItem width="70%" className="flex items-center">
          <span className="text-accent px-2">0 DOT</span>
        </TableRowItem>
      </TableRow>
      <TableRow className="px-6">
        <TableRowItem width="30%" className="px-2">
          <span className="manta-gray">Locked</span>
        </TableRowItem>
        <TableRowItem width="70%" className="flex items-center">
          <span className="text-accent px-2">0 DOT</span>
          <img
            className="w-5 h-5 cursor-pointer"
            src={Svgs.WarningIcon}
            alt="warning"
          />
        </TableRowItem>
      </TableRow>
    </div>
  );
};

export default Balance;
