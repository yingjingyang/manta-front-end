import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select } from 'element-react';
import Images from 'common/Images';

const fakeDataOptions = [
  { value: 'polkadot', label: 'Polkadot (DOT)', icon: Images.TokenIcon },
  { value: 'kusama', label: 'Kusama (DOT)', icon: Images.CoinIcon },
  { value: 'chainx', label: 'ChainX (DOT)', icon: Images.TokenIcon },
];

const FormSelect = ({ className, label, options = fakeDataOptions, value }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const onChange = (value) => {
    const selectedCoin = options.find((val) => val.value === value);
    setSelectedOption(selectedCoin);
  };

  return (
    <div className={classNames('py-2', className)}>
      <div className="flex relative bottom-1 rounded-lg bg-fourth pt-3 pb-1">
        <img
          className="w-12 h-12 p-3 z-10 left-3 absolute manta-bg-secondary rounded-full"
          src={selectedOption.icon}
          alt="icon"
        />
        <div className="relative w-full">
          <span className="text-sm absolute form-select-label top-0 z-10 block text-gray-light">
            {label}
          </span>
          <Select onChange={onChange} value={selectedOption.value} placeholder="select">
            {options.map((el) => {
              return (
                <Select.Option key={el.value} label={el.label} value={el.value}>
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 p-2 px-3 manta-bg-secondary rounded-full"
                      src={el.icon}
                      alt="icon"
                    />
                    <div className="px-3">
                      <span className="text-sm block">{label}</span>
                      <span className="text-lg">{el.label}</span>
                    </div>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
};

FormSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormSelect;
