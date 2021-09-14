import React from 'react';
import { NavLink } from 'react-router-dom';
import Svgs from 'resources/icons';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';

const BlockContent = () => {
  return (
    <div className="px-4 md:px-8 py-2">
      <div className="rounded-lg mb-4 break-all bg-secondary py-6">
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Timestamp</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">2021-06-10 18:35:30 (+UTC)</span>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Status</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5"
                src={Svgs.SuccessIcon}
                alt="arrow-left"
              />
              <span className="text-blue-thirdry px-4">Finalized</span>
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Hash</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <span className="text-accent">
                0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
              </span>
              <img
                className="w-4 h-4 ml-3 cursor-pointer"
                src={Svgs.CopyIcon}
                alt="arrow-left"
              />
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Parent Hash</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <NavLink to="/explore/hash/0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446">
              <span className="text-blue-thirdry">
                0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
              </span>
            </NavLink>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">State Root</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">
              0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
            </span>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Extrinsics Root</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">
              0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
            </span>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Validators</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.FlowerIcon}
                alt="flower"
              />
              <span className="text-blue-thirdry px-2">
                0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
              </span>
              <img
                className="w-4 h-4 cursor-pointer"
                src={Svgs.CopyIcon}
                alt="arrow-left"
              />
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Block Time</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">55 sec ago</span>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Spec Version</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">30</span>
          </TableRowItem>
        </TableRow>
      </div>
    </div>
  );
};

export default BlockContent;
