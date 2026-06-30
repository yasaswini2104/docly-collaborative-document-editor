import { FilePlus, Edit3, Send } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      title: '1. Create',
      description: 'Start a new document instantly from your clean, organized dashboard.',
      icon: FilePlus,
    },
    {
      title: '2. Edit',
      description: 'Write distraction-free using our rich text editor that gets out of your way.',
      icon: Edit3,
    },
    {
      title: '3. Share',
      description: 'Invite collaborators and work together in real-time with instant sync.',
      icon: Send,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface-elevated/30">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            A frictionless workflow designed to keep you in the zone.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-surface-border -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-surface-elevated border-2 border-primary-500 flex items-center justify-center mb-6 shadow-sm z-10">
                    <Icon className="h-7 w-7 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3 bg-surface px-4 py-1 rounded-full md:bg-transparent md:p-0">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
