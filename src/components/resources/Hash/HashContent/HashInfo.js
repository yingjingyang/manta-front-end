import React from 'react';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';

const HashInfo = () => {
  return (
    <div className="bg-secondary py-6 flex-1 md:ml-6 w-full rounded-lg">
      <p className="text-xl block px-8 font-semibold text-thirdry">Basic Info</p>
      <TableRow className="px-6">
        <TableRowItem className="px-2 w-3/6 lg:w-2/6">
          <span className="manta-gray">Account Index</span>
        </TableRowItem>
        <TableRowItem className="flex items-center w-3/6 lg:w-4/6">
          <span className="text-accent px-2">-</span>
        </TableRowItem>
      </TableRow>
      <TableRow highlight className="px-6">
        <TableRowItem className="px-2 w-3/6 lg:w-2/6">
          <span className="manta-gray">Nonce</span>
        </TableRowItem>
        <TableRowItem className="flex items-center w-3/6 lg:w-4/6">
          <span className="text-accent px-2">0</span>
        </TableRowItem>
      </TableRow>
      <TableRow className="px-6">
        <TableRowItem className="px-2 w-3/6 lg:w-2/6">
          <span className="manta-gray">Role</span>
        </TableRowItem>
        <TableRowItem className="flex items-center w-3/6 lg:w-4/6">
          <span className="text-accent px-2">Validator</span>
        </TableRowItem>
      </TableRow>
    </div>
  );
};

export default HashInfo;
