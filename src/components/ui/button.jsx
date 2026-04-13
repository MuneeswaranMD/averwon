import React from 'react';

export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl',
    outline: 'border-2 border-slate-600 text-white hover:bg-white/10 hover:border-cyan-400',
    ghost: 'hover:bg-white/10 text-white',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
