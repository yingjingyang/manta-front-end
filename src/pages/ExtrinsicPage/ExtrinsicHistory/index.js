import React from 'react';
import { Navbar } from 'components/elements/Layouts';
import { ExtrinsicChart, ExtrinsicHistoryContent } from 'components/resources/Extrinsic';

const ExtrinsicHistory = () => {
  return (
    <div className="w-full extrinsic-history pt-20 p-4 lg:p-8">
      <Navbar isVisible isSearch hidden />
      <ExtrinsicChart />
      <ExtrinsicHistoryContent />
    </div>
  );
};

export default ExtrinsicHistory;
