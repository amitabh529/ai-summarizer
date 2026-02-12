import React, { useState, useEffect, useRef, forwardRef } from 'react';
import AnimatedSection from './AnimatedSection';
import GlassCard from './common/GlassCard';
import { FileTextIcon, UploadCloudIcon, MessageSquareIcon, XIcon } from './common/Icons';
import { motion, useInView } from 'framer-motion';

const GeneratorSection = forwardRef<HTMLDivElement>((props, ref) => {
    const [isBotVisible, setIsBotVisible] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

    useEffect(() => {
        if (isInView) {
            setIsBotVisible(true);
        }
    }, [isInView]);

    const botVariants = {
        hidden: { x: "150%", rotate: 180, scale: 0.3 },
        visible: {
            x: 0,
            rotate: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
                delay: 0.5,
            },
        },
    };

    return (
        <section ref={ref} className="py-20 sm:py-32 relative">
            <div ref={sectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <AnimatedSection>
                        <div>
                            <span className="text-cyan-400 font-semibold">Instant Clarity</span>
                            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">Go from PDF to Summary in Seconds</h2>
                            <p className="mt-4 text-lg text-slate-300">
                                Our tool doesn't just shorten text. It extracts core ideas, identifies key themes, and structures them for maximum comprehension. Get the gist without the grind.
                            </p>
                            <div className="mt-8 space-y-6">
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <h4 className="font-bold text-violet-400">Heading 1: Core Concepts</h4>
                                    <p className="text-sm text-slate-400 mt-1">A brief summary of the main arguments and definitions presented in the document.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <h4 className="font-bold text-violet-400">Heading 2: Key Data Points</h4>
                                    <p className="text-sm text-slate-400 mt-1">Crucial statistics, findings, and evidence are extracted and listed for quick review.</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection>
                        <GlassCard className="p-6 sm:p-8">
                           <div className="text-center">
                               <FileTextIcon className="mx-auto w-8 h-8 text-cyan-400"/>
                               <h3 className="mt-2 text-xl font-bold text-white">Generate Your Summary</h3>
                               <p className="text-slate-400 mt-1 text-sm">Upload a file up to 10MB</p>
                           </div>
                           <div className="mt-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50">
                                <UploadCloudIcon className="w-10 h-10 text-slate-500"/>
                                <p className="mt-2 text-slate-400">
                                    <span className="font-semibold text-cyan-400 cursor-pointer hover:underline">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT</p>
                           </div>
                           <button className="mt-6 w-full py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-500 transition-all duration-300">
                                Generate
                           </button>
                        </GlassCard>
                    </AnimatedSection>
                </div>
            </div>

            {/* AI Bot */}
            <motion.div
                variants={botVariants}
                initial="hidden"
                animate={isBotVisible ? "visible" : "hidden"}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 z-50 cursor-pointer"
            >
                <div className="relative">
                    <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/50"
                        animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: ["0 0 20px rgba(132, 102, 246, 0.4)", "0 0 30px rgba(34, 211, 238, 0.5)", "0 0 20px rgba(132, 102, 246, 0.4)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <MessageSquareIcon className="text-white w-8 h-8" />
                    </motion.div>
                </div>
            </motion.div>
            
            {/* AI Chat Window */}
            {isChatOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed bottom-24 right-6 z-40 w-80 h-96"
                >
                    <GlassCard className="w-full h-full flex flex-col">
                        <div className="flex justify-between items-center p-3 border-b border-slate-700/50">
                            <h4 className="font-bold text-white">AI Assistant</h4>
                            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-grow p-3 text-sm text-slate-300">
                            Ask me anything about the content on this page!
                        </div>
                        <div className="p-3 border-t border-slate-700/50">
                            <input type="text" placeholder="Type your question..." className="w-full bg-slate-700/50 text-white placeholder-slate-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                    </GlassCard>
                </motion.div>
            )}
        </section>
    );
});

export default GeneratorSection;
