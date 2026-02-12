import React from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { SignIn } from "@clerk/clerk-react";

const particlesOptions = {
  background: {
    color: { value: "#020617" },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ["#38bdf8", "#818cf8", "#a78bfa"] },
    links: { color: "#4f46e5", distance: 150, enable: false, opacity: 0.2, width: 1 },
    move: {
      direction: 'none' as const,
      enable: true,
      outModes: { default: 'bounce' as const },
      random: true,
      speed: 1,
      straight: false,
    },
    number: { density: { enable: true, area: 800 }, value: 50 },
    opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.5, sync: false } },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 2, sync: false } },
  },
  detectRetina: true,
};

const LoginPage = () => {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center relative font-sans">
      <Particles
        id="tsparticles-login"
        init={async (engine) => { await loadSlim(engine); }}
        options={particlesOptions}
        className="fixed inset-0 -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900"></div>
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg bg-slate-900/80 backdrop-blur-lg border border-slate-800/50">
      <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-6">Sign In to VizPDF</h2>
      <SignIn routing="path" path="/login" signUpUrl="/signup" appearance={{
        elements: {
          card: 'bg-slate-900/80 border border-slate-700/50 shadow-lg backdrop-blur-lg',
          formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg',
          headerTitle: 'text-cyan-400',
          headerSubtitle: 'text-slate-400',
          socialButtonsBlockButton: 'bg-slate-800 text-slate-100',
          dividerText: 'text-slate-400',
          formFieldInput: 'bg-slate-800 text-white',
          formFieldLabel: 'text-slate-300',
          footerActionText: 'text-slate-400',
          footerActionLink: 'text-cyan-400 hover:underline',
        }
      }} />
    </div>
    </div>
  );
};

export default LoginPage;
