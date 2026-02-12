import React from 'react';

const Footer = () => (
    <footer className="bg-slate-900/80 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-slate-400">&copy; {new Date().getFullYear()} VizPDF. All rights reserved.</p>
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">About</a>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Contact</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
