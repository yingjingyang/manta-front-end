import React, { createContext, useState, useContext } from 'react';

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

export const useSelectedTabIndex = () => ({
  ...useContext(SelectedTabContext)
});
