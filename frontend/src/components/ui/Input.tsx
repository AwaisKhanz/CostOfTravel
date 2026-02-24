import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block px-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 transition-colors group-focus-within:text-brand-primary">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full p-4 bg-background border border-border-subtle rounded-button font-bold 
            focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all
            placeholder:text-foreground/20
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon ? 'pr-11' : 'pr-4'}
            ${error ? 'border-brand-danger focus:ring-brand-danger/20' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-brand-danger px-1">
          {error}
        </p>
      )}
    </div>
  );
};
