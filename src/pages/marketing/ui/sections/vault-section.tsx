export function VaultSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] flex flex-row items-stretch gap-12 px-6">

        {/* Left — Vault Mockup (~60%) */}
        <div className="w-full max-w-[640px] rounded-lg border border-subtle bg-surface-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-subtle">
            <button className="flex items-center gap-1.5 text-12 text-primary border border-subtle rounded px-3 py-1.5 hover:bg-layer-1 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
              </svg>
              New Folder
            </button>
            <button className="flex items-center gap-1.5 text-12 text-white bg-accent-primary rounded px-3 py-1.5 hover:bg-accent-primary-hover transition-colors font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
            <div className="ml-auto flex items-center gap-1.5 text-11 text-secondary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Name · Asc
            </div>
          </div>

          {/* File/folder grid */}
          <div className="flex-1 p-4 overflow-hidden">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-13 text-secondary mb-4">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </button>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <button className="text-primary font-medium">Backend</button>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-3 gap-3">

              {/* Folder 1 */}
              <div className="group flex flex-col rounded-xl overflow-hidden border border-subtle hover:border-subtle-1 hover:shadow-raised-100 bg-layer-1 cursor-pointer transition-all">
                <div className="flex h-28 items-center justify-center" style={{ backgroundColor: 'oklch(0.54 0.18 275 / 8%)' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="flex-1 text-13 font-medium truncate leading-none text-primary">API Docs</span>
                </div>
              </div>

              {/* Folder 2 */}
              <div className="group flex flex-col rounded-xl overflow-hidden border border-subtle hover:border-subtle-1 hover:shadow-raised-100 bg-layer-1 cursor-pointer transition-all">
                <div className="flex h-28 items-center justify-center" style={{ backgroundColor: 'oklch(0.54 0.18 275 / 8%)' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="flex-1 text-13 font-medium truncate leading-none text-primary">Screenshots</span>
                </div>
              </div>

              {/* Folder 3 */}
              <div className="group flex flex-col rounded-xl overflow-hidden border border-subtle hover:border-subtle-1 hover:shadow-raised-100 bg-layer-1 cursor-pointer transition-all">
                <div className="flex h-28 items-center justify-center" style={{ backgroundColor: 'oklch(0.54 0.18 275 / 8%)' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="flex-1 text-13 font-medium truncate leading-none text-primary">Assets</span>
                </div>
              </div>

              {/* File 1 — PDF */}
              <div className="group flex flex-col rounded-xl overflow-hidden border border-subtle hover:border-subtle-1 hover:shadow-raised-100 bg-layer-1 cursor-pointer transition-all">
                <div className="relative flex h-28 w-full items-center justify-center overflow-hidden" style={{ backgroundColor: 'oklch(0.63 0.22 20 / 10%)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ext-red-500)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ext-red-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="flex-1 text-13 font-medium truncate leading-none text-primary">api-schema.pdf</span>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-layer-2 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-1 px-3 pb-2.5 text-11 text-secondary truncate">
                  <span>Alex Kim</span><span>·</span><span>2.4 MB</span><span>·</span><span>2 days ago</span>
                </div>
              </div>

              {/* File 2 — Image (selected) */}
              <div className="group flex flex-col rounded-xl overflow-hidden border border-accent-subtle bg-accent-subtle cursor-pointer transition-all">
                <div className="relative flex h-28 w-full items-center justify-center overflow-hidden">
                  {/* Placeholder image thumbnail */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ext-violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="flex-1 text-13 font-medium truncate leading-none text-primary">hero-banner.png</span>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-layer-2 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-1 px-3 pb-2.5 text-11 text-secondary truncate">
                  <span>Sam Rivera</span><span>·</span><span>840 KB</span><span>·</span><span>1 day ago</span>
                </div>
              </div>

              {/* File 3 — ZIP */}
              <div className="group flex flex-col rounded-xl overflow-hidden border border-subtle hover:border-subtle-1 hover:shadow-raised-100 bg-layer-1 cursor-pointer transition-all">
                <div className="relative flex h-28 w-full items-center justify-center overflow-hidden" style={{ backgroundColor: 'oklch(0.78 0.22 90 / 10%)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ext-yellow-500)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="10" x2="12" y2="16" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ext-yellow-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="10" x2="12" y2="16" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                  </svg>
                  <span className="flex-1 text-13 font-medium truncate leading-none text-primary">design-assets.zip</span>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-layer-2 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-1 px-3 pb-2.5 text-11 text-secondary truncate">
                  <span>Morgan Park</span><span>·</span><span>18.2 MB</span><span>·</span><span>5 days ago</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right — Content (~40%) */}
        <div className="flex flex-col justify-center pl-4 max-w-[400px]">

          <h2 className="text-24 font-semibold font-heading text-primary tracking-tight">
            One place for every file your team creates
          </h2>

          <p className="text-14 text-secondary mt-3 leading-relaxed">
            Vault is the shared file storage for your workspace. Upload, organize, and link files directly to projects, issues, and pages — so assets are always where the work is.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              'Folder hierarchy with workspace-level storage',
              'File previews and type-aware icons',
              'Drag-and-drop upload with progress tracking',
              'Files linked to projects, issues, and pages',
              'Powered by your workspace storage quota',
              'Search across all files and content',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-tertiary mt-0.5">—</span>
                <span className="text-14 text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-13 text-secondary mt-6 italic">
            Vault is not a separate drive — it's part of your workspace, connected to everything your team builds.
          </p>

        </div>

      </div>
    </section>
  );
}
