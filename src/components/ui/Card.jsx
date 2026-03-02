import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card component with dark surface styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverLift - Enable hover lift effect
 * @param {boolean} props.glow - Enable glow effect
 * @param {Function} props.onClick - Click handler
 */
export function Card({
  children,
  className = '',
  hoverLift = false,
  glow = false,
  onClick,
}) {
  const baseClasses = `
    bg-eco-surface 
    border border-eco-border 
    rounded-2xl 
    p-6
    ${glow ? 'glow' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (hoverLift) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{
          y: -4,
          boxShadow: '0 8px 30px rgba(61, 220, 96, 0.15)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

/**
 * Card header component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} props.className - Additional CSS classes
 */
export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

/**
 * Card title component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Title content
 * @param {string} props.className - Additional CSS classes
 */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-syne font-bold text-xl text-eco-text ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Card description component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Description content
 * @param {string} props.className - Additional CSS classes
 */
export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-eco-text-muted text-sm mt-1 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Card content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 */
export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

/**
 * Card footer component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} props.className - Additional CSS classes
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-eco-border ${className}`}>
      {children}
    </div>
  );
}

export default Card;
