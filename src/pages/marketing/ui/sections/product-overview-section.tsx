function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-layer-1 hover:bg-layer-1-hover rounded-lg border border-subtle p-6">
      <h3 className="text-16 font-semibold text-primary tracking-tight">{title}</h3>
      <p className="text-13 text-secondary mt-1.5 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const features = [
  { title: 'Chat', description: 'Channels, threads, mentions, and real-time conversations' },
  { title: 'Issues', description: 'Structured tasks with statuses, labels, and assignments' },
  { title: 'Pages', description: 'Collaborative documents with real-time editing' },
  { title: 'Whiteboard', description: 'Shared canvas for visual planning and diagrams' },
  { title: 'Vault', description: 'Files and folders organized inside your workspace' },
  { title: 'Workspaces', description: 'Shared environments with members and projects' },
  { title: 'References', description: 'Every issue, page, file, and person is referenceable from anywhere' },
  { title: 'Permissions', description: 'Role-based and attribute-based access control across all modules' },
  { title: 'Collaboration', description: 'Live editing, presence indicators, and cursors across every surface' },
];

export function ProductOverviewSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <h2 className="text-32 font-heading font-bold tracking-tight text-primary">
            Not another stack of tools
          </h2>
          <p className="text-16 text-secondary mt-4 leading-relaxed">
            Chat, issues, documents, whiteboards, and files connected inside a single workspace.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Closing line */}
        <p className="text-center text-14 text-secondary mt-10">
          Everything works together under a shared system not as separate tools.
        </p>

      </div>
    </section>
  );
}
