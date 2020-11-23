// Settings Context - src/context/Settings
import React, { useState } from 'react';

const KittyTabContext = React.createContext();
const defaultSettings = {};

export const SettingsProvider = ({ children, kittyTab }) => {
  const [currentSettings, setCurrentSettings] = useState(
    kittyTab || defaultSettings
  );

  const setKittyTab = (values) => {
    setCurrentSettings(values);
  };

  return (
    <KittyTabContext.Provider value={{ kittyTab: currentSettings, setKittyTab }}>
      {children}
    </KittyTabContext.Provider>
  );
};

export default KittyTabContext;
