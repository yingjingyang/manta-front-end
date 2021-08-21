import React, { useState } from 'react';
import Images from 'common/Images';
import TableRow from 'components/elements/Table/TableRow';
import TableRowItem from 'components/elements/Table/TableRowItem';
import TableColumnHeader from 'components/elements/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/elements/Table/TableHeaderWrapper';

const ExtrinsicEvent = () => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <div className="px-4 md:px-8 events py-2 break-all">
      <div className="rounded-lg mb-4 lg:mb-10 bg-secondary py-6">
        <div className="justify-between px-4 lg:px-10 flex">
          <div className="flex">
            <div className="cursor-pointer item px-4 py-2 rounded-lg active manta-gray mx-2">
              Events (4)
            </div>
            <div className="cursor-pointer item px-4 py-2 rounded-lg manta-gray mx-2">Comments</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="mb-4 min-w-md">
            <TableHeaderWrapper className="bg-table-row px-4 lg:px-10 mt-4">
              <TableColumnHeader label="Event ID" width="20%" />
              <TableColumnHeader label="Hash" width="20%" />
              <TableColumnHeader label="Action" width="60%" />
            </TableHeaderWrapper>
            <div>
              <TableRow className="px-4 lg:px-10 py-1">
                <TableRowItem width="20%">
                  <span className="text-accent">53535355-1</span>
                </TableRowItem>
                <TableRowItem width="20%">
                  <span className="text-blue-thirdry">16DmDSH...BhULcQM3</span>
                </TableRowItem>
                <TableRowItem width="55%">
                  <span className="text-blue-thirdry">system (KilledAccount)</span>
                </TableRowItem>
                <TableRowItem width="5%">
                  <img
                    onClick={() => setShowDrop(!showDrop)}
                    className="w-3 h-3 cursor-pointer"
                    src={!showDrop ? Images.DropDownIcon : Images.DropUpIcon}
                    alt="drop-up"
                  />
                </TableRowItem>
              </TableRow>
              {!showDrop && (
                <div className="px-4 lg:px-12">
                  <div className="py-3 px-4 xl:px-8 mb-2 bg-thirdry flex items-center rounded-lg">
                    <div className="w-1/6 text-accent">
                      <p className="pb-2">Docs</p>
                      <p>Accountltd</p>
                    </div>
                    <div className="w-5/6 px-2">
                      <p className="pb-2 text-accent">An\[account\] was reaped.</p>
                      <div className="flex">
                        <img
                          className="w-5 h-5 cursor-pointer"
                          src={Images.FlowerIcon}
                          alt="arrow-left"
                        />
                        <span className="text-blue-thirdry mx-3">
                          0x0bd2432b0835a39720baea52f6026df56ef83bc1fadff44b99a5a0d15cab3446
                        </span>
                        <img className="w-4 h-4 cursor-pointer" src={Images.CopyIcon} alt="copy" />
                      </div>
                    </div>
                    <div className="pl-4">
                      <img
                        className="w-4 h-4 cursor-pointer"
                        src={Images.DetailIcon}
                        alt="detail"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <TableRow highlight className="px-4 lg:px-10 py-1">
              <TableRowItem width="20%">
                <span className="text-accent">53535355-1</span>
              </TableRowItem>
              <TableRowItem width="20%">
                <span className="text-blue-thirdry">16DmDSH...BhULcQM3</span>
              </TableRowItem>
              <TableRowItem width="55%">
                <span className="text-blue-thirdry">system (KilledAccount)</span>
              </TableRowItem>
              <TableRowItem width="5%">
                <img className="w-3 h-3 cursor-pointer" src={Images.DropUpIcon} alt="drop-up" />
              </TableRowItem>
            </TableRow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtrinsicEvent;
