import React from 'react';
import { ValidatorSvg } from 'resources/svgs';
import CardContent from 'components/elements/CardContent';
import TableColumnHeader from 'components/elements/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/elements/Table/TableHeaderWrapper';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';

const Validators = () => {
  return (
    <div className="p-6 bg-secondary w-full rounded-lg">
      <CardContent
        leftIcon={<ValidatorSvg className="fill-secondary" />}
        cardTitle="Validators"
        className="px-2"
      />
      <div className="overflow-x-auto">
        <div className="mb-4 min-w-table">
          <TableHeaderWrapper className="px-2">
            <TableColumnHeader label="Rank" width="5%" />
            <TableColumnHeader label="Validator" width="15%" />
            <TableColumnHeader label="Self-Bonded" width="11%" />
            <TableColumnHeader label="Total Bonded" width="15%" />
            <TableColumnHeader label="Nominator" width="10%" />
            <TableColumnHeader label="Commission" width="11%" />
            <TableColumnHeader label="Granpa Vote" width="11%" />
            <TableColumnHeader label="Reward Point" width="11%" />
            <TableColumnHeader label="Latest Mining" width="11%" />
          </TableHeaderWrapper>
          <TableRowData />
          <TableRowData />
          <TableRowData />
          <TableRowData />
          <TableRowData />
        </div>
      </div>
    </div>
  );
};

const TableRowData = () => {
  return (
    <TableRow className="bg-thirdry rounded-lg px-2 my-3">
      <TableRowItem width="5%">
        <div className="w-8 h-8 btn-primary leading-8 text-white text-center rounded-md">
          1
        </div>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="text-blue-thirdry">Binance... AKE_9</span>
      </TableRowItem>
      <TableRowItem width="11%">
        <span className="text-thirdry font-semibold">1 DOT</span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="text-thirdry text-sm sm:text-base font-semibold">
          2,103,524.3704 DOT
        </span>
      </TableRowItem>
      <TableRowItem width="10%">
        <span className="manta-prime-blue font-semibold">305</span>
      </TableRowItem>
      <TableRowItem width="11%">
        <span className="text-thirdry font-semibold">100.00%</span>
      </TableRowItem>
      <TableRowItem width="11%">
        <span className="text-thirdry font-semibold">747</span>
      </TableRowItem>
      <TableRowItem width="11%">
        <span className="text-thirdry font-semibold">80</span>
      </TableRowItem>
      <TableRowItem width="11%">
        <span className="text-blue-thirdry">5421504</span>
      </TableRowItem>
    </TableRow>
  );
};

export default Validators;
