import React from 'react';
import { PageContent, Navbar } from 'components/elements/Layouts';
import Button from 'components/elements/Button';

const AuditPage = () => {
  return (
    <PageContent>
      <Navbar />
      <div className="flex justify-center pt-20 pb-4 lg:py-0">
        <div className="w-full md:w-2/3 lg:w-1/3 lg:min-w-layout p-4 sm:p-8 bg-secondary rounded-lg">
          <h1 className="text-3xl font-semibold text-accent">Self Auditing</h1>
          <span className="text-sm manta-gray">Separete multiple addresses with a space</span>
          <textarea
            rows={5}
            placeholder="Download Report As..."
            className="manta-bg-gray p-4 w-full my-6 outline-none field-box-shadow rounded-lg"
          />
          <Button className="btn-primary w-full btn-hover py-4">Download Report As...</Button>
        </div>
      </div>
      <div className="hidden lg:block h-10" />
    </PageContent>
  );
};

export default AuditPage;
