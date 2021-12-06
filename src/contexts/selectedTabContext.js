import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';


const SelectedTabContext = createContext();

export const SelectedTabContextProvider = (props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const value = {
    selectedTabIndex: selectedTabIndex,
    setSelectedTabIndex: setSelectedTabIndex
  };

  return (
    <SelectedTabContext.Provider value={value}>
      {props.children}
    </SelectedTabContext.Provider>
  );
};

SelectedTabContextProvider.propTypes = {
  children: PropTypes.element
};

export const useSelectedTabIndex = () => ({
  ...useContext(SelectedTabContext)
});
