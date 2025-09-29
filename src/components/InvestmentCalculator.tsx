import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Target, PieChart } from 'lucide-react';
import type { InvestmentInputs } from '@/types/investment';
import { calculateInvestment, marketScenarios } from '@/utils/investmentCalculations';
import ResultsDisplay from './ResultsDisplay';
import ComparisonChart from './ComparisonChart';
import ScenarioComparison from './ScenarioComparison';

const InvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InvestmentInputs>({
    initialAmount: 10000,
    monthlyContribution: 500,
    annualReturn: 7,
    years: 30,
    inflationRate: 2.5,
    taxRate: 15,
    compoundingFrequency: 12
  });

  const [results, setResults] = useState(() => calculateInvestment(inputs));
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    const newResults = calculateInvestment(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (field: keyof InvestmentInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyScenario = (scenarioName: string) => {
    const scenario = marketScenarios.find(s => s.name === scenarioName);
    if (scenario) {
      handleInputChange('annualReturn', scenario.returnRate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 gradient-primary rounded-full">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Investment Calculator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate potential returns on your investments with various market scenarios and advanced financial modeling
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="lg:col-span-1">
                <Card className="investment-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      Investment Parameters
                    </CardTitle>
                    <CardDescription>
                      Enter your investment details to calculate potential returns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="initial">Initial Investment</Label>
                        <Input
                          id="initial"
                          type="number"
                          value={inputs.initialAmount}
                          onChange={(e) => handleInputChange('initialAmount', parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthly">Monthly Contribution</Label>
                        <Input
                          id="monthly"
                          type="number"
                          value={inputs.monthlyContribution}
                          onChange={(e) => handleInputChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="return">Annual Return (%)</Label>
                        <Input
                          id="return"
                          type="number"
                          step="0.1"
                          value={inputs.annualReturn}
                          onChange={(e) => handleInputChange('annualReturn', parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="years">Investment Period (Years)</Label>
                        <Input
                          id="years"
                          type="number"
                          value={inputs.years}
                          onChange={(e) => handleInputChange('years', parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inflation">Inflation Rate (%)</Label>
                        <Input
                          id="inflation"
                          type="number"
                          step="0.1"
                          value={inputs.inflationRate}
                          onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax">Tax Rate (%)</Label>
                        <Input
                          id="tax"
                          type="number"
                          step="0.1"
                          value={inputs.taxRate}
                          onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scenario">Market Scenario</Label>
                      <Select onValueChange={applyScenario}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a market scenario" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketScenarios.map((scenario) => (
                            <SelectItem key={scenario.name} value={scenario.name}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: scenario.color }}
                                />
                                <span>{scenario.name} ({scenario.returnRate}%)</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      variant="calculator" 
                      className="w-full"
                      onClick={() => setResults(calculateInvestment(inputs))}
                    >
                      Calculate Investment
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2">
                <ResultsDisplay results={results} inputs={inputs} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <ComparisonChart results={results} />
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <ScenarioComparison baseInputs={inputs} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="investment-card">
                <CardHeader>
                  <CardTitle>Investment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Contributions</span>
                      <span className="font-mono font-semibold">
                        ${results.totalContributions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Investment Growth</span>
                      <span className="font-mono font-semibold text-success">
                        ${results.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth Percentage</span>
                      <span className="font-mono font-semibold text-success">
                        {((results.totalInterest / results.totalContributions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="investment-card">
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Inflation Impact</span>
                      <span className="font-mono font-semibold text-warning">
                        -${(results.totalValue - results.realValue).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tax Impact</span>
                      <span className="font-mono font-semibold text-warning">
                        -${(results.totalValue - results.afterTaxValue).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Real Purchasing Power</span>
                      <span className="font-mono font-semibold">
                        ${results.realValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestmentCalculator;