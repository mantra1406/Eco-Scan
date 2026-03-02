import React from 'react';

/**
 * Badge component with multiple variants
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {'recyclable'|'biodegradable'|'hazardous'|'low'|'medium'|'high'|'default'} props.variant - Badge variant
 * @param {string} props.className - Additional CSS classes
 */
export function Badge({
  children,
  variant = 'default',
  className = '',
}) {
  const variantClasses = {
    recyclable: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    biodegradable: 'bg-green-500/20 text-green-400 border-green-500/30',
    hazardous: 'bg-red-500/20 text-red-400 border-red-500/30',
    low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    default: 'bg-eco-surface2 text-eco-text-muted border-eco-border',
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-xs font-medium
        rounded-full
        border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Get badge variant for waste type
 * @param {string} wasteType - Waste type
 * @returns {string} - Badge variant
 */
export function getWasteTypeBadgeVariant(wasteType) {
  const variants = {
    Recyclable: 'recyclable',
    Biodegradable: 'biodegradable',
    Hazardous: 'hazardous',
  };
  return variants[wasteType] || 'default';
}

/**
 * Get badge variant for impact level
 * @param {string} impact - Impact level
 * @returns {string} - Badge variant
 */
export function getImpactBadgeVariant(impact) {
  const variants = {
    'Low Impact': 'low',
    'Medium Impact': 'medium',
    'High Impact': 'high',
  };
  return variants[impact] || 'default';
}

export default Badge;
