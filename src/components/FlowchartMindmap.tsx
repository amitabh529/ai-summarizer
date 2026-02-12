import { motion, AnimatePresence } from 'framer-motion'

// Types for mindmap data
interface MindmapNode {
  id: string
  title: string
  summary: string
  level: number
  children: MindmapNode[]
  position: { x: number; y: number }
  color: string
}

interface MindmapProps {
  isOpen: boolean
  onClose: () => void
  data?: any // API response data from document analysis
}

// Function to convert API response data to mindmap format
const convertToMindmapData = (apiData: any): MindmapNode => {
  if (!apiData) {
    return sampleMindmapData; // Fallback to sample data
  }

  // Create root node from API data
  const rootNode: MindmapNode = {
    id: 'root',
    title: apiData.title || 'Document Analysis',
    summary: apiData.summary || 'Analyzed document content',
    level: 0,
    position: { x: 500, y: 350 },
    color: '#0ea5e9',
    children: []
  };

  // Convert headings to mindmap nodes
  if (apiData.headings && Array.isArray(apiData.headings)) {
    rootNode.children = apiData.headings.map((heading: any, index: number) => {
      const angle = (index * 360) / apiData.headings.length;
      const radius = 250;
      const x = 500 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 350 + radius * Math.sin((angle * Math.PI) / 180);

      const headingNode: MindmapNode = {
        id: `heading-${index}`,
        title: heading.title || `Heading ${index + 1}`,
        summary: heading.content ? heading.content.substring(0, 100) + '...' : 'No content available',
        level: 1,
        position: { x, y },
        color: '#7c3aed',
        children: []
      };

      // Convert subheadings to child nodes
      if (heading.subheadings && Array.isArray(heading.subheadings)) {
        headingNode.children = heading.subheadings.map((subheading: any, subIndex: number) => {
          const subAngle = angle + (subIndex - heading.subheadings.length / 2) * 30;
          const subRadius = 120;
          const subX = x + subRadius * Math.cos((subAngle * Math.PI) / 180);
          const subY = y + subRadius * Math.sin((subAngle * Math.PI) / 180);

          return {
            id: `subheading-${index}-${subIndex}`,
            title: subheading.title || `Subheading ${subIndex + 1}`,
            summary: subheading.content ? subheading.content.substring(0, 80) + '...' : 'No content',
            level: 2,
            position: { x: subX, y: subY },
            color: '#06b6d4',
            children: []
          };
        });
      }

      return headingNode;
    });
  }

  // Add keywords as additional nodes if available
  if (apiData.keywords && Array.isArray(apiData.keywords) && apiData.keywords.length > 0) {
    const keywordsNode: MindmapNode = {
      id: 'keywords',
      title: 'Keywords',
      summary: `${apiData.keywords.length} key terms identified`,
      level: 1,
      position: { x: 500, y: 550 },
      color: '#f59e0b',
      children: apiData.keywords.slice(0, 8).map((keyword: string, index: number) => {
        const angle = (index * 360) / Math.min(apiData.keywords.length, 8);
        const radius = 80;
        const x = 500 + radius * Math.cos((angle * Math.PI) / 180);
        const y = 550 + radius * Math.sin((angle * Math.PI) / 180);

        return {
          id: `keyword-${index}`,
          title: keyword,
          summary: 'Key term',
          level: 2,
          position: { x, y },
          color: '#10b981',
          children: []
        };
      })
    };

    rootNode.children.push(keywordsNode);
  }

  return rootNode;
};

// Sample mindmap data structure - Java Servlet content
const sampleMindmapData: MindmapNode = {
  id: 'root',
  title: 'Java Servlets',
  summary: 'Server-side Java technology for web applications',
  level: 0,
  position: { x: 500, y: 350 },
  color: '#0ea5e9',
  children: [
    {
      id: 'definition',
      title: 'What is a Servlet?',
      summary: 'Java class for handling HTTP requests and responses',
      level: 1,
      position: { x: 250, y: 200 },
      color: '#7c3aed',
      children: [
        {
          id: 'platform',
          title: 'Java EE Platform',
          summary: 'Part of Jakarta EE, extends server capabilities',
          level: 2,
          position: { x: 150, y: 120 },
          color: '#06b6d4',
          children: []
        },
        {
          id: 'server-side',
          title: 'Server-side Technology',
          summary: 'Runs on Java-enabled web servers like Tomcat',
          level: 2,
          position: { x: 120, y: 280 },
          color: '#06b6d4',
          children: []
        }
      ]
    },
    {
      id: 'lifecycle',
      title: 'Servlet Lifecycle',
      summary: 'Three main phases: init, service, destroy',
      level: 1,
      position: { x: 750, y: 200 },
      color: '#7c3aed',
      children: [
        {
          id: 'init',
          title: 'Initialization (init())',
          summary: 'Called once when servlet is loaded into memory',
          level: 2,
          position: { x: 850, y: 120 },
          color: '#06b6d4',
          children: []
        },
        {
          id: 'service',
          title: 'Request Handling (service())',
          summary: 'Called for every client request, delegates to doGet/doPost',
          level: 2,
          position: { x: 880, y: 200 },
          color: '#06b6d4',
          children: []
        },
        {
          id: 'destroy',
          title: 'Destruction (destroy())',
          summary: 'Called before servlet removal, cleans up resources',
          level: 2,
          position: { x: 850, y: 280 },
          color: '#06b6d4',
          children: []
        }
      ]
    },
    {
      id: 'tomcat',
      title: 'Apache Tomcat',
      summary: 'Runtime environment for Java servlets',
      level: 1,
      position: { x: 500, y: 500 },
      color: '#7c3aed',
      children: [
        {
          id: 'standalone',
          title: 'Standalone Tomcat',
          summary: 'Separately installed server, deploy WAR files to webapps folder',
          level: 2,
          position: { x: 380, y: 580 },
          color: '#06b6d4',
          children: []
        },
        {
          id: 'embedded',
          title: 'Embedded Tomcat',
          summary: 'Included in application via Maven/Gradle, starts automatically',
          level: 2,
          position: { x: 620, y: 580 },
          color: '#06b6d4',
          children: []
        }
      ]
    },
    {
      id: 'features',
      title: 'Key Features',
      summary: 'Platform-independent, HTTP processing, container-based',
      level: 1,
      position: { x: 250, y: 500 },
      color: '#7c3aed',
      children: [
        {
          id: 'container',
          title: 'Servlet Container',
          summary: 'Runs inside containers like Tomcat',
          level: 2,
          position: { x: 150, y: 420 },
          color: '#06b6d4',
          children: []
        },
        {
          id: 'http',
          title: 'HTTP Processing',
          summary: 'Handles HTTP requests and responses efficiently',
          level: 2,
          position: { x: 120, y: 580 },
          color: '#06b6d4',
          children: []
        }
      ]
    }
  ]
}

// Mindmap Component
function MindmapView({ data }: { data: MindmapNode }) {
  const renderNode = (node: MindmapNode, index: number = 0) => {
    const nodeSize = node.level === 0 ? 120 : node.level === 1 ? 100 : 80
    const fontSize = node.level === 0 ? 'text-sm' : node.level === 1 ? 'text-xs' : 'text-xs'
    
    return (
      <motion.div
        key={node.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.3 }}
        className="absolute group cursor-pointer"
        style={{
          left: node.position.x - nodeSize/2,
          top: node.position.y - nodeSize/2,
          width: nodeSize,
          height: nodeSize
        }}
      >
        <div 
          className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${node.color}, ${node.color}dd)`,
            border: `3px solid ${node.color}44`
          }}
        >
          <div className="text-center p-2">
            <div className={`${fontSize} font-bold mb-1`}>{node.title}</div>
            <div className="text-xs opacity-90 leading-tight">{node.summary}</div>
          </div>
          
          {/* Pulsing animation for root node */}
          {node.level === 0 && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>
    )
  }

  const renderConnections = (node: MindmapNode) => {
    return node.children.map(child => (
      <motion.line
        key={`${node.id}-${child.id}`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        x1={node.position.x}
        y1={node.position.y}
        x2={child.position.x}
        y2={child.position.y}
        stroke={child.color}
        strokeWidth="3"
        opacity={0.7}
      />
    ))
  }

  const getAllNodes = (node: MindmapNode): MindmapNode[] => {
    return [node, ...node.children.flatMap(child => getAllNodes(child))]
  }

  const getAllConnections = (node: MindmapNode): React.ReactElement[] => {
    return [
      ...renderConnections(node),
      ...node.children.flatMap(child => getAllConnections(child))
    ]
  }

  const allNodes = getAllNodes(data)

  return (
    <div className="relative w-full h-[800px] bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <svg className="w-full h-full absolute inset-0">
        {getAllConnections(data)}
      </svg>
      
      {allNodes.map((node, index) => renderNode(node, index))}
    </div>
  )
}

// Main Mindmap Component
export default function Mindmap({ isOpen, onClose, data }: MindmapProps) {
  if (!isOpen) return null

  // Convert API data to mindmap format
  const mindmapData = convertToMindmapData(data);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-b from-[#0b1220]/95 to-[#020305]/95 backdrop-blur-lg border border-[#0ea5e9]/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9]/20 to-[#7c3aed]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Concept Mindmap</h2>
                <p className="text-slate-400">Interactive visualization of topics and relationships</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Concept Mindmap</h3>
              <p className="text-slate-400">Hierarchical visualization of topics and relationships</p>
            </div>
            <MindmapView data={mindmapData} />
          </div>

          {/* Footer with instructions */}
          <div className="border-t border-slate-700/50 p-4 bg-slate-800/30">
            <div className="text-sm text-slate-400 text-center">
              <strong className="text-slate-300">Backend JSON Format:</strong> 
              {" Provide hierarchical object with title, summary, level, children array, position (x,y), and color hex code"}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
