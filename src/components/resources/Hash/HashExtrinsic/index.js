import React, { useState } from 'react';
import Svgs from 'resources/Svgs';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';
import TableColumnHeader from 'components/elements/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/elements/Table/TableHeaderWrapper';

const BlockExtrinsic = () => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <div className="px-4 md:px-8 events py-2">
      <div className="rounded-lg mb-5 bg-secondary py-6">
        <div className="justify-between px-10 hidden md:flex">
          <div className="flex">
            <div className="cursor-pointer item px-4 py-2 rounded-lg active manta-gray mx-2">
              Extrinsics (2)
            </div>
            <div className="cursor-pointer item px-4 py-2 rounded-lg manta-gray mx-2">
              Events (4)
            </div>
            <div className="cursor-pointer item px-4 py-2 rounded-lg manta-gray mx-2">
              Log (2)
            </div>
            <div className="cursor-pointer item px-4 py-2 rounded-lg manta-gray mx-2">
              Comments
            </div>
          </div>
          <span className="px-4 py-2 hidden sm:block cursor-pointer rounded-lg btn-primary">
            All
          </span>
        </div>
        <div className="px-4 md:px-10 md:hidden items-center justify-between flex">
          <img
            className="w-4 h-4 cursor-pointer"
            src={Svgs.LeftIcon}
            alt="arrow-left"
          />
          <div className="cursor-pointer item px-4 py-2 rounded-lg active manta-gray mx-2">
            Extrinsics (2888999)
          </div>
          <img
            className="w-4 h-4 cursor-pointer"
            src={Svgs.RightIcon}
            alt="arrow-right"
          />
        </div>
        <div className="overflow-x-auto">
          <div className="mb-4 min-w-lg">
            <TableHeaderWrapper className="bg-table-row px-10 mt-4">
              <TableColumnHeader label="Extrinsics ID" width="15%" />
              <TableColumnHeader label="Block" width="15%" />
              <TableColumnHeader label="Hash" width="15%" />
              <TableColumnHeader label="Time" width="20%" />
              <TableColumnHeader label="Result" width="10%" />
              <TableColumnHeader label="Action" width="30%" />
            </TableHeaderWrapper>
            <div>
              <TableRow className="px-10 py-1">
                <TableRowItem width="15%">
                  <span className="text-accent">53535355-1</span>
                </TableRowItem>
                <TableRowItem width="15%">
                  <span className="text-blue-thirdry">3455524</span>
                </TableRowItem>
                <TableRowItem width="15%">
                  <span className="text-blue-thirdry">16DmDSH...BhULcQM3</span>
                </TableRowItem>
                <TableRowItem width="20%">
                  <span className="text-accent">55 secs ago</span>
                </TableRowItem>
                <TableRowItem width="10%">
                  <img
                    className="w-5 h-5"
                    src={Svgs.SuccessIcon}
                    alt="arrow-left"
                  />
                </TableRowItem>
                <TableRowItem width="25%">
                  <span className="text-blue-thirdry">
                    system (KilledAccount)
                  </span>
                </TableRowItem>
                <TableRowItem width="5%">
                  <img
                    onClick={() => setShowDrop(!showDrop)}
                    className="w-3 h-3 cursor-pointer"
                    src={!showDrop ? Svgs.DropDownIcon : Svgs.DropUpIcon}
                    alt="drop-up"
                  />
                </TableRowItem>
              </TableRow>
              {!showDrop && (
                <div className="px-12">
                  <div className="py-3 px-8 mb-2 bg-thirdry flex items-center rounded-lg">
                    <div className="w-1/12 text-accent">
                      <p className="pb-2">Keys</p>
                    </div>
                    <div className="w-3/12 text-accent">
                      <p className="pb-2">authority_discovery</p>
                      <p className="pb-2">babe</p>
                      <p className="pb-2">grandpa</p>
                      <p className="pb-2">im_online</p>
                      <p className="pb-2">para_assignment</p>
                      <p className="pb-2">para_validator</p>
                    </div>
                    <div className="w-10/12 text-accent">
                      <p className="pb-2">
                        0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                      </p>
                      <p className="pb-2">
                        0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                      </p>
                      <p className="pb-2">
                        0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                      </p>
                      <p className="pb-2">
                        0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                      </p>
                      <p className="pb-2">
                        0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                      </p>
                      <p className="pb-2">
                        0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                      </p>
                    </div>
                    <img
                      className="w-5 h-5 cursor-pointer"
                      src={Svgs.DetailIcon}
                      alt="detail"
                    />
                  </div>
                </div>
              )}
            </div>
            <TableRow className="px-10 py-1">
              <TableRowItem width="15%">
                <span className="text-accent">53535355-1</span>
              </TableRowItem>
              <TableRowItem width="15%">
                <span className="text-blue-thirdry">3455524</span>
              </TableRowItem>
              <TableRowItem width="15%">
                <span className="text-blue-thirdry">16DmDSH...BhULcQM3</span>
              </TableRowItem>
              <TableRowItem width="20%">
                <span className="text-accent">55 secs ago</span>
              </TableRowItem>
              <TableRowItem width="10%">
                <img
                  className="w-5 h-5"
                  src={Svgs.SuccessIcon}
                  alt="arrow-left"
                />
              </TableRowItem>
              <TableRowItem width="25%">
                <span className="text-blue-thirdry">
                  system (KilledAccount)
                </span>
              </TableRowItem>
              <TableRowItem width="5%">
                <img
                  className="w-3 h-3 cursor-pointer"
                  src={Svgs.DropUpIcon}
                  alt="drop-up"
                />
              </TableRowItem>
            </TableRow>
          </div>
        </div>
        <div className="flex sm:hidden pt-4 justify-center">
          <span className="px-4 py-2 cursor-pointer w-16 text-center rounded-lg btn-primary">
            All
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlockExtrinsic;
