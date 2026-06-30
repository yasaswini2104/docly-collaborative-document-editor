import { Type, Share2, ShieldCheck } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Rich Text Editing',
      description: 'Format your thoughts perfectly with support for bold, italic, lists, and beautiful headings. Focus on writing, we handle the layout.',
      icon: Type,
      items: ['Bold', 'Lists', 'Headings', 'Formatting'],
    },
    {
      title: 'Easy Sharing',
      description: 'Collaboration built from the ground up. Instantly invite teammates, manage access, and control permissions with a single click.',
      icon: Share2,
      items: ['Invite teammates', 'Shared access', 'Permissions'],
    },
    {
      title: 'Secure Storage',
      description: 'Your documents are safe with us. We ensure persistent, fast-loading, and reliable storage so you never lose your work.',
      icon: ShieldCheck,
      items: ['Persistent documents', 'Fast loading', 'Reliable storage'],
    },
  ];

  return (
    <section id="features" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need to create
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            A powerful suite of tools designed to make writing and collaborating as seamless as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-elevated p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center text-sm text-text-muted">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary-500 opacity-70"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
