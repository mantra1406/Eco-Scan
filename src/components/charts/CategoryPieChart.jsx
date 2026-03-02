import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { EMISSION_FACTORS } from '../../config/constants';

/**
 * Category pie chart component
 * @param {Object} props - Component props
 * @param {Array} props.records - Array of record objects
 */
export function CategoryPieChart({ records }) {
  // Calculate category distribution
  const categoryData = React.useMemo(() => {
    const counts = {};
    records.forEach((record) => {
      counts[record.category] = (counts[record.category] || 0) + 1;
    });

    return Object.entries(counts).map(([category, count]) => ({
      name: category,
      value: count,
      color: EMISSION_FACTORS[category]?.color || '#6b8f6e',
      icon: EMISSION_FACTORS[category]?.icon || '📦',
    }));
  }, [records]);

  const totalScans = records.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalScans) * 100).toFixed(1);
      return (
        <div className="bg-eco-surface border border-eco-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span>{data.icon}</span>
            <span className="font-medium text-eco-text">{data.name}</span>
          </div>
          <div className="text-sm text-eco-text-muted">
            {data.value} scans ({percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>{entry.payload.icon}</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-eco-text-muted">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (categoryData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-eco-text-muted">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-[-20px]">
          <div className="font-syne font-bold text-2xl text-eco-accent">
            {totalScans}
          </div>
          <div className="text-xs text-eco-text-muted">Total</div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPieChart;
