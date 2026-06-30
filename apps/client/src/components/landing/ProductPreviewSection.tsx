import { Users, FileText, Search, Settings, MoreHorizontal, LayoutDashboard, ChevronRight } from 'lucide-react';

export function ProductPreviewSection() {
  return (
    <section id="preview" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            A beautiful, focused workspace
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Everything you need is just a click away. No clutter, no distractions.
          </p>
        </div>

        {/* Larger Dashboard/Editor Mockup */}
        <div className="mx-auto w-full rounded-2xl border border-surface-border bg-surface-elevated shadow-2xl overflow-hidden ring-1 ring-surface-border/50 max-w-6xl animate-fade-in-up">
          <div className="flex h-auto md:h-[600px] flex-col md:flex-row">
            
            {/* Sidebar Mockup */}
            <div className="hidden md:flex w-64 flex-col border-r border-surface-border bg-surface">
              <div className="flex h-14 items-center px-4 border-b border-surface-border">
                <span className="bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-lg font-bold text-transparent">
                  Docly
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <div className="flex items-center gap-3 rounded-lg bg-surface-elevated px-3 py-2 text-sm font-medium text-text-primary">
                  <LayoutDashboard className="h-4 w-4 text-primary-500" />
                  Dashboard
                </div>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary">
                  <FileText className="h-4 w-4" />
                  Owned Documents
                </div>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary">
                  <Users className="h-4 w-4" />
                  Shared Documents
                </div>
              </div>
              <div className="border-t border-surface-border p-4">
                <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </div>
            </div>

            {/* Main Area Mockup */}
            <div className="flex flex-1 flex-col bg-surface-elevated/50">
              {/* Top Bar Mockup */}
              <div className="flex h-14 items-center justify-between border-b border-surface-border px-6">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                  <span className="text-text-primary font-medium">Recent Activity</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <div className="h-8 w-48 rounded-md border border-surface-border bg-surface px-8 py-1 text-sm text-text-muted flex items-center">
                      Search...
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-surface">
                    A
                  </div>
                </div>
              </div>

              {/* Content Area Mockup */}
              <div className="flex-1 p-6 md:p-10">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-text-primary">Recent Documents</h3>
                  <div className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
                    + New Document
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary-500/10 p-2 text-primary-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">Q3 Roadmap</h4>
                          <span className="inline-block rounded-full bg-surface-elevated border border-surface-border px-2 py-0.5 text-[10px] font-medium text-text-secondary mt-1">
                            Owned
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-text-muted" />
                    </div>
                    <div className="text-xs text-text-muted">Updated 2 hours ago</div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-success/10 p-2 text-success">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">Marketing Draft</h4>
                          <span className="inline-block rounded-full bg-surface-elevated border border-surface-border px-2 py-0.5 text-[10px] font-medium text-text-secondary mt-1">
                            Shared
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-text-muted" />
                    </div>
                    <div className="text-xs text-text-muted flex items-center justify-between">
                      <span>Updated 5 hours ago</span>
                      <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center text-[10px] text-white">Y</div>
                    </div>
                  </div>

                  {/* Card 3 (Empty Slot) */}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface/50 p-5 text-center cursor-not-allowed hidden lg:flex">
                    <FileText className="h-6 w-6 text-text-muted mb-2" />
                    <span className="text-sm text-text-secondary">Create new</span>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-text-primary mb-4">Shared with me</h3>
                  <div className="h-24 w-full rounded-xl border border-surface-border bg-surface flex items-center px-6 gap-4">
                     <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                        <Users className="h-5 w-5" />
                     </div>
                     <div className="flex-1">
                       <h4 className="text-sm font-semibold text-text-primary">Project Alpha Notes</h4>
                       <p className="text-xs text-text-secondary mt-0.5">Yashu shared this with you 2 days ago.</p>
                     </div>
                     <div className="rounded border border-surface-border px-3 py-1 text-xs font-medium text-text-secondary">
                       Open
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
