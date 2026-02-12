import React from 'react';
import AnimatedSection from './AnimatedSection';
import IconWrapper from './common/IconWrapper';
import { UploadCloudIcon, FileTextIcon, Share2Icon } from './common/Icons';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
    const steps = [
        {
            icon: <UploadCloudIcon className="w-7 h-7 text-cyan-400" />,
            title: "1. Upload",
            description: "Securely upload your PDF document. We prioritize your privacy and data security.",
        },
        {
            icon: <FileTextIcon className="w-7 h-7 text-violet-400" />,
            title: "2. Summarize",
            description: "Our AI analyzes the content, structure, and context to generate a high-quality summary.",
        },
        {
            icon: <Share2Icon className="w-7 h-7 text-fuchsia-400" />,
            title: "3. Visualize",
            description: "Choose to generate a flowchart or a mind map to see the key information visually.",
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <section id="how-it-works" className="py-20 sm:py-32 bg-slate-900/70">
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple Steps to Instant Insight</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                        Our process is designed for speed and simplicity.
                    </p>
                </div>
                <div className="relative mt-16">
                    <div className="absolute left-1/2 -translate-x-1/2 md:left-[calc(50%-1px)] top-10 bottom-10 w-px bg-slate-700 hidden md:block"></div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="space-y-12 md:space-y-0"
                    >
                        {steps.map((step, i) => (
                            <motion.div key={i} variants={itemVariants} className="md:grid md:grid-cols-2 md:gap-8 items-center">
                                <div className={`flex items-center m-4 gap-10  ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                                    <div className="relative">
                                      <IconWrapper>
                                          {step.icon}
                                      </IconWrapper>
                                      <div className="absolute -inset-2 rounded-full border-2 border-slate-700 animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                                        <p className="mt-1 text-slate-300">{step.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </AnimatedSection>
        </section>
    );
};

export default HowItWorksSection;
