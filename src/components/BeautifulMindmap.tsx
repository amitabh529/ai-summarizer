import { useState, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// PDF generation function (using browser's built-in functionality)
const downloadMindmapAsPDF = async (containerRef: React.RefObject<HTMLDivElement | null>, filename: string = 'mindmap') => {
  try {
    if (!containerRef.current) {
      alert('Mindmap not ready for download. Please try again.');
      return;
    }

    // Get the SVG content
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) {
      alert('Mindmap visualization not found.');
      return;
    }

    // Clone and prepare SVG for high-quality export
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Set high-resolution dimensions for better PDF quality
    const highResWidth = 2800; // 2x resolution for crisp output
    const highResHeight = 2000;
    svgClone.setAttribute('width', highResWidth.toString());
    svgClone.setAttribute('height', highResHeight.toString());
    svgClone.setAttribute('viewBox', `0 0 ${highResWidth} ${highResHeight}`);
    
    // Ensure all text elements have proper fonts and sizing
    const textElements = svgClone.querySelectorAll('text');
    textElements.forEach(text => {
      text.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
      const currentSize = text.getAttribute('font-size') || '12';
      text.setAttribute('font-size', (parseInt(currentSize) * 1.5).toString()); // Scale up text for clarity
    });

    // Add title and timestamp to the mindmap
    const titleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleText.setAttribute('x', '50');
    titleText.setAttribute('y', '50');
    titleText.setAttribute('font-size', '36');
    titleText.setAttribute('font-weight', 'bold');
    titleText.setAttribute('fill', '#ffffff');
    titleText.textContent = 'Document Mindmap Analysis';
    
    const timestampText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    timestampText.setAttribute('x', '50');
    timestampText.setAttribute('y', '85');
    timestampText.setAttribute('font-size', '18');
    timestampText.setAttribute('fill', '#94a3b8');
    timestampText.textContent = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    
    titleGroup.appendChild(titleText);
    titleGroup.appendChild(timestampText);
    svgClone.insertBefore(titleGroup, svgClone.firstChild);

    // Create a comprehensive print window
    const printWindow = window.open('', '_blank', 'width=1400,height=1000');
    if (!printWindow) {
      alert('Popup blocked. Please allow popups and try again.');
      return;
    }

    // Create the enhanced print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename} - Document Mindmap</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 15px; 
              background: linear-gradient(135deg, #1e293b, #0f172a);
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
            }
            .header {
              text-align: center;
              color: white;
              margin-bottom: 20px;
              padding: 20px;
              background: rgba(0,0,0,0.3);
              border-radius: 10px;
              width: 100%;
              max-width: 800px;
            }
            .mindmap-container {
              background: linear-gradient(135deg, #1e293b, #0f172a);
              border-radius: 15px;
              padding: 20px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
              border: 2px solid #475569;
              max-width: 95%;
              overflow: hidden;
            }
            svg { 
              max-width: 100%; 
              height: auto; 
              display: block;
              border-radius: 8px;
            }
            @media print {
              body { 
                background: white !important; 
                color: black !important;
              }
              .header { 
                background: #f8fafc !important; 
                color: black !important; 
                border: 2px solid #cbd5e1;
              }
              .mindmap-container { 
                background: white !important; 
                border: 3px solid #334155 !important;
                box-shadow: none !important;
              }
              svg { 
                background: white !important; 
              }
            }
            @page {
              size: A3 landscape;
              margin: 12mm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0 0 10px 0; font-size: 28px;">Document Analysis Mindmap</h1>
            <p style="margin: 0; opacity: 0.8; font-size: 16px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          <div class="mindmap-container">
            ${svgClone.outerHTML}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      
      // Optional: Close window after a delay (user can choose to keep it open)
      setTimeout(() => {
        if (confirm('PDF generation complete! Close preview window?')) {
          printWindow.close();
        }
      }, 2000);
    }, 1000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again or check your browser settings.');
  }
};

// Types
interface Subheading {
  title: string;
  summary: string;
}

interface DocumentSection {
  heading: string;
  subheadings: Subheading[];
}

interface MindmapProps {
  isOpen: boolean;
  onClose: () => void;
  data?: DocumentSection[];
}

// Sample data - Java Servlet content from API response
const defaultDocument: DocumentSection[] = [
  {
    heading: 'What is a Servlet?',
    subheadings: [
      {
        title: 'Definition',
        summary: 'A Servlet is a Java class used to handle requests and responses in a web application. It\'s a server-side technology that runs on a Java-enabled web server (like Apache Tomcat) and helps build dynamic web applications.',
      },
      {
        title: 'Platform',
        summary: 'Servlets are part of the Java EE (Jakarta EE) platform and extend the capabilities of servers by handling HTTP requests (like form submissions, URL parameters, etc.).',
      },
    ],
  },
  {
    heading: 'Key Features',
    subheadings: [
      {
        title: 'Container-based',
        summary: 'Runs inside a Servlet Container (e.g., Tomcat).',
      },
      {
        title: 'HTTP Processing',
        summary: 'Processes HTTP requests/responses.',
      },
      {
        title: 'Platform Independence',
        summary: 'Platform-independent (Java-based).',
      },
      {
        title: 'Frontend Integration',
        summary: 'Works closely with HTML/JS/CSS frontends.',
      },
    ],
  },
  {
    heading: 'Servlet Lifecycle',
    subheadings: [
      {
        title: 'Initialization (init())',
        summary: 'Called once when the servlet is first loaded into memory. Used for initial setup (e.g., opening DB connections, reading config).',
      },
      {
        title: 'Request Handling (service())',
        summary: 'Called every time a client sends a request. Delegates to doGet(), doPost(), etc., depending on the HTTP method.',
      },
      {
        title: 'Destruction (destroy())',
        summary: 'Called once before the servlet is removed from memory. Used to clean up resources (e.g., close DB connections).',
      },
    ],
  },
  {
    heading: 'TOMCAT APACHE SERVER',
    subheadings: [
      {
        title: 'Standalone Tomcat',
        summary: 'Tomcat installed separately on your computer. You place your .war file in the webapps folder and start the Tomcat server manually.',
      },
      {
        title: 'Embedded Tomcat',
        summary: 'Tomcat is included inside your Java application using tools like Maven or Gradle. When you run your app (usually a .jar file), it automatically starts Tomcat.',
      },
    ],
  },
];

// Dark, high-contrast colour palette
const colors = [
  { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#1d4ed8' }, // Deep Blue
  { primary: '#065f46', secondary: '#10b981', accent: '#047857' }, // Deep Green
  { primary: '#92400e', secondary: '#f59e0b', accent: '#b45309' }, // Deep Yellow/Orange
  { primary: '#991b1b', secondary: '#ef4444', accent: '#b91c1c' }, // Deep Red
  { primary: '#5b21b6', secondary: '#8b5cf6', accent: '#6d28d9' }, // Deep Purple
  { primary: '#155e75', secondary: '#06b6d4', accent: '#0e7490' }, // Deep Cyan
];

interface NodePosition {
  x: number;
  y: number;
  angle: number;
}

const getRadius = (text: string, baseRadius: number, factor: number) => {
  return baseRadius + text.length * factor;
};

// Connection line
const ConnectionLine = memo(({ from, to, color, opacity = 0.6, markerId }: {
  from: NodePosition;
  to: NodePosition;
  color: string;
  opacity?: number;
  markerId: string;
}) => (
  <motion.line
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity }}
    transition={{ duration: 0.8, delay: 0.2 }}
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    stroke={color}
    strokeWidth="3.5"
    strokeDasharray="6,6"
    markerEnd={`url(#${markerId})`}
    className="drop-shadow-sm"
  />
));

