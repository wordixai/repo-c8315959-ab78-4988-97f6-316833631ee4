import type { InvestmentInputs, InvestmentResult, MonthlyData, YearlyData } from '@/types/investment';

export function calculateInvestment(inputs: InvestmentInputs): InvestmentResult {
  const {
    initialAmount,
    monthlyContribution,
    annualReturn,
    years,
    inflationRate,
    taxRate,
    compoundingFrequency
  } = inputs;

  const monthlyReturn = annualReturn / 100 / 12;
  const monthlyInflation = inflationRate / 100 / 12;
  const totalMonths = years * 12;
  
  const monthlyData: MonthlyData[] = [];
  const yearlyData: YearlyData[] = [];
  
  let currentValue = initialAmount;
  let totalContributions = initialAmount;
  let currentRealValue = initialAmount;
  
  // Calculate monthly progression
  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly contribution
    if (month > 1) { // Don't add contribution in the first month (already counted as initial)
      currentValue += monthlyContribution;
      totalContributions += monthlyContribution;
    }
    
    // Apply compound interest
    currentValue *= (1 + monthlyReturn);
    
    // Calculate real value (adjusted for inflation)
    currentRealValue = currentValue / Math.pow(1 + monthlyInflation, month);
    
    const interest = currentValue - totalContributions;
    
    monthlyData.push({
      month,
      totalValue: currentValue,
      contributions: totalContributions,
      interest,
      realValue: currentRealValue
    });
    
    // Store yearly data
    if (month % 12 === 0) {
      const year = month / 12;
      const afterTaxGains = interest * (1 - taxRate / 100);
      const afterTaxValue = totalContributions + afterTaxGains;
      
      yearlyData.push({
        year,
        totalValue: currentValue,
        contributions: totalContributions,
        interest,
        realValue: currentRealValue,
        afterTaxValue
      });
    }
  }
  
  const finalData = monthlyData[monthlyData.length - 1];
  const totalInterest = finalData.interest;
  const afterTaxGains = totalInterest * (1 - taxRate / 100);
  const afterTaxValue = totalContributions + afterTaxGains;
  
  return {
    totalValue: finalData.totalValue,
    totalContributions,
    totalInterest,
    realValue: finalData.realValue,
    afterTaxValue,
    monthlyData,
    yearlyData
  };
}

export function calculateRetirementGoal(
  desiredRetirementIncome: number,
  retirementYears: number,
  inflationRate: number
): number {
  // Calculate how much you need saved to generate desired income
  const withdrawalRate = 0.04; // 4% rule
  const futureInflationMultiplier = Math.pow(1 + inflationRate / 100, retirementYears);
  const adjustedIncome = desiredRetirementIncome * futureInflationMultiplier;
  return adjustedIncome / withdrawalRate;
}

export function calculateRequiredSavings(
  goalAmount: number,
  currentSavings: number,
  years: number,
  annualReturn: number
): number {
  const monthlyReturn = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  
  // Future value of current savings
  const futureValueOfCurrent = currentSavings * Math.pow(1 + monthlyReturn, totalMonths);
  
  // Remaining amount needed
  const remainingNeeded = goalAmount - futureValueOfCurrent;
  
  if (remainingNeeded <= 0) return 0;
  
  // Calculate required monthly payment using future value of annuity formula
  const monthlyPayment = remainingNeeded / 
    (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn));
  
  return monthlyPayment;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(rate / 100);
}

export const marketScenarios = [
  {
    name: 'Conservative',
    description: 'Low-risk investments (bonds, CDs)',
    returnRate: 4,
    volatility: 5,
    color: '#10b981'
  },
  {
    name: 'Moderate',
    description: 'Balanced portfolio (60/40 stocks/bonds)',
    returnRate: 7,
    volatility: 10,
    color: '#3b82f6'
  },
  {
    name: 'Aggressive',
    description: 'High-growth stocks and equity funds',
    returnRate: 10,
    volatility: 15,
    color: '#f59e0b'
  },
  {
    name: 'Historical S&P 500',
    description: 'Based on long-term S&P 500 performance',
    returnRate: 10.5,
    volatility: 20,
    color: '#8b5cf6'
  }
];