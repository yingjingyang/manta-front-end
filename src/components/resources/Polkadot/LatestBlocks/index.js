import React from 'react';
import { BlockSvg } from 'resources/svgs';
import BlockItem from './BlockItem';
import CardContent from 'components/elements/CardContent';

const LatestBlocks = () => {
  return (
    <div className="p-6 bg-secondary flex-1 xl:ml-6 w-full rounded-lg">
      <CardContent
        leftIcon={<BlockSvg className="fill-secondary" />}
        cardTitle="Latest Blocks"
      />
      <div className="py-3">
        <BlockItem />
        <BlockItem />
        <BlockItem />
        <BlockItem />
      </div>
    </div>
  );
};

export default LatestBlocks;