const CentralNode = memo(({ position }: { position: NodePosition }) => {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="cursor-pointer"
    >
      {/* Outer glow effect */}
      <circle
        cx={position.x}
        cy={position.y}
        r="65"
        fill="rgba(14, 165, 233, 0.2)"
        stroke="rgba(14, 165, 233, 0.4)"
        strokeWidth="2"
        className="drop-shadow-2xl"
      />
      {/* Main circle - increased size */}
      <circle
        cx={position.x}
        cy={position.y}
        r="55"
        fill="#0ea5e9"
        stroke="#0369a1"
        strokeWidth="4"
        className="drop-shadow-lg"
      />
      <text
        x={position.x}
        y={position.y - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-base font-bold fill-white pointer-events-none"
      >
        Document
      </text>
      <text
        x={position.x}
        y={position.y + 15}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm fill-slate-300 pointer-events-none"
      >
        Analysis
      </text>
    </motion.g>
  );
});

// Section node with solid fill and improved sizing
const SectionNode = memo(({ section, index, position, color, isSelected, onToggle }: {
  section: DocumentSection;
  index: number;
  position: NodePosition;
  color: any;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeId = `section-${index}`;
  const baseRadius = Math.max(35, getRadius(section.heading, 35, 0.8)); // Increased base size
  const currentRadius = isHovered || isSelected ? baseRadius * 1.15 : baseRadius;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, type: 'spring', stiffness: 80 }}
      whileHover={{ scale: 1.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onToggle(nodeId)}
      className="cursor-pointer"
    >
      {/* Glow effect for selected/hovered nodes */}
      {(isSelected || isHovered) && (
        <circle
          cx={position.x}
          cy={position.y}
          r={currentRadius + 8}
          fill={`${color.secondary}20`}
          stroke={`${color.secondary}40`}
          strokeWidth="2"
          className="drop-shadow-xl"
        />
      )}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={currentRadius}
        fill={color.primary}
        stroke={color.secondary}
        strokeWidth={isSelected ? '4' : '3'}
        className="drop-shadow-lg"
      />
      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-semibold fill-white pointer-events-none"
        style={{ fontSize: Math.min(12, currentRadius / 3) }}
      >
        {section.heading.length > 15 ? section.heading.substring(0, 15) + '...' : section.heading}
      </text>
    </motion.g>
  );
});

