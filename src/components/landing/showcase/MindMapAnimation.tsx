// import React from 'react';
import { motion } from 'framer-motion';

const MindMapAnimation = ({ inView }: { inView: boolean }) => {
    const center = { x: 50, y: 50 };
    const nodes = [
        { id: 'main', text: 'Main Idea', level: 0, angle: 0, distance: 0 },
        { id: 'c1', text: 'Topic A', level: 1, angle: -30, distance: 20 },
        { id: 'c2', text: 'Topic B', level: 1, angle: 90, distance: 22 },
        { id: 'c3', text: 'Topic C', level: 1, angle: 210, distance: 20 },
        { id: 'c1-1', text: 'Detail 1', level: 2, parent: 'c1', angle: -60, distance: 15 },
        { id: 'c1-2', text: 'Detail 2', level: 2, parent: 'c1', angle: 0, distance: 15 },
        { id: 'c2-1', text: 'Detail 3', level: 2, parent: 'c2', angle: 120, distance: 15 },
        { id: 'c3-1', text: 'Detail 4', level: 2, parent: 'c3', angle: 180, distance: 15 },
    ];

    const getPosition = (node: any): { x: number; y: number } => {
        if (node.level === 0) return center;
        const parentNode = node.level === 1 ? nodes.find(n => n.id === 'main') : nodes.find(n => n.id === node.parent);
        const parentPos = getPosition(parentNode);
        const angleRad = (node.angle * Math.PI) / 180;
        return {
            x: parentPos.x + node.distance * Math.cos(angleRad),
            y: parentPos.y + node.distance * Math.sin(angleRad),
        };
    };

    const positions = nodes.map(node => ({ ...node, ...getPosition(node) }));

    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {positions.filter(n => n.level > 0).map((node, i) => {
                const parentNode = positions.find(n => n.id === (node.level === 1 ? 'main' : node.parent));
                if (!parentNode) return null;
                return (
                    <motion.path
                        key={`line-${node.id}`}
                        d={`M ${parentNode.x},${parentNode.y} C ${parentNode.x},${node.y} ${node.x},${parentNode.y} ${node.x},${node.y}`}
                        stroke="#64748b"
                        strokeWidth="0.4"
                        fill="transparent"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: (i + 1) * 0.2, ease: "easeInOut" }}
                    />
                );
            })}
             {positions.map((node, i) => (
                <motion.g 
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: i * 0.2 }}>
                    <circle cx={node.x} cy={node.y} r={node.level === 0 ? 8 : (node.level === 1 ? 6 : 4)} fill={node.level === 0 ? "#8b5cf6" : (node.level === 1 ? "#38bdf8" : "#4f46e5")} />
                    <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill="white" fontSize={node.level === 0 ? "3.5" : (node.level === 1 ? "3" : "2.5")}>{node.text}</text>
                </motion.g>
             ))}
        </svg>
    );
};

export default MindMapAnimation;
