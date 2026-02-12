import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

// ---------- Utilities ----------
const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
const seedFromDate = (date: Date) => date.toISOString().slice(0,10).replace(/-/g, '')
const makeWorkspace = (id: string | null = null) => {
  const now = new Date()
  const daysBack = Math.floor(Math.random()*14) // within last 2 weeks
  const date = new Date(now.getTime() - daysBack*24*60*60*1000)
  const seed = `${seedFromDate(date)}-${Math.floor(Math.random()*1000)}`
  return {
    id: id ?? Math.random().toString(36).slice(2,9),
    title: `Workspace ${Math.floor(Math.random()*900 + 100)}`,
    desc: `Notes, summaries and diagrams — created ${date.toDateString()}`,
    date: date.toISOString(),
    image: `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/360`
  }
}

// ---------- Components ----------

function Header({ onCreateWorkspace }: { onCreateWorkspace: () => void }){
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0ea5e9]/20 to-[#7c3aed]/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-[#7c3aed]/20">
          <svg className="w-6 h-6 text-[#7c3aed]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7v10a2 2 0 0 0 2 2h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="7" y="3" width="10" height="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Nebula Workspace</h1>
          <p className="text-xs text-slate-400 -mt-1">Summaries • Flowcharts • Mind Maps</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onCreateWorkspace} className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#7c3aed]/8 border border-[#7c3aed]/20 hover:scale-[1.02] active:scale-[0.99] transition-transform">
          <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shadow-[0_0_12px_rgba(14,165,233,0.35)] inline-block" />
          <span className="text-sm font-medium">New Workspace</span>
        </button>

        <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0b0f14]/60 border border-[#ffffff]/3">
          <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" strokeWidth="1.5"/></svg>
          <input className="bg-transparent outline-none text-slate-300 placeholder:text-slate-500 text-sm" placeholder="Search workspace..." />
        </div>
      </div>
    </header>
  )
}

function Sidebar(){
  const links = ['Dashboard','Workspaces','Templates','Settings']
  return (
    <aside className="w-72 hidden md:block sticky top-6 h-[80vh]">
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0b1220]/60 to-[#020305]/60 border border-[#ffffff]/4 backdrop-blur-sm h-full flex flex-col justify-between">
        <nav className="flex flex-col gap-2">
          {links.map(link => (
            <a key={link} href="#" className="px-4 py-2 rounded-lg text-slate-300 hover:bg-[#0ea5e9]/10 hover:text-[#0ea5e9] hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all">{link}</a>
          ))}
        </nav>
        <div className="text-xs text-slate-500 mt-8">Nebula Workspace &copy; 2025</div>
      </div>
    </aside>
  )
}

function WorkspaceCard({ workspace, index }: { workspace: any; index: number }){
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 120 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1220]/40 to-[#020305]/60 border border-[#ffffff]/8 backdrop-blur-sm hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(14,165,233,0.1)] transition-all duration-300"
    >
      <div className="aspect-video overflow-hidden rounded-t-xl">
        <img src={workspace.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-slate-100 group-hover:text-[#0ea5e9] transition-colors">{workspace.title}</h3>
        <p className="text-sm text-slate-400 mt-1">{workspace.desc}</p>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>{formatDate(workspace.date)}</span>
          <button className="text-[#7c3aed] hover:text-[#0ea5e9] transition-colors">Open</button>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-[#0ea5e9]/0 group-hover:ring-[#0ea5e9]/30 transition-all duration-300" />
    </motion.div>
  )
}

function FlowchartPanel(){
  const nodes = [
    { id: 'upload', label: 'Upload PDF', x: 100, y: 100 },
    { id: 'extract', label: 'Extract Text', x: 300, y: 100 },
    { id: 'summarize', label: 'Summarize', x: 500, y: 100 },
    { id: 'generate', label: 'Generate Chart', x: 700, y: 100 }
  ]
  
  const edges = [
    { from: nodes[0], to: nodes[1] },
    { from: nodes[1], to: nodes[2] },
    { from: nodes[2], to: nodes[3] }
  ]

  const nodeVariants: Variants = {
    hidden: { scale: 0.6, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 120 } }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0b1220]/40 to-[#020305]/60 border border-[#ffffff]/8 backdrop-blur-sm p-6 h-64">
      <h3 className="text-lg font-medium text-slate-100 mb-4">Processing Flow</h3>
      <svg viewBox="0 0 800 200" className="w-full h-full">
        {edges.map((edge, i) => <AnimatedEdge key={i} from={edge.from} to={edge.to} delay={i * 0.4 + 1} />)}
        {nodes.map((node, i) => (
          <motion.g 
            key={node.id} 
            initial="hidden" 
            animate="show" 
            variants={nodeVariants}
            transition={{ delay: i * 0.25 }}
          >
            <circle cx={node.x} cy={node.y} r="30" fill="url(#nodeGradient)" stroke="#0ea5e9" strokeWidth="2" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" className="text-xs fill-slate-100">{node.label}</text>
          </motion.g>
        ))}
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function AnimatedEdge({ from, to, delay }: { from: any; to: any; delay: number }){
  const path = `M ${from.x + 30} ${from.y} L ${to.x - 30} ${to.y}`
  return (
    <motion.path
      d={path}
      stroke="#0ea5e9"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay, ease: 'easeInOut' }}
      markerEnd="url(#arrowhead)"
    />
  )
}

// ---------- Main Dashboard ----------
export default function ProDashboard(){
  const navigate = useNavigate()
  const [items] = useState(() => [makeWorkspace('seed1'), makeWorkspace('seed2'), makeWorkspace('seed3')])
  
  const handleCreateWorkspace = () => {
    navigate('/dashboard/workspace')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0b0f1a] to-[#050508] text-slate-100 selection:bg-[#0ea5e9]/20">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <Header onCreateWorkspace={handleCreateWorkspace} />
        
        <div className="flex gap-6 mt-6">
          <Sidebar />
          
          <main className="flex-1 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Workspaces</h2>
                  <span className="text-sm text-slate-400">{items.length} workspaces</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, i) => (
                      <WorkspaceCard key={item.id} workspace={item} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="space-y-6">
                <FlowchartPanel />
                
                <div className="rounded-2xl bg-gradient-to-b from-[#0b1220]/40 to-[#020305]/60 border border-[#ffffff]/8 backdrop-blur-sm p-6">
                  <h3 className="text-lg font-medium text-slate-100 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Documents</span>
                      <span className="text-[#0ea5e9]">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Summaries</span>
                      <span className="text-[#7c3aed]">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Charts</span>
                      <span className="text-[#06b6d4]">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <svg width="0" height="0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
