import React from 'react';
import Images from 'common/Images';
import { useHistory } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const ExtrinsicChart = () => {
  const history = useHistory();

  return (
    <div>
      <div className="flex pb-4 sm:hidden items-center">
        <img
          onClick={() => history.push('/explore/extrinsic')}
          className="w-5 h-5 cursor-pointer"
          src={Images.ArrowLeftIcon}
          alt="arrow-left"
        />
        <span className="text-2xl px-6 font-semibold text-thirdry">Extrinsic #5449190-1</span>
      </div>
      <div className="rounded-lg mb-4 events bg-secondary">
        <div className="px-6 py-4 flex justify-between">
          <span className="text-xl hidden sm:block px-3 font-semibold text-thirdry">
            Extrinsic History
          </span>
          <div className="flex">
            <div className="cursor-pointer item px-4 py-2 rounded-lg active manta-gray mx-2">
              1H
            </div>
            <div className="cursor-pointer item px-4 py-2 rounded-lg manta-gray mx-2">6H</div>
            <div className="cursor-pointer item px-4 py-2 rounded-lg manta-gray mx-2">1D</div>
          </div>
        </div>
        {/* TODO: add chart UI */}
        <div className="px-4 sm:px-10 pb-6 max-h-60 max-w-lg">
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
};

export default ExtrinsicChart;
