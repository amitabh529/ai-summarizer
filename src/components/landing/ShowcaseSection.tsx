import React, { useState, useRef } from 'react';
import AnimatedSection from './AnimatedSection';
import GlassCard from './common/GlassCard';
import { useInView } from 'framer-motion';
import FlowchartAnimation from './showcase/FlowchartAnimation';
import MindMapAnimation from './showcase/MindMapAnimation';

const ShowcaseSection = () => {
    const [activeTab, setActiveTab] = useState('flowchart');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    
    return (
        <section id="showcase" className="py-20 sm:py-32" ref={ref}>
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">See the Magic Happen</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                        Watch as raw text from your PDF is transformed into structured, visual knowledge.
                    </p>
                </div>

                <div className="mt-12">
                    <div className="flex justify-center space-x-2 rounded-xl bg-slate-800/80 p-1">
                        <button onClick={() => setActiveTab('flowchart')} className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${activeTab === 'flowchart' ? 'bg-cyan-500 shadow' : 'text-slate-300 hover:bg-white/[0.12]'}`}>Flowchart</button>
                        <button onClick={() => setActiveTab('mindmap')} className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${activeTab === 'mindmap' ? 'bg-violet-500 shadow' : 'text-slate-300 hover:bg-white/[0.12]'}`}>Mind Map</button>
                    </div>

                    <div className="mt-8">
                       <GlassCard className="p-4 sm:p-8 aspect-video overflow-hidden">
                           {activeTab === 'flowchart' ? <FlowchartAnimation inView={isInView} /> : <MindMapAnimation inView={isInView} />}
                       </GlassCard>
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
};

export default ShowcaseSection;
