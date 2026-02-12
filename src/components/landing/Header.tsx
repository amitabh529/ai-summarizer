import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';


const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-lg border-b border-slate-800 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-cyan-400">Viz</span>
              <span className="text-violet-400">PDF</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
