import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import { useUserSettings } from "../../providers.tsx/UserSettingsProvider";
import styles from "./RetirementGoalCalculator.module.css";

const RetirementGoalCalculator = () => {
  const { settings } = useUserSettings();

  const [retirementAge, setRetirementAge] = useState(settings.retirementAge);
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState(80000);
  const [inflationRate, setInflationRate] = useState(settings.inflationRate);
  const [returnRate, setReturnRate] = useState(settings.returnRate);

  // const [results, setResults] = useState({
  //   targetAmount: 0,
  //   targetAmountTodaysDollars: 0,
  //   monthlyContribution: 0,
  // });
  const results = useMemo(() => {
    const yearsUntilRetirement = retirementAge - settings.currentAge;

    if (yearsUntilRetirement <= 0) {
      return {
        targetAmount: 0,
        targetAmountTodaysDollars: 0,
        monthlyContribution: 0,
      };
    }

    // Calculate future value of desired income adjusted for inflation
    const futureAnnualIncome =
      desiredAnnualIncome *
      Math.pow(1 + inflationRate / 100, yearsUntilRetirement);

    // Using 4% withdrawal rule (need 25x annual income)
    const targetAmount = futureAnnualIncome * 25;

    // Today's dollars value
    const targetAmountTodaysDollars = desiredAnnualIncome * 25;

    // Calculate monthly contribution needed
    // FV = PMT × [(1 + r)^n - 1] / r
    // PMT = FV × r / [(1 + r)^n - 1]
    const monthlyRate = returnRate / 100 / 12;
    const months = yearsUntilRetirement * 12;

    let monthlyContribution = 0;
    if (monthlyRate > 0) {
      monthlyContribution =
        (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlyContribution = targetAmount / months;
    }

    return {
      targetAmount,
      targetAmountTodaysDollars,
      monthlyContribution,
    };
  }, [
    retirementAge,
    desiredAnnualIncome,
    inflationRate,
    returnRate,
    settings.currentAge,
  ]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const handleSaveGoal = () => {
    // Implement save functionality
    console.log("Saving retirement goal:", {
      retirementAge,
      desiredAnnualIncome,
      inflationRate,
      returnRate,
      results,
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Retirement Goal Calculator</h2>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Retirement Age</label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Desired Annual Income (Today's $)
          </label>
          <input
            type="number"
            value={desiredAnnualIncome}
            onChange={(e) =>
              setDesiredAnnualIncome(parseFloat(e.target.value) || 0)
            }
            className={styles.input}
            step="1000"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Expected Inflation Rate</label>
          <input
            type="text"
            value={`${inflationRate}%`}
            onChange={(e) => {
              const val = parseFloat(e.target.value.replace("%", ""));
              if (!isNaN(val)) setInflationRate(val);
            }}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Expected Return Rate</label>
          <input
            type="text"
            value={`${returnRate}%`}
            onChange={(e) => {
              const val = parseFloat(e.target.value.replace("%", ""));
              if (!isNaN(val)) setReturnRate(val);
            }}
            className={styles.input}
          />
        </div>

        <div className={styles.resultBox}>
          <p className={styles.resultText}>
            Based on your inputs, you'll need approximately{" "}
            <strong>{formatCurrency(results.targetAmount)}</strong> by age{" "}
            {retirementAge} (in today's dollars:{" "}
            <strong>{formatCurrency(results.targetAmountTodaysDollars)}</strong>
            )
          </p>
          <p className={styles.contributionText}>
            Monthly contribution needed:{" "}
            <strong>{formatCurrency(results.monthlyContribution)}</strong>
          </p>
        </div>

        <Button
          variant="contained"
          onClick={handleSaveGoal}
          className={styles.saveButton}
          fullWidth
        >
          Save Goal
        </Button>
      </div>
    </div>
  );
};

export default RetirementGoalCalculator;
