import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Weekly trend chart component
 * @param {Object} props - Component props
 * @param {Array} props.records - Array of record objects
 */
export function WeeklyTrendChart({ records }) {
  // Calculate daily totals for the last 7 days
  const chartData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        day: dayName,
        date: dateStr,
        weight: 0,
      });
    }

    // Aggregate records by date
    records.forEach((record) => {
      const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
      const dayData = data.find((d) => d.date === recordDate);
      if (dayData) {
        dayData.weight += record.weight;
      }
    });

    // Round weights to 1 decimal
    return data.map((d) => ({
      ...d,
      weight: Math.round(d.weight * 10) / 10,
    }));
  }, [records]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-eco-surface border border-eco-border rounded-lg p-3 shadow-lg">
          <div className="font-medium text-eco-text mb-1">{label}</div>
          <div className="text-sm text-eco-accent">
            {payload[0].value} kg waste
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2f1f"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b8f6e', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b8f6e', fontSize: 12 }}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3ddc60"
            strokeWidth={3}
            dot={{ fill: '#3ddc60', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, stroke: '#3ddc60', strokeWidth: 2, fill: '#0a0f0a' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyTrendChart;
