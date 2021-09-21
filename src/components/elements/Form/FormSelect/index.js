import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select } from 'element-react';

const FormSelect = ({
  className,
  options,
  selectedOption,
  setSelectedOption,
  label = 'Token',
}) => {
  useEffect(() => {
    if (!selectedOption && options.length) {
      setSelectedOption(options[0]);
    }
  }, [selectedOption, options]);

  return (
    <div className={classNames('py-2', className)}>
      <div className="flex relative bottom-1 rounded-lg bg-fourth pt-3 pb-1">
        <img
          className="w-12 h-12 p-3 z-10 left-3 absolute manta-bg-secondary rounded-full"
          src={selectedOption?.icon}
          alt="icon"
        />
        <div className="relative w-full">
          <span className="text-sm absolute form-select-label top-0 z-10 block text-gray-light">
            {selectedOption?.ticker}
          </span>
          <Select
            onChange={(option) => setSelectedOption(option)}
            value={selectedOption}
            placeholder="select"
          >
            {options.map((option) => {
              return (
                <Select.Option
                  key={option.name}
                  label={option.name}
                  value={option}
                >
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 p-2 px-3 manta-bg-secondary rounded-full"
                      src={option.icon}
                      alt="icon"
                    />
                    <div className="px-3">
                      <span className="text-sm block">{option.ticker}</span>
                      <span className="text-lg">{option.name}</span>
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