// Subheading node with solid fill and improved sizing
const SubheadingNode = memo(({ subheading, sectionIndex: _sectionIndex, subIndex, position, color, isVisible }: {
  subheading: Subheading;
  sectionIndex: number;
  subIndex: number;
  position: NodePosition;
  color: any;
  isVisible: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseRadius = Math.max(28, getRadius(subheading.title, 28, 0.6)); // Increased base size
  const currentRadius = isHovered ? baseRadius * 1.2 : baseRadius;

  if (!isVisible) return null;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.4, delay: subIndex * 0.1 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer"
    >
      {/* Hover glow effect */}
      {isHovered && (
        <circle
          cx={position.x}
          cy={position.y}
          r={currentRadius + 6}
          fill={`${color.accent}30`}
          stroke={`${color.accent}50`}
          strokeWidth="2"
          className="drop-shadow-lg"
        />
      )}
      <circle
        cx={position.x}
        cy={position.y}
        r={currentRadius}
        fill={color.accent}
        stroke={color.primary}
        strokeWidth="3"
        className="drop-shadow-md"
      />
      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium fill-white pointer-events-none"
        style={{ fontSize: Math.min(10, currentRadius / 2.5) }}
      >
        {subheading.title.length > 12 ? 
          subheading.title.substring(0, 12) + '...' : 
          subheading.title
        }
      </text>
    </motion.g>
  );
});

