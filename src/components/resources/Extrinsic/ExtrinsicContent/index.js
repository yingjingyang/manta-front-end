import React from 'react';
import { NavLink } from 'react-router-dom';
import Svgs from 'resources/icons';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';
import Button from 'components/elements/Button';

const ExtrinsicContent = () => {
  return (
    <div className="px-4 md:px-8 py-2">
      <div className="rounded-lg mb-4 break-all bg-secondary py-6">
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Time</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">2021-06-10 18:35:30 (+UTC)</span>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Block</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.SuccessIcon}
                alt="arrow-left"
              />
              <NavLink to="/explore/extrinsic-history">
                <span className="text-blue-thirdry px-4">5449190</span>
              </NavLink>
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Life Time</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">Immortal</span>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Extrinsic Hash</span>
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
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Module</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <Button>Balances</Button>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Call</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <Button>Transfer</Button>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Sender</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.FlowerIcon}
                alt="arrow-left"
              />
              <span className="text-accent mx-3">
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
            <span className="manta-gray">Destination</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.FlowerIcon}
                alt="arrow-left"
              />
              <span className="text-accent mx-3">
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
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Value</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <span className="text-accent">303.1701 DOT ($6,929.56)</span>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Fee</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.PolkadotIcon}
                alt="polkadotIcon"
              />
              <span className="text-accent px-4">303.1701 DOT ($6,929.56)</span>
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Nonce</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.PolkadotIcon}
                alt="polkadotIcon"
              />
              <span className="text-accent px-4">303.1701 DOT ($6,929.56)</span>
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Result</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="flex">
              <img
                className="w-5 h-5 cursor-pointer"
                src={Svgs.SuccessIcon}
                alt="arrow-left"
              />
              <span className="text-blue-thirdry px-4">Success</span>
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Parameters</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2 overflow-x-auto">
            <div className="py-3 px-6 rounded-lg min-w-md bg-thirdry">
              <div className="flex w-full">
                <div className="flex pb-2 sm:pb-0 w-4/12">
                  <span className="w-1/2 text-accent">Dest</span>
                  <span className="w-1/2 text-accent">Id</span>
                </div>
                <div className="flex w-8/12">
                  <img
                    className="w-5 h-5 cursor-pointer"
                    src={Svgs.FlowerIcon}
                    alt="arrow-left"
                  />
                  <span className="text-accent mx-3">
                    0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                  </span>
                  <img
                    className="w-4 h-4 cursor-pointer"
                    src={Svgs.CopyIcon}
                    alt="arrow-left"
                  />
                </div>
              </div>
              <div className="w-full flex py-2">
                <span className="w-2/12 text-accent">Value</span>
                <span className="w-10/12 text-accent">6.142141455</span>
              </div>
            </div>
          </TableRowItem>
        </TableRow>
        <TableRow highlight className="px-4 sm:px-10 flex-col sm:flex-row py-1">
          <TableRowItem className="w-full sm:w-1/5 py-0 sm:py-2">
            <span className="manta-gray">Signature</span>
          </TableRowItem>
          <TableRowItem className="w-full sm:w-4/5 pt-1 sm:pt-2">
            <div className="px-6 py-3 text-accent rounded-lg bg-thirdry">
              0xc2324c64be243494d29171fff1145b51c7bf8501ecb92c57a84060a24d0cdb11d3a0b9447d1f7aa0e3308244ebd98954335435bd963a95
            </div>
          </TableRowItem>
        </TableRow>
      </div>
    </div>
  );
};

export default ExtrinsicContent;
