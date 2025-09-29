import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, PiggyBank, Calculator } from 'lucide-react';
import type { InvestmentResult, InvestmentInputs } from '@/types/investment';
import { formatCurrency, formatPercent } from '@/utils/investmentCalculations';

interface ResultsDisplayProps {
  results: InvestmentResult;
  inputs: InvestmentInputs;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, inputs }) => {
  const totalReturn = ((results.totalValue - results.totalContributions) / results.totalContributions) * 100;
  
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="investment-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success number-animate">
              {formatCurrency(results.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              After {inputs.years} years
            </p>
          </CardContent>
        </Card>

        <Card className="investment-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <PiggyBank className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold number-animate">
              {formatCurrency(results.totalContributions)}
            </div>
            <p className="text-xs text-muted-foreground">
              Your total investment
            </p>
          </CardContent>
        </Card>

        <Card className="investment-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Growth</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success number-animate">
              {formatCurrency(results.totalInterest)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalReturn.toFixed(1)}% total return
            </p>
          </CardContent>
        </Card>

        <Card className="investment-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">After-Tax Value</CardTitle>
            <Calculator className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold number-animate">
              {formatCurrency(results.afterTaxValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              After {formatPercent(inputs.taxRate)} tax rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="investment-card">
        <CardHeader>
          <CardTitle>Investment Analysis</CardTitle>
          <CardDescription>
            Comprehensive breakdown of your investment projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Growth Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Growth Rate:</span>
                  <span className="font-mono font-semibold">{formatPercent(inputs.annualReturn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Return:</span>
                  <span className="font-mono font-semibold text-success">
                    {totalReturn.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Contribution:</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(inputs.monthlyContribution)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Years to Goal:</span>
                  <span className="font-mono font-semibold">{inputs.years} years</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Risk Adjustments</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inflation Rate:</span>
                  <span className="font-mono font-semibold">{formatPercent(inputs.inflationRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Real Value (Inflation-Adjusted):</span>
                  <span className="font-mono font-semibold text-warning">
                    {formatCurrency(results.realValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Rate:</span>
                  <span className="font-mono font-semibold">{formatPercent(inputs.taxRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">After-Tax Value:</span>
                  <span className="font-mono font-semibold text-info">
                    {formatCurrency(results.afterTaxValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Portfolio Composition</span>
              <span>{formatCurrency(results.totalValue)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-primary transition-all duration-500"
                  style={{ 
                    width: `${(results.totalContributions / results.totalValue) * 100}%` 
                  }}
                  title={`Contributions: ${formatCurrency(results.totalContributions)}`}
                />
                <div 
                  className="bg-success transition-all duration-500"
                  style={{ 
                    width: `${(results.totalInterest / results.totalValue) * 100}%` 
                  }}
                  title={`Growth: ${formatCurrency(results.totalInterest)}`}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Contributions: {formatCurrency(results.totalContributions)}</span>
              <span>Growth: {formatCurrency(results.totalInterest)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;