import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import type { InvestmentInputs, ScenarioComparison } from '@/types/investment';
import { calculateInvestment, marketScenarios, formatCurrency } from '@/utils/investmentCalculations';

interface ScenarioComparisonProps {
  baseInputs: InvestmentInputs;
}

const ScenarioComparisonComponent: React.FC<ScenarioComparisonProps> = ({ baseInputs }) => {
  const [scenarios, setScenarios] = useState<ScenarioComparison[]>([
    {
      name: 'Conservative',
      inputs: { ...baseInputs, annualReturn: 4 },
      result: calculateInvestment({ ...baseInputs, annualReturn: 4 }),
      color: '#10b981'
    },
    {
      name: 'Moderate',
      inputs: { ...baseInputs, annualReturn: 7 },
      result: calculateInvestment({ ...baseInputs, annualReturn: 7 }),
      color: '#3b82f6'
    },
    {
      name: 'Aggressive',
      inputs: { ...baseInputs, annualReturn: 10 },
      result: calculateInvestment({ ...baseInputs, annualReturn: 10 }),
      color: '#f59e0b'
    }
  ]);

  const addScenario = (marketScenario: typeof marketScenarios[0]) => {
    const newInputs = { ...baseInputs, annualReturn: marketScenario.returnRate };
    const newScenario: ScenarioComparison = {
      name: marketScenario.name,
      inputs: newInputs,
      result: calculateInvestment(newInputs),
      color: marketScenario.color
    };

    setScenarios(prev => {
      const exists = prev.find(s => s.name === marketScenario.name);
      if (exists) return prev;
      return [...prev, newScenario];
    });
  };

  const removeScenario = (index: number) => {
    setScenarios(prev => prev.filter((_, i) => i !== index));
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (scenarios.length === 0) return [];
    
    const maxYears = Math.max(...scenarios.map(s => s.inputs.years));
    const data = [];
    
    for (let year = 1; year <= maxYears; year++) {
      const yearData: any = { year };
      
      scenarios.forEach(scenario => {
        const yearlyData = scenario.result.yearlyData.find(d => d.year === year);
        if (yearlyData) {
          yearData[scenario.name] = yearlyData.totalValue;
        }
      });
      
      data.push(yearData);
    }
    
    return data;
  }, [scenarios]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{`Year ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Scenario Management */}
      <Card className="investment-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Market Scenario Comparison
          </CardTitle>
          <CardDescription>
            Compare different investment scenarios and market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {marketScenarios.map((scenario) => (
              <Button
                key={scenario.name}
                variant="outline"
                size="sm"
                onClick={() => addScenario(scenario)}
                className="flex items-center gap-2"
              >
                <Plus className="h-3 w-3" />
                {scenario.name} ({scenario.returnRate}%)
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg relative"
                style={{ borderColor: scenario.color }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: scenario.color }}
                    />
                    <h4 className="font-semibold">{scenario.name}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScenario(index)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Return Rate:</span>
                    <Badge variant="secondary">
                      {scenario.inputs.annualReturn}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Final Value:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(scenario.result.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Growth:</span>
                    <span className="font-mono font-semibold text-success">
                      {formatCurrency(scenario.result.totalInterest)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      {scenarios.length > 0 && (
        <Card className="investment-card">
          <CardHeader>
            <CardTitle>Growth Comparison</CardTitle>
            <CardDescription>
              Visual comparison of different investment scenarios over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `Year ${value}`}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {scenarios.map((scenario, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={scenario.name}
                      stroke={scenario.color}
                      strokeWidth={2}
                      dot={{ r: 3, fill: scenario.color }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Table */}
      {scenarios.length > 0 && (
        <Card className="investment-card">
          <CardHeader>
            <CardTitle>Scenario Summary</CardTitle>
            <CardDescription>
              Quick comparison of final values across all scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Scenario</th>
                    <th className="text-right py-2">Return Rate</th>
                    <th className="text-right py-2">Final Value</th>
                    <th className="text-right py-2">Total Growth</th>
                    <th className="text-right py-2">After Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: scenario.color }}
                          />
                          {scenario.name}
                        </div>
                      </td>
                      <td className="text-right py-3 font-mono">
                        {scenario.inputs.annualReturn}%
                      </td>
                      <td className="text-right py-3 font-mono font-semibold">
                        {formatCurrency(scenario.result.totalValue)}
                      </td>
                      <td className="text-right py-3 font-mono font-semibold text-success">
                        {formatCurrency(scenario.result.totalInterest)}
                      </td>
                      <td className="text-right py-3 font-mono">
                        {formatCurrency(scenario.result.afterTaxValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScenarioComparisonComponent;