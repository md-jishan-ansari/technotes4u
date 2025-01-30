
'use client'

import React from 'react'

type ButtonVariant = 'primary' | 'primaryOutline' | 'primaryGhost' | 'secondary' | 'secondaryOutline' | 'secondaryGhost' | 'dark' | 'danger' | 'dangerOutline' | 'dangerGhost'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  rounded?: string
  isLoading?: boolean
  width?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-700 text-white hover:bg-blue-800',
  primaryOutline: 'bg-transparent border border-blue-600 text-blue-600 hover:border-blue-800 hover:text-blue-800 focus:border-blue-800 focus:text-blue-800 dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-700 dark:hover:border-blue-700',
  primaryGhost: ' border border-transparent text-blue-600 hover:bg-blue-100 focus:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:bg-blue-800/30 dark:focus:text-blue-400',
  secondary: 'bg-gray-500 border text-white hover:bg-gray-600 focus:bg-gray-600',
  secondaryOutline: 'bg-transparent border border-gray-600 text-gray-600 hover:border-gray-800 hover:text-gray-800 focus:outline-none focus:border-gray-800 focus:text-gray-800 dark:border-white dark:text-white dark:hover:text-neutral-300 dark:hover:border-neutral-300',
  secondaryGhost: 'border border-transparent text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
  dark: 'border bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900',
  danger: 'border border-transparent bg-red-600 text-white hover:bg-red-700 focus:bg-red-700',
  dangerOutline: 'bg-transparent border border-red-600 text-red-600 hover:border-red-700 hover:text-red-700 focus:border-red-700 focus:text-red-700',
  dangerGhost: 'border border-transparent text-red-500 hover:bg-red-100 focus:outline-none focus:bg-red-100 hover:text-red-800 dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:bg-red-800/30 dark:focus:text-red-400'
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-sm',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth,
    rounded,
    isLoading,
    disabled,
    className = '',
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center
          transition-all duration-200
          font-medium
          outline-none
          active:outline-none
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${rounded ? rounded : "rounded-lg"}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
