import { ComingSoonWrapper } from '@/shared/ui/primitives/coming-soon-wrapper'

export function ActivityFeedStubs() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-12">
      {/* Active Projects Stub */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-18 text-primary">Active Projects</h2>
        </div>
        <ComingSoonWrapper label="Coming Soon">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="p-5 bg-layer-1 border border-subtle rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-primary">Website Redesign</h4>
                  <span className="text-10 text-tertiary uppercase font-bold tracking-widest">Nova Design Studio</span>
                </div>
                <div className="size-2 rounded-full bg-success-primary shadow-[0_0_8px_var(--ext-green-500)]"></div>
              </div>
              <div className="pt-4 border-t border-subtle flex justify-between items-center text-11">
                <span className="text-secondary">Updated 14m ago</span>
                <span className="font-medium text-primary">84% complete</span>
              </div>
            </div>
            <div className="p-5 bg-layer-1 border border-subtle rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-primary">Mobile App v2.0</h4>
                  <span className="text-10 text-tertiary uppercase font-bold tracking-widest">Skyline Arch</span>
                </div>
                <div className="size-2 rounded-full bg-warning-primary shadow-[0_0_8px_var(--ext-yellow-500)]"></div>
              </div>
              <div className="pt-4 border-t border-subtle flex justify-between items-center text-11">
                <span className="text-secondary">Updated 1h ago</span>
                <span className="font-medium text-primary">12% complete</span>
              </div>
            </div>
          </div>
        </ComingSoonWrapper>
      </div>

      {/* Activity Feed Stub */}
      <div className="space-y-4">
        <h2 className="font-semibold text-18 text-primary">Activity Feed</h2>
        <ComingSoonWrapper label="Coming Soon" className="h-full">
          <div className="bg-layer-1 border border-subtle rounded-xl overflow-hidden divide-y divide-subtle h-full flex flex-col">
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-layer-2 shrink-0" />
              <div className="flex-1">
                <p className="text-13 leading-tight text-primary">
                  <span className="font-bold">Jimmy</span> created a new issue in <span className="text-primary font-medium">Project X</span>
                </p>
                <span className="text-10 text-tertiary mt-1 inline-block">2 minutes ago</span>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-layer-2 shrink-0" />
              <div className="flex-1">
                <p className="text-13 leading-tight text-primary">
                  <span className="font-bold">Maria</span> commented on <span className="text-primary font-medium">Dashboard Layout</span>
                </p>
                <span className="text-10 text-tertiary mt-1 inline-block">15 minutes ago</span>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-layer-2 shrink-0" />
              <div className="flex-1">
                <p className="text-13 leading-tight text-primary">
                  <span className="font-bold">Alex</span> uploaded a new file to <span className="text-primary font-medium">Marketing Assets</span>
                </p>
                <span className="text-10 text-tertiary mt-1 inline-block">2 hours ago</span>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-layer-2 shrink-0" />
              <div className="flex-1">
                <p className="text-13 leading-tight text-primary">
                  <span className="font-bold">Sarah</span> updated the status of <span className="text-primary font-medium">Q3 Roadmap</span> to <span className="font-semibold text-success-primary">Completed</span>
                </p>
                <span className="text-10 text-tertiary mt-1 inline-block">4 hours ago</span>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-layer-2 shrink-0" />
              <div className="flex-1">
                <p className="text-13 leading-tight text-primary">
                  <span className="font-bold">Jimmy</span> invited <span className="font-bold">David</span> to join <span className="text-primary font-medium">Project X</span>
                </p>
                <span className="text-10 text-tertiary mt-1 inline-block">1 day ago</span>
              </div>
            </div>
          </div>
        </ComingSoonWrapper>
      </div>
    </div>
  )
}
