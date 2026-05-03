export function WhiteboardSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] flex flex-row items-stretch gap-12 px-6">

        {/* Left — Whiteboard Canvas Mockup (~60%) */}
        <div className="w-full max-w-[640px] rounded-lg border border-subtle bg-surface-1 flex flex-col overflow-hidden">

          {/* Canvas area — Excalidraw dark theme with dot grid */}
          <div className="relative w-full h-[420px] overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>

            {/* Dot grid background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top-right collaborator strip */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#7c3aed', border: '2px solid white' }}>
                <span className="text-11 font-semibold text-white">AK</span>
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 -ml-1" style={{ backgroundColor: '#4ecdc4', border: '2px solid white' }}>
                <span className="text-11 font-semibold text-white">SR</span>
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 -ml-1" style={{ backgroundColor: '#f59e0b', border: '2px solid white' }}>
                <span className="text-11 font-semibold text-white">MP</span>
              </div>
            </div>

            {/* Left toolbar strip — Excalidraw-style */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-0.5">
              {[
                { icon: '↖', selected: true, label: 'Select' },
                { icon: '□', selected: false, label: 'Rectangle' },
                { icon: '◇', selected: false, label: 'Ellipse' },
                { icon: '→', selected: false, label: 'Arrow' },
                { icon: 'T', selected: false, label: 'Text' },
                { icon: '✎', selected: false, label: 'Draw' },
              ].map((tool) => (
                <div
                  key={tool.label}
                  className="w-9 h-9 rounded flex items-center justify-center text-12 text-white cursor-pointer transition-colors"
                  style={{
                    backgroundColor: tool.selected ? 'rgba(255,255,255,0.15)' : 'transparent',
                    border: tool.selected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  }}
                  title={tool.label}
                >
                  {tool.icon}
                </div>
              ))}
            </div>

            {/* Shape 1 — Frontend rectangle */}
            <div
              className="absolute rounded-md flex flex-col items-start px-3 py-2"
              style={{
                left: 72,
                top: 48,
                width: 120,
                minHeight: 60,
                backgroundColor: '#2a2a40',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            >
              <span className="text-12 font-semibold text-white">Frontend</span>
              <span className="text-10 text-white opacity-60 mt-0.5">React SPA</span>
              {/* Resize handle bottom-right */}
              <div
                className="absolute w-2 h-2 rounded-sm bg-white"
                style={{ right: -1, bottom: -1 }}
              />
            </div>

            {/* Arrow 1: Frontend → Backend */}
            <svg
              className="absolute pointer-events-none"
              style={{ left: 72, top: 48, width: 220, height: 120 }}
              viewBox="0 0 220 120"
              fill="none"
            >
              {/* Arrow line from Frontend to Backend */}
              <line x1="120" y1="30" x2="160" y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <path d="M156 26 L162 30 L156 34" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
              {/* Arrow line down to backend */}
              <line x1="220" y1="30" x2="220" y2="90" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <path d="M216 86 L220 92 L224 86" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Shape 2 — Backend rectangle (selected) */}
            <div
              className="absolute rounded-md flex flex-col items-start px-3 py-2"
              style={{
                right: 48,
                top: 48,
                width: 130,
                minHeight: 60,
                backgroundColor: '#2a2a40',
                border: '2px solid rgba(124, 58, 237, 0.9)',
              }}
            >
              {/* Selection label */}
              <div
                className="absolute text-9 font-semibold px-1.5 py-0.5 rounded-sm mb-0.5"
                style={{ top: -20, left: 0, backgroundColor: 'rgba(124, 58, 237, 0.9)', color: 'white' }}
              >
                Backend
              </div>
              <span className="text-12 font-semibold text-white">Backend</span>
              <span className="text-10 text-white opacity-60 mt-0.5">API Services</span>
              {/* Resize handles */}
              <div className="absolute w-2 h-2 rounded-sm bg-white" style={{ left: -1, top: -1 }} />
              <div className="absolute w-2 h-2 rounded-sm bg-white" style={{ right: -1, top: -1 }} />
              <div className="absolute w-2 h-2 rounded-sm bg-white" style={{ left: -1, bottom: -1 }} />
              <div className="absolute w-2 h-2 rounded-sm bg-white" style={{ right: -1, bottom: -1 }} />
            </div>

            {/* Shape 3 — Database cylinder */}
            <div
              className="absolute rounded-md flex flex-col items-center px-3 py-2"
              style={{
                right: 80,
                top: 180,
                width: 100,
                minHeight: 50,
                backgroundColor: '#2a2a40',
                border: '1.5px solid rgba(255,255,255,0.25)',
              }}
            >
              <span className="text-12 font-semibold text-white">Database</span>
              <span className="text-10 text-white opacity-60 mt-0.5">PostgreSQL</span>
            </div>

            {/* Arrow: Backend → Database */}
            <svg
              className="absolute pointer-events-none"
              style={{ right: 48, top: 108, width: 132, height: 72 }}
              viewBox="0 0 132 72"
              fill="none"
            >
              <line x1="66" y1="0" x2="66" y2="48" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <path d="M62 44 L66 50 L70 44" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Shape 4 — Sticky note */}
            <div
              className="absolute rounded flex flex-col px-2.5 py-2"
              style={{
                left: 72,
                top: 170,
                width: 100,
                minHeight: 56,
                backgroundColor: '#fef08a',
                border: '1px solid rgba(0,0,0,0.15)',
                transform: 'rotate(-1deg)',
              }}
            >
              <span className="text-11 font-medium text-gray-800 leading-snug">Note: add auth middleware to all routes</span>
            </div>

            {/* Shape 5 — Text box with label */}
            <div
              className="absolute flex flex-col px-2 py-1"
              style={{
                left: 72,
                top: 270,
                minWidth: 80,
              }}
            >
              <span className="text-11 text-white opacity-70 italic">Architecture v3.0</span>
            </div>

            {/* Remote cursor 1 — "Alex editing" */}
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: 300,
                top: 140,
                transform: 'translate(-2px, -2px)',
              }}
            >
              {/* Cursor SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M5 3l14 9-6 1-3 5-5-15z" fill="#FF6B6B" stroke="white" strokeWidth="1" />
              </svg>
              {/* Name label */}
              <div
                className="mt-1 whitespace-nowrap rounded px-2 py-1 text-11 text-white"
                style={{ backgroundColor: '#FF6B6B' }}
              >
                Alex
              </div>
            </div>

            {/* Remote cursor 2 — "Sam" */}
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: 420,
                top: 200,
                transform: 'translate(-2px, -2px)',
                opacity: 0.7,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M5 3l14 9-6 1-3 5-5-15z" fill="#4ECDC4" stroke="white" strokeWidth="1" />
              </svg>
              <div
                className="mt-1 whitespace-nowrap rounded px-2 py-1 text-11 text-white"
                style={{ backgroundColor: '#4ECDC4' }}
              >
                Sam
              </div>
            </div>

          </div>

          {/* Bottom bar — Excalidraw-style status */}
          <div className="flex items-center justify-between px-4 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <span className="text-11 text-secondary">Zoom: 100%</span>
              <span className="text-11 text-secondary">3 users</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success-primary inline-block" />
              <span className="text-11 text-secondary">Live</span>
            </div>
          </div>

        </div>

        {/* Right — Content (~40%) */}
        <div className="flex flex-col justify-center pl-4 max-w-[400px]">

          <h2 className="text-24 font-semibold font-heading text-primary tracking-tight">
            Visual thinking, together in real time
          </h2>

          <p className="text-14 text-secondary mt-3 leading-relaxed">
            Whiteboards are a shared space for diagrams, brainstorming, and early-stage thinking. Draw, connect, and ideate — with your whole team, in real time, with full history preserved.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              'Excalidraw-powered collaborative canvas',
              'Real-time cursor presence for all collaborators',
              'Shapes, arrows, and freehand drawing',
              'Sticky notes for quick capture',
              'Auto-saved with version history',
              'Embeddable in any page or project',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-tertiary mt-0.5">—</span>
                <span className="text-14 text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-13 text-secondary mt-6 italic">
            Whiteboards are not just for brainstorming — they connect directly to issues, pages, and your project structure.
          </p>

        </div>

      </div>
    </section>
  );
}
