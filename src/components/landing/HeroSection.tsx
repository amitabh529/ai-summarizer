import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from './common/Icons';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

type HeroSectionProps = {
  onTryNowClick: () => void;
};

const HeroSection: React.FC<HeroSectionProps> = () => {
  const text = "Summarize PDFs & Visualize Ideas Instantly".split(" ");
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleTryNow = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
      <div className="absolute inset-0 -z-1 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_70%)]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500"
        >
          {text.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 max-w-2xl mx-auto text-lg lg:text-xl text-slate-300"
        >
          Upload a PDF, get a concise summary, and automatically generate insightful flowcharts & mind maps to grasp complex information faster.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleTryNow}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
          >
            Try Now <ArrowRightIcon className="inline-block ml-2 w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-slate-100 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-300 transform hover:scale-105">
            See Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
