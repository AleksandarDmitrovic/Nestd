interface InvestmentCalculation {
  futureValue: number;
  valueInTodaysDollars: number;
  yearsOfInvestment: number;
}

/**
 * Calculates the future value of an investment with compound interest
 * and adjusts for inflation to show value in today's dollars
 *
 * @param initialInvestment - The starting investment amount
 * @param currentAge - Current age of the investor
 * @param retirementAge - Age at retirement
 * @param returnRate - Annual return rate as a percentage (e.g., 7 for 7%)
 * @param inflationRate - Annual inflation rate as a percentage (e.g., 2 for 2%)
 * @returns Object containing future value, value in today's dollars, and years of investment
 */
export function calculateInvestmentValue(
  initialInvestment: number,
  currentAge: number,
  retirementAge: number,
  returnRate: number,
  inflationRate: number
): InvestmentCalculation {
  // Calculate years of investment
  const yearsOfInvestment = retirementAge - currentAge;

  if (yearsOfInvestment <= 0) {
    return {
      futureValue: initialInvestment,
      valueInTodaysDollars: initialInvestment,
      yearsOfInvestment: 0,
    };
  }

  // Convert percentages to decimals
  const returnRateDecimal = returnRate / 100;
  const inflationRateDecimal = inflationRate / 100;

  // Calculate future value with compound interest
  // Formula: FV = PV × (1 + r)^n
  const futureValue =
    initialInvestment * Math.pow(1 + returnRateDecimal, yearsOfInvestment);

  // Calculate value in today's dollars (adjust for inflation)
  // Formula: Present Value = FV / (1 + i)^n
  const valueInTodaysDollars =
    futureValue / Math.pow(1 + inflationRateDecimal, yearsOfInvestment);

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    valueInTodaysDollars: Math.round(valueInTodaysDollars * 100) / 100,
    yearsOfInvestment,
  };
}

//  * Alternative version that returns year-by-year breakdown
//  */
export function calculateInvestmentValueDetailed(
  initialInvestment: number,
  currentAge: number,
  retirementAge: number,
  returnRate: number,
  inflationRate: number
): {
  yearlyBreakdown: Array<{
    year: number;
    age: number;
    futureValue: number;
    valueInTodaysDollars: number;
  }>;
  finalValues: InvestmentCalculation;
} {
  const yearsOfInvestment = retirementAge - currentAge;
  const returnRateDecimal = returnRate / 100;
  const inflationRateDecimal = inflationRate / 100;

  const yearlyBreakdown = [];

  for (let year = 0; year <= yearsOfInvestment; year++) {
    const age = currentAge + year;
    const futureValue =
      initialInvestment * Math.pow(1 + returnRateDecimal, year);
    const valueInTodaysDollars =
      futureValue / Math.pow(1 + inflationRateDecimal, year);

    yearlyBreakdown.push({
      year,
      age,
      futureValue: Math.round(futureValue * 100) / 100,
      valueInTodaysDollars: Math.round(valueInTodaysDollars * 100) / 100,
    });
  }

  const finalYear = yearlyBreakdown[yearlyBreakdown.length - 1];

  return {
    yearlyBreakdown,
    finalValues: {
      futureValue: finalYear.futureValue,
      valueInTodaysDollars: finalYear.valueInTodaysDollars,
      yearsOfInvestment,
    },
  };
}
