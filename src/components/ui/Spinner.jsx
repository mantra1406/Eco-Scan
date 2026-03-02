import React from 'react';

/**
 * Spinner component for loading states
 * @param {Object} props - Component props
 * @param {'sm'|'md'|'lg'} props.size - Spinner size
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Optional text to display below spinner
 */
export function Spinner({ size = 'md', className = '', text = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-eco-accent/30
          border-t-eco-accent
          rounded-full
          animate-spin
        `}
      />
      {text && (
        <span className={`text-eco-text-muted ${textSizes[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Full-screen spinner overlay
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text
 */
export function FullScreenSpinner({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-eco-bg/80 backdrop-blur-sm">
      <Spinner size="lg" text={text} />
    </div>
  );
}

/**
 * Inline spinner for button loading states
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
export function InlineSpinner({ className = '' }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Spinner;
