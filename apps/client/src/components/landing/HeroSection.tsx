import { Link } from 'react-router';
import { AlignLeft, Bold, Italic, List, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center z-10">
        {/* Headlines */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl lg:text-7xl animate-fade-in-up">
          Write. Collaborate. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Stay Organized.</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-text-secondary animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          The modern collaborative document editor for teams that move fast. Create beautifully formatted documents, share instantly, and work together in real-time.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Link
            to="/signup"
            className="w-full sm:w-auto rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-primary-500 hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto rounded-lg border border-surface-border bg-surface-elevated px-8 py-3.5 text-base font-semibold text-text-primary shadow-sm hover:bg-surface-hover hover:-translate-y-0.5 transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Editor Mockup */}
        <div className="mt-16 sm:mt-20 mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="rounded-xl border border-surface-border bg-surface-elevated shadow-2xl overflow-hidden ring-1 ring-surface-border/50 text-left">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-surface-border bg-surface/50 px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-danger/80"></div>
                  <div className="h-3 w-3 rounded-full bg-warning/80"></div>
                  <div className="h-3 w-3 rounded-full bg-success/80"></div>
                </div>
                <div className="hidden sm:block h-4 w-px bg-surface-border"></div>
                <div className="hidden sm:flex items-center gap-2 text-text-muted">
                  <Bold className="h-4 w-4 hover:text-text-primary cursor-pointer transition-colors" />
                  <Italic className="h-4 w-4 hover:text-text-primary cursor-pointer transition-colors" />
                  <AlignLeft className="h-4 w-4 text-primary-500" />
                  <List className="h-4 w-4 hover:text-text-primary cursor-pointer transition-colors" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-elevated bg-primary-500 text-xs font-medium text-white">Y</div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-elevated bg-success text-xs font-medium text-white">A</div>
                </div>
                <button className="hidden sm:flex items-center gap-1.5 rounded bg-primary-500/10 px-2 py-1 text-xs font-medium text-primary-500">
                  <Users className="h-3 w-3" /> Share
                </button>
              </div>
            </div>
            
            {/* Editor Content Area */}
            <div className="bg-surface p-6 sm:p-12 h-[300px] sm:h-[400px] overflow-hidden">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-bold text-text-primary mb-4 sm:mb-6">Product Requirements</h1>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4">
                  Docly is designed to bridge the gap between heavy word processors and simple note-taking apps. 
                  It provides a <span className="bg-primary-500/20 text-primary-500 font-medium px-1 rounded">frictionless editing experience</span> with powerful collaboration tools natively built in.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-1 bg-primary-500 rounded-full"></div>
                  <p className="text-sm sm:text-base text-text-primary font-medium">Phase 1: Real-time sync engine</p>
                </div>
                <div className="h-4 w-3/4 bg-surface-border/50 rounded animate-pulse mb-3"></div>
                <div className="h-4 w-1/2 bg-surface-border/50 rounded animate-pulse mb-3"></div>
                <div className="h-4 w-5/6 bg-surface-border/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
