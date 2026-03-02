import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { EMISSION_FACTORS } from '../../config/constants';

/**
 * Carbon bar chart component
 * @param {Object} props - Component props
 * @param {Array} props.records - Array of record objects
 */
export function CarbonBarChart({ records }) {
  // Calculate CO2 saved per category
  const chartData = React.useMemo(() => {
    const carbonByCategory = {};
    
    records.forEach((record) => {
      carbonByCategory[record.category] = 
        (carbonByCategory[record.category] || 0) + record.carbonSaved;
    });

    return Object.entries(carbonByCategory).map(([category, carbon]) => ({
      name: category,
      carbon: Math.round(carbon * 100) / 100,
      color: EMISSION_FACTORS[category]?.color || '#6b8f6e',
      icon: EMISSION_FACTORS[category]?.icon || '📦',
    }));
  }, [records]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-eco-surface border border-eco-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span>{data.icon}</span>
            <span className="font-medium text-eco-text">{data.name}</span>
          </div>
          <div className="text-sm text-eco-accent">
            {data.carbon.toFixed(2)} kg CO₂ saved
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill={props.payload.color} radius={[4, 4, 0, 0]} />;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-eco-text-muted">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2f1f"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b8f6e', fontSize: 11 }}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b8f6e', fontSize: 12 }}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="carbon"
            radius={[4, 4, 0, 0]}
            fill="#3ddc60"
          >
            {chartData.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CarbonBarChart;
