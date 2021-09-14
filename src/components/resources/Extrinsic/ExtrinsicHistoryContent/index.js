import React from 'react';
import Svgs from 'resources/icons';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';
import TableColumnHeader from 'components/elements/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/elements/Table/TableHeaderWrapper';

const ExtrinsicHistoryContent = () => {
  return (
    <div className="rounded-lg mb-4 lg:mb-10 bg-secondary overflow-x-auto py-6">
      <div className="mb-4 min-w-lg">
        <TableHeaderWrapper className="bg-table-row px-4 sm:px-10 mt-10">
          <TableColumnHeader label="Extrinsics ID" width="10%" />
          <TableColumnHeader label="Block" width="8%" />
          <TableColumnHeader label="Time" width="10%" />
          <TableColumnHeader label="From" width="20%" />
          <TableColumnHeader label="To" width="20%" />
          <TableColumnHeader label="Value" width="8%" />
          <TableColumnHeader label="Result" width="8%" />
          <TableColumnHeader label="Hash" width="16%" />
        </TableHeaderWrapper>
        <TableRowData />
        <TableRowData highlight />
        <TableRowData />
        <TableRowData highlight />
        <TableRowData cancel />
        <TableRowData highlight />
        <TableRowData cancel />
        <TableRowData highlight />
        <TableRowData />
      </div>
    </div>
  );
};

const TableRowData = ({ highlight, cancel }) => {
  return (
    <TableRow highlight={highlight} className="px-4 sm:px-10 py-1">
      <TableRowItem width="10%">
        <span className="text-accent">53535355-1</span>
      </TableRowItem>
      <TableRowItem width="8%">
        <span className="text-blue-thirdry">3455524</span>
      </TableRowItem>
      <TableRowItem width="10%">
        <span className="text-accent">6 mins ago</span>
      </TableRowItem>
      <TableRowItem width="20%">
        <span className="text-blue-thirdry flex">
          16DmDSH...BhULcQM3{' '}
          <img className="pl-3" src={Svgs.ArrowRightIcon} alt="arrow" />
        </span>
      </TableRowItem>
      <TableRowItem width="20%">
        <span className="text-blue-thirdry">16DmDSH...BhULcQM3</span>
      </TableRowItem>
      <TableRowItem width="8%">
        <span className="text-accent">20 DOT</span>
      </TableRowItem>
      <TableRowItem width="8%">
        {cancel ? (
          <img className="w-5 h-5" src={Svgs.CancelIcon} alt="success" />
        ) : (
          <img className="w-5 h-5" src={Svgs.SuccessIcon} alt="success" />
        )}
      </TableRowItem>
      <TableRowItem width="16%">
        <span className="text-blue-thirdry">0xfefe32...d2421d</span>
      </TableRowItem>
    </TableRow>
  );
};

export default ExtrinsicHistoryContent;
