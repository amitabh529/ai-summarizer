import React from 'react';
import AnimatedSection from './AnimatedSection';
import GlassCard from './common/GlassCard';
import IconWrapper from './common/IconWrapper';
import { CpuIcon, LayoutIcon, EditIcon } from './common/Icons';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
    const features = [
        {
            icon: <CpuIcon className="text-cyan-400 w-6 h-6" />,
            title: "AI-Powered PDF Summarizer",
            description: "Our advanced AI condenses lengthy documents into key points, saving you hours of reading.",
        },
        {
            icon: <LayoutIcon className="text-violet-400 w-6 h-6" />,
            title: "Automatic Flowchart Generator",
            description: "Transform complex processes and data from your PDFs into clear, easy-to-follow flowcharts.",
        },
        {
            icon: <EditIcon className="text-fuchsia-400 w-6 h-6" />,
            title: "Smart Mind Map Creator",
            description: "Visually organize key concepts and connections from your text into intuitive mind maps.",
        },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section id="features" className="py-20 sm:py-32">
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Unlock a New Way of Understanding</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                        From dense text to clear visuals, our tools help you learn and retain information effortlessly.
                    </p>
                </div>

                <div className="mt-16 hidden md:grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <GlassCard className="p-8 h-full flex flex-col items-start text-left group">
                                <IconWrapper>
                                    {feature.icon}
                                </IconWrapper>
                                <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
                                <p className="mt-2 text-slate-300 flex-grow">{feature.description}</p>
                                <div className="mt-4 h-[2px] w-1/4 bg-cyan-500/50 group-hover:w-full group-hover:bg-cyan-400 transition-all duration-300"></div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
                
                {/* Replaced Swiper with native CSS scroll for mobile */}
                <div className="mt-12 md:hidden">
                    <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                         {features.map((feature) => (
                            <div key={feature.title} className="flex-shrink-0 w-4/5">
                                <GlassCard className="p-8 h-full flex flex-col items-start text-left group">
                                    <IconWrapper>
                                        {feature.icon}
                                    </IconWrapper>
                                    <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
                                    <p className="mt-2 text-slate-300 flex-grow">{feature.description}</p>
                               </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
};

export default FeaturesSection;
