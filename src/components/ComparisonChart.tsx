import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { InvestmentResult } from '@/types/investment';
import { formatCurrency } from '@/utils/investmentCalculations';

interface ComparisonChartProps {
  results: InvestmentResult;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ results }) => {
  // Prepare chart data - sample every 6 months for better performance
  const chartData = results.yearlyData.map(data => ({
    year: data.year,
    'Total Value': Math.round(data.totalValue),
    'Contributions': Math.round(data.contributions),
    'Growth': Math.round(data.interest),
    'Real Value': Math.round(data.realValue),
    'After-Tax Value': Math.round(data.afterTaxValue)
  }));

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
      {/* Investment Growth Chart */}
      <Card className="investment-card">
        <CardHeader>
          <CardTitle>Investment Growth Over Time</CardTitle>
          <CardDescription>
            Track how your investment grows with compound interest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                <Area
                  type="monotone"
                  dataKey="Contributions"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="Growth"
                  stackId="1"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card className="investment-card">
        <CardHeader>
          <CardTitle>Value Comparison Analysis</CardTitle>
          <CardDescription>
            Compare nominal vs. real vs. after-tax investment values
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
                <Line
                  type="monotone"
                  dataKey="Total Value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Real Value"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="After-Tax Value"
                  stroke="hsl(var(--info))"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Growth Rate Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="investment-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Compound Growth Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {((results.totalValue / results.totalContributions) * 100 - 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total portfolio growth
            </p>
          </CardContent>
        </Card>

        <Card className="investment-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Inflation Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              -{((results.totalValue - results.realValue) / results.totalValue * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Purchasing power erosion
            </p>
          </CardContent>
        </Card>

        <Card className="investment-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tax Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {((results.afterTaxValue / results.totalValue) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              After-tax value retention
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonChart;