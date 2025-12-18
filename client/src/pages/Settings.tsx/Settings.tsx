import Button from "@mui/material/Button";
import { useUserSettings } from "../../providers.tsx/UserSettingsProvider";
import styles from "./Settings.module.css";
import Switch from "@mui/material/Switch";

const Settings = () => {
  const { settings, updateSettings, resetSettings } = useUserSettings();
  const showUserSettingsState = false;

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Financial Settings</h2>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Inflation Rate (%)</label>
            <input
              type="number"
              value={settings.inflationRate}
              onChange={(e) =>
                updateSettings({ inflationRate: parseFloat(e.target.value) })
              }
              className={styles.input}
              step="0.1"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Return Rate (%)</label>
            <input
              type="number"
              value={settings.returnRate}
              onChange={(e) =>
                updateSettings({ returnRate: parseFloat(e.target.value) })
              }
              className={styles.input}
              step="0.1"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Current Age</label>
            <input
              type="number"
              value={settings.currentAge}
              onChange={(e) =>
                updateSettings({ currentAge: parseInt(e.target.value) })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Retirement Age</label>
            <input
              type="number"
              value={settings.retirementAge}
              onChange={(e) =>
                updateSettings({ retirementAge: parseInt(e.target.value) })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <Switch
              checked={settings.showValueInTodaysDollars}
              onChange={(e) =>
                updateSettings({ showValueInTodaysDollars: e.target.checked })
              }
              className={styles.checkbox}
            />
            <label className={styles.label}>
              Show value in today's dollars
            </label>
          </div>

          <Button
            variant="contained"
            onClick={resetSettings}
            className={styles.button}
          >
            Reset to Defaults
          </Button>
        </div>
        {showUserSettingsState && (
          <div className={styles.preview}>
            <h3 className={styles.previewTitle}>Current Settings:</h3>
            <pre className={styles.previewContent}>
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
