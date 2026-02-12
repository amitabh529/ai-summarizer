
import React, { useRef, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import GeneratorSection from '../components/landing/GeneratorSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ShowcaseSection from '../components/landing/ShowcaseSection';
import Footer from '../components/landing/Footer';


const LandingPage = () => {
  const generatorRef = useRef<HTMLDivElement>(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#020617",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ["#38bdf8", "#818cf8", "#a78bfa"],
      },
      links: {
        color: "#4f46e5",
        distance: 150,
        enable: false,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce' as const,
        },
        random: true,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: {min: 0.1, max: 0.5},
        animation: {
          enable: true,
          speed: 0.5,
          sync: false
        }
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
            enable: true,
            speed: 2,
            sync: false
        }
      },
    },
    detectRetina: true,
  };

  return (
    <div className="bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/20 overflow-y-scroll [&::-webkit-scrollbar]:hidden ">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="fixed inset-0 -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900"></div>
      <Header  />
  <main>
        <HeroSection onTryNowClick={scrollToGenerator} />
        <FeaturesSection />
        
        <HowItWorksSection />
        <ShowcaseSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
// ...existing code...

  
