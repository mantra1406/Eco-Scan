import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button component with multiple variants
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'ghost'} props.variant - Button variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.fullWidth - Full width button
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {React.ElementType} props.as - Component to render as
 * @param {Object} props.rest - Additional props
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  as: Component = 'button',
  ...rest
}) {
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold
    rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-eco-accent focus:ring-offset-2 focus:ring-offset-eco-bg
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-eco-accent text-eco-bg
      hover:bg-eco-accent2
      active:scale-[0.98]
    `,
    secondary: `
      bg-eco-surface2 text-eco-text
      border border-eco-border
      hover:bg-eco-border hover:border-eco-text-muted
      active:scale-[0.98]
    `,
    danger: `
      bg-eco-danger text-white
      hover:bg-red-600
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-eco-text-muted
      hover:text-eco-text
      hover:bg-eco-surface2
    `,
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.div
      whileHover={!disabled && !loading ? { y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={fullWidth ? 'w-full' : 'inline-block'}
    >
      <Component
        className={classes}
        onClick={handleClick}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            Loading...
          </>
        ) : (
          children
        )}
      </Component>
    </motion.div>
  );
}

export default Button;
