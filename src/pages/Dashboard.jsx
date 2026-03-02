import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Cloud, Star, Scan, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { WeeklyTrendChart } from '../components/charts/WeeklyTrendChart';
import { CarbonBarChart } from '../components/charts/CarbonBarChart';
import { useApp } from '../context/AppContext';
import { seedMockData } from '../utils/mockData';
import { EMISSION_FACTORS } from '../config/constants';

/**
 * KPI card component with animated counter
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.label - KPI label
 * @param {string|number} props.value - KPI value
 * @param {string} props.unit - Optional unit
 * @param {string} props.color - Color variant
 * @param {number} props.delay - Animation delay
 */
function KPICard({ icon, label, value, unit = '', color = 'accent', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setDisplayValue(numValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.round(current * 10) / 10);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const colorClasses = {
    accent: 'bg-eco-accent-dim text-eco-accent',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000) return val.toLocaleString();
      if (val % 1 !== 0) return val.toFixed(1);
      return val.toString();
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4 }}
    >
      <Card className="h-full">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <div className="font-syne font-bold text-2xl text-eco-text">
              {formatValue(displayValue)}
              {unit && <span className="text-lg text-eco-text-muted ml-1">{unit}</span>}
            </div>
            <div className="text-sm text-eco-text-muted">{label}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Skeleton loader for KPI cards
 */
function KPICardSkeleton() {
  return (
    <Card className="h-full">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-eco-surface2 animate-pulse" />
        <div className="flex-1">
          <div className="h-8 w-20 bg-eco-surface2 rounded animate-pulse mb-2" />
          <div className="h-4 w-24 bg-eco-surface2 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

/**
 * Top category card component
 * @param {Object} props - Component props
 * @param {Array} props.records - Array of record objects
 */
function TopCategoryCard({ records }) {
  const topCategory = React.useMemo(() => {
    const counts = {};
    records.forEach((record) => {
      counts[record.category] = (counts[record.category] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;

    const [category, count] = sorted[0];
    const categoryRecords = records.filter((r) => r.category === category);
    const totalWeight = categoryRecords.reduce((sum, r) => sum + r.weight, 0);
    const totalCO2 = categoryRecords.reduce((sum, r) => sum + r.carbonSaved, 0);

    return {
      category,
      count,
      totalWeight,
      totalCO2,
      ...EMISSION_FACTORS[category],
    };
  }, [records]);

  if (!topCategory) {
    return (
      <Card className="h-full">
        <div className="text-center text-eco-text-muted py-8">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-eco-accent/30">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${topCategory.color}20` }}
        >
          {topCategory.icon}
        </div>
        <div>
          <div className="text-sm text-eco-text-muted">Top Category</div>
          <div className="font-syne font-bold text-xl text-eco-text">
            {topCategory.category}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-eco-border">
        <div className="text-center">
          <div className="font-syne font-bold text-lg text-eco-accent">
            {topCategory.count}
          </div>
          <div className="text-xs text-eco-text-muted">Scans</div>
        </div>
        <div className="text-center">
          <div className="font-syne font-bold text-lg text-eco-accent">
            {topCategory.totalWeight.toFixed(1)}kg
          </div>
          <div className="text-xs text-eco-text-muted">Weight</div>
        </div>
        <div className="text-center">
          <div className="font-syne font-bold text-lg text-eco-accent">
            {topCategory.totalCO2.toFixed(1)}kg
          </div>
          <div className="text-xs text-eco-text-muted">CO₂ Saved</div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="font-syne font-bold text-xl text-eco-text mb-2">
        No scans yet
      </h3>
      <p className="text-eco-text-muted mb-6">
        Start scanning waste to see your environmental impact
      </p>
      <Link to="/scanner">
        <Button variant="primary">
          Start Scanning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

/**
 * Dashboard page component
 */
export function Dashboard() {
  const { records, isLoading, getTotalWeight, getTotalCO2Saved, getTotalGreenPoints, getTotalScans } = useApp();
  const [isSeeding, setIsSeeding] = useState(true);

  // Seed mock data on first load
  useEffect(() => {
    if (!isLoading && records.length === 0) {
      seedMockData();
      window.location.reload();
    } else {
      setIsSeeding(false);
    }
  }, [isLoading, records.length]);

  const kpiData = [
    {
      icon: <Scale className="w-6 h-6" />,
      label: 'Total Waste Processed',
      value: getTotalWeight().toFixed(1),
      unit: 'kg',
      color: 'accent',
      delay: 0,
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      label: 'Total CO₂ Saved',
      value: getTotalCO2Saved().toFixed(1),
      unit: 'kg',
      color: 'blue',
      delay: 100,
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Green Points Earned',
      value: getTotalGreenPoints(),
      unit: '',
      color: 'yellow',
      delay: 200,
    },
    {
      icon: <Scan className="w-6 h-6" />,
      label: 'Total Scans',
      value: getTotalScans(),
      unit: '',
      color: 'green',
      delay: 300,
    },
  ];

  if (isLoading || isSeeding) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-10 w-48 bg-eco-surface2 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-eco-surface2 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="h-80 animate-pulse" />
          <Card className="h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-syne font-bold text-3xl text-eco-text mb-2">
            Dashboard
          </h1>
          <p className="text-eco-text-muted">
            Track your sustainability performance over time
          </p>
        </div>
        <Card>
          <EmptyState />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-syne font-bold text-3xl text-eco-text mb-2">
          Dashboard
        </h1>
        <p className="text-eco-text-muted">
          Track your sustainability performance over time
        </p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-eco-accent" />
              <h3 className="font-syne font-bold text-lg text-eco-text">
                Waste by Category
              </h3>
            </div>
            <CategoryPieChart records={records} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-eco-accent" />
              <h3 className="font-syne font-bold text-lg text-eco-text">
                Weekly Waste Trend
              </h3>
            </div>
            <WeeklyTrendChart records={records} />
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-eco-accent" />
              <h3 className="font-syne font-bold text-lg text-eco-text">
                CO₂ Saved by Category
              </h3>
            </div>
            <CarbonBarChart records={records} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <TopCategoryCard records={records} />
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