export default function BeautifulMindmap({ isOpen, onClose, data = defaultDocument }: MindmapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleNode = useCallback((nodeId: string) => {
    setSelectedNode(prev => (prev === nodeId ? null : nodeId));
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoomLevel(prev => {
      const newZoom = prev + event.deltaY * -0.001;
      return Math.max(0.5, Math.min(2, newZoom));
    });
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);
    try {
      await downloadMindmapAsPDF(containerRef, 'document-mindmap');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const dimensions = useMemo(() => {
    const baseWidth = 1600; // Increased base width for better centering
    const baseHeight = 1200; // Increased base height for better centering
    const selectedSection = data.find((_, index) => selectedNode === `section-${index}`);
    const totalSubheadings = selectedSection ? selectedSection.subheadings.length : 0;
    
    // More dynamic sizing based on content
    const dynamicWidth = selectedNode ? baseWidth + Math.max(600, totalSubheadings * 100) : baseWidth;
    const dynamicHeight = selectedNode ? 
      Math.max(baseHeight, baseHeight + totalSubheadings * 80) : 
      baseHeight + (data.length * 50); // Scale with number of sections
    
    return { width: dynamicWidth, height: dynamicHeight };
  }, [selectedNode, data]);

  const nodePositions = useMemo(() => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const positions: { [key: string]: NodePosition } = {};

    positions['center'] = { x: centerX, y: centerY, angle: 0 };

    // Increased radius for better spacing between main nodes
    const mainRadius = Math.min(dimensions.width, dimensions.height) * 0.3; // Increased from 0.25 for better centering
    const minMainRadius = 400; // Increased minimum radius for better visual centering
    const finalMainRadius = Math.max(mainRadius, minMainRadius);
    
    data.forEach((section, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * finalMainRadius;
      const y = centerY + Math.sin(angle) * finalMainRadius;
      positions[`section-${index}`] = { x, y, angle };

      // Increased subheading radius for better spacing
      const subRadius = 220; // Increased from 180
      const parentAngle = angle;
      const angleSpread = Math.PI / 6; // Increased spread for better visibility

      section.subheadings.forEach((_, subIndex) => {
        const subAngle = parentAngle + ((subIndex - (section.subheadings.length - 1) / 2) * angleSpread);
        const subX = x + Math.cos(subAngle) * subRadius;
        const subY = y + Math.sin(subAngle) * subRadius;
        positions[`sub-${index}-${subIndex}`] = { x: subX, y: subY, angle: subAngle };
      });
    });

    return positions;
  }, [dimensions, data]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full h-[95vh] overflow-hidden relative flex flex-col"
        style={{ 
          maxWidth: selectedNode ? '95vw' : '85vw',
          transition: 'max-width 0.3s ease-in-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 relative z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Document Mindmap</h2>
            <p className="text-slate-400 text-sm mt-1">Interactive visualization of document structure</p>
          </div>
          <div className="flex items-center gap-3 relative z-20">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl relative z-30 mx-auto"
              title="Download mindmap as PDF"
            >
              {isDownloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">Download PDF</span>
                </>
              )}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors relative z-30"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mindmap Canvas */}
        <div
          ref={containerRef}
          className="relative flex-grow bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-auto z-0 flex items-center justify-center"
          onWheel={handleWheel}
        >
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="block mx-auto"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>

            <motion.g
              initial={{ scale: 1 }}
              animate={{ scale: zoomLevel }}
              transition={{ duration: 0.3 }}
              drag
              dragConstraints={containerRef}
              dragElastic={0.2}
            >
              <rect width="100%" height="100%" fill="url(#grid)" />

              {data.map((section, sectionIndex) => {
                const sectionPos = nodePositions[`section-${sectionIndex}`];
                const centerPos = nodePositions.center;
                const color = colors[sectionIndex % colors.length];

                return (
                  <g key={`connections-${sectionIndex}`}>
                    <ConnectionLine
                      from={centerPos}
                      to={sectionPos}
                      color={color.primary}
                      markerId="arrowhead"
                    />
                    <AnimatePresence>
                      {selectedNode === `section-${sectionIndex}` &&
                        section.subheadings.map((_, subIndex) => {
                          const subPos = nodePositions[`sub-${sectionIndex}-${subIndex}`];
                          return (
                            <ConnectionLine
                              key={`sub-connection-${sectionIndex}-${subIndex}`}
                              from={sectionPos}
                              to={subPos}
                              color={color.accent}
                              opacity={0.8}
                              markerId="arrowhead"
                            />
                          );
                        })}
                    </AnimatePresence>
                  </g>
                );
              })}

              <CentralNode position={nodePositions.center} />

              {data.map((section, index) => (
                <SectionNode
                  key={`section-${index}`}
                  section={section}
                  index={index}
                  position={nodePositions[`section-${index}`]}
                  color={colors[index % colors.length]}
                  isSelected={selectedNode === `section-${index}`}
                  onToggle={toggleNode}
                />
              ))}

              <AnimatePresence>
                {data.map((section, sectionIndex) =>
                  section.subheadings.map((subheading, subIndex) => (
                    <SubheadingNode
                      key={`sub-${sectionIndex}-${subIndex}`}
                      subheading={subheading}
                      sectionIndex={sectionIndex}
                      subIndex={subIndex}
                      position={nodePositions[`sub-${sectionIndex}-${subIndex}`]}
                      color={colors[sectionIndex % colors.length]}
                      isVisible={selectedNode === `section-${sectionIndex}`}
                    />
                  ))
                )}
              </AnimatePresence>
            </motion.g>
          </svg>
        </div>

        {/* Instructions with zoom controls */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50 z-10">
          <h3 className="text-white font-semibold mb-2">Controls</h3>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors"
            >
              Zoom Out
            </button>
            <span className="text-xs text-slate-300 min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.2))}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors"
            >
              Zoom In
            </button>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Click sections to reveal subheadings</li>
            <li>• Hover for detailed information</li>
            <li>• Drag the map to pan around</li>
            <li>• Mouse wheel to zoom in/out</li>
            <li>• Use "Download PDF" to save the mindmap</li>
          </ul>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50 z-10">
          <h3 className="text-white font-semibold mb-2">Sections</h3>
          <div className="space-y-2">
            {data.map((section, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length].primary }}
                />
                <span className="text-xs text-slate-300">{section.heading}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
