import React from 'react';
import { motion } from 'framer-motion';

const FlowchartAnimation = ({ inView }: { inView: boolean }) => {
    const nodes = [
        { id: 'start', text: 'Start', x: 5, y: 50, type: 'start' },
        { id: 'q1', text: 'Is input valid?', x: 25, y: 50, type: 'decision' },
        { id: 'p1', text: 'Process Data', x: 50, y: 25, type: 'process' },
        { id: 'p2', text: 'Log Error', x: 50, y: 75, type: 'process' },
        { id: 'end', text: 'End', x: 75, y: 50, type: 'end' },
    ];
    const edges = [
        { from: 'start', to: 'q1' },
        { from: 'q1', to: 'p1' },
        { from: 'q1', to: 'p2' },
        { from: 'p1', to: 'end' },
        { from: 'p2', to: 'end' },
    ];
    
    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
            </defs>

            {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from)!;
                const toNode = nodes.find(n => n.id === edge.to)!;
                return (
                     <motion.path
                        key={i}
                        d={`M ${fromNode.x},${fromNode.y} L ${toNode.x},${toNode.y}`}
                        stroke="#64748b"
                        strokeWidth="0.5"
                        markerEnd="url(#arrow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: (nodes.length + i) * 0.2, ease: "easeInOut" }}
                    />
                );
            })}
            
            {nodes.map((node, i) => (
                <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 100, damping: 12, delay: i * 0.2 }}
                >
                    {node.type === 'decision' ? 
                        <path d={`M ${node.x-7},${node.y} L ${node.x},${node.y-7} L ${node.x+7},${node.y} L ${node.x},${node.y+7} Z`} fill="#818cf8" stroke="#a78bfa" strokeWidth="0.5" /> :
                        <rect x={node.x - 7} y={node.y - 4} width="14" height="8" rx="1" fill={node.type.includes('end') || node.type.includes('start') ? "#38bdf8" : "#4f46e5"} stroke="#6366f1" strokeWidth="0.5" />
                    }
                    <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill="white" fontSize="3" fontFamily="sans-serif">{node.text}</text>
                </motion.g>
            ))}
        </svg>
    );
};

export default FlowchartAnimation;
