import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-sage-blue text-white hover:bg-[#155a75] shadow-lg shadow-sage-blue/20 dark:shadow-none",
    outline: "border-2 border-sage-blue text-sage-blue hover:bg-sage-blue/5 dark:border-sage-blue dark:text-sage-blue dark:hover:bg-sage-blue/10",
    ghost: "text-sage-navy hover:bg-sage-gray/20 dark:text-sage-darkText dark:hover:bg-sage-darkCard"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${props.disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-sage-darkCard rounded-xl shadow-sm border border-sage-gray/30 dark:border-white/10 p-6 transition-colors ${className}`}
  >
    {children}
  </div>
);

export const InputGroup: React.FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-sage-navy dark:text-sage-darkText mb-2">{label}</label>
    {children}
  </div>
);

export const Chip: React.FC<{ label: string; selected?: boolean; onClick?: () => void }> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
      selected 
        ? 'bg-sage-blue text-white border-sage-blue' 
        : 'bg-white dark:bg-sage-darkBg text-sage-navy dark:text-sage-darkText border-sage-gray dark:border-sage-gray/30 hover:border-sage-blue dark:hover:border-sage-blue'
    }`}
  >
    {label}
  </button>
);