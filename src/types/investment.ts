export interface InvestmentInputs {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  inflationRate: number;
  taxRate: number;
  compoundingFrequency: number;
}

export interface InvestmentResult {
  totalValue: number;
  totalContributions: number;
  totalInterest: number;
  realValue: number; // adjusted for inflation
  afterTaxValue: number;
  monthlyData: MonthlyData[];
  yearlyData: YearlyData[];
}

export interface MonthlyData {
  month: number;
  totalValue: number;
  contributions: number;
  interest: number;
  realValue: number;
}

export interface YearlyData {
  year: number;
  totalValue: number;
  contributions: number;
  interest: number;
  realValue: number;
  afterTaxValue: number;
}

export interface ScenarioComparison {
  name: string;
  inputs: InvestmentInputs;
  result: InvestmentResult;
  color: string;
}

export interface MarketScenario {
  name: string;
  description: string;
  returnRate: number;
  volatility: number;
  color: string;
}