import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface UserSettings {
  inflationRate: number;
  returnRate: number;
  currentAge: number;
  retirementAge: number;
  showValueInTodaysDollars: boolean;
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  inflationRate: 2,
  returnRate: 7,
  currentAge: 25,
  retirementAge: 65,
  showValueInTodaysDollars: true,
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

export const UserSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <UserSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
};
