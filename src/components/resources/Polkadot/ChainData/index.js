import React from 'react';
import Svgs from 'resources/Svgs';
import ChainItem from './ChainItem';
import { ChainSvg } from 'resources/svgs';
import CardContent from 'components/elements/CardContent';

const ChainData = () => {
  return (
    <div className="p-6 bg-secondary w-full rounded-lg">
      <CardContent
        leftIcon={<ChainSvg className="fill-secondary" />}
        isShowAll={false}
        cardTitle="Chain Data"
      />
      <div className="pt-3 px-2 sm:pb-3 sm:flex">
        <div className="w-full sm:w-1/4">
          <ChainItem
            leftIcon={Svgs.BlocksIcon}
            itemTitle="Finalized Blocks"
            itemValue="4,232,324"
          />
        </div>
        <div className="w-full sm:w-1/4 sm:mx-4">
          <ChainItem
            leftIcon={Svgs.SignIcon}
            itemTitle="Signed Extrinsics"
            itemValue="4,232,324"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <ChainItem
            leftIcon={Svgs.TransferIcon}
            itemTitle="Transfers"
            itemValue="4,232,324"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <ChainItem
            leftIcon={Svgs.HolderIcon}
            itemTitle="Holders"
            itemValue="432,324"
          />
        </div>
      </div>
      <div className="sm:pt-2 px-2 sm:flex">
        <div className="w-full sm:w-1/4">
          <ChainItem
            leftIcon={Svgs.TotalIcon}
            itemTitle="Total Issuance"
            itemValue="1.081B"
          />
        </div>
        <div className="w-full sm:w-1/4 sm:mx-4">
          <ChainItem
            leftIcon={Svgs.StakedIcon}
            itemTitle="Staked Valua"
            itemValue="632,324M (64.5%)"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <ChainItem
            leftIcon={Svgs.ValidatorIcon}
            itemTitle="Validators"
            itemValue="274/274"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <ChainItem
            leftIcon={Svgs.RateIcon}
            itemTitle="Inlfation Rate"
            itemValue="8.8%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChainData;
