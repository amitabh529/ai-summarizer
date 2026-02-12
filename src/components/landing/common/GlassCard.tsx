import React from 'react';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

export default GlassCard;
