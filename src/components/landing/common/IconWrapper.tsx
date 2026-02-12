import React from 'react';

const IconWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 ${className}`}>
    {children}
  </div>
);

export default IconWrapper;
