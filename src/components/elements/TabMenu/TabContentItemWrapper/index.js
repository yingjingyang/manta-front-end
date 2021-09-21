const TabContentItemWrapper = ({ currentTabIndex, tabIndex, children }) => {
  return currentTabIndex === tabIndex ? children : null;
};

export default TabContentItemWrapper;
