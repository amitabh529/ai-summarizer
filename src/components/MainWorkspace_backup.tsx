import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import your mindmaps if you need them
// import Mindmap from './FlowchartMindmap'
// import BeautifulMindmap from './BeautifulMindmap'

interface Subheading {
  title: string
  content: string
  start_page: number
  start_line: number
  end_page: number
  end_line: number
  subheadings: Subheading[]
}

interface DocumentSection {
  title: string
  content: string
  start_page: number
  start_line: number
  end_page: number
  end_line: number
  subheadings: Subheading[]
}

interface DocumentData {
  headings: DocumentSection[]
  summary: string
  keywords: string[]
}

interface ChatbotPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  type: 'heading' | 'subheading'
}

const dummyDocument: DocumentData = {
  headings: [
    // … your dummy data …
  ],
  summary: '…',
  keywords: ['Servlet', 'Java', 'Apache Tomcat']
}

/* ---------------- Chatbot Popup ---------------- */
function ChatbotPopup({ isOpen, onClose, title, content, type }: ChatbotPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-b from-[#0b1220]/95 to-[#020305]/95 rounded-2xl p-6 border border-[#0ea5e9]/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">AI Assistant</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#0ea5e9]/10 rounded-lg border border-[#0ea5e9]/20">
                  <h4 className="font-medium text-[#0ea5e9] mb-2">
                    {type === 'heading' ? 'Section' : 'Subsection'}: {title}
                  </h4>
                  <p className="text-sm text-slate-300">{content}</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-lg">
                  <p className="text-sm text-slate-300 mb-3">Ask me anything:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      className="flex-1 px-3 py-2 bg-[#0b0f14]/60 border border-[#ffffff]/10 rounded-lg text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#0ea5e9]/50"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white rounded-lg text-sm">
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ---------------- Structured Data View ---------------- */
function StructuredDataView({ data }: { data: DocumentData }) {
  const [chatbotPopup, setChatbotPopup] = useState({
    isOpen: false,
    title: '',
    content: '',
    type: 'heading' as 'heading' | 'subheading'
  })
  const [expandedHeadings, setExpandedHeadings] = useState<{ [key: string]: boolean }>({})
  const [expandedSubheadings, setExpandedSubheadings] = useState<{ [key: string]: boolean }>({})
  const [showKeywords, setShowKeywords] = useState(false)

  const openChatbot = (title: string, content: string, type: 'heading' | 'subheading') => {
    setChatbotPopup({ isOpen: true, title, content, type })
  }
  const closeChatbot = () => setChatbotPopup(prev => ({ ...prev, isOpen: false }))
  const toggleHeading = (title: string) =>
    setExpandedHeadings(prev => ({ ...prev, [title]: !prev[title] }))
  const toggleSubheading = (title: string) =>
    setExpandedSubheadings(prev => ({ ...prev, [title]: !prev[title] }))

  return (
    <div className="space-y-8">
      {/* Document Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] bg-clip-text text-transparent">
          Document Analysis
        </h1>
        <div className="mt-4">
          <button
            onClick={() => setShowKeywords(!showKeywords)}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            {showKeywords ? 'Hide Keywords' : 'Show Keywords'}
          </button>
        </div>
      </div>

      {showKeywords && (
        <div className="p-6 bg-slate-900 rounded-2xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
            Keywords Learning Diagram
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.keywords.map(k => (
              <div key={k} className="px-3 py-2 bg-slate-800 rounded-lg text-slate-100">
                {k}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 bg-slate-900 rounded-2xl">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Document Summary</h2>
        <p className="text-slate-300">{data.summary}</p>
      </div>

      {data.headings.map(section => (
        <div
          key={section.title}
          className="p-6 bg-slate-900 rounded-2xl hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between mb-6">
            <div onClick={() => toggleHeading(section.title)} className="cursor-pointer">
              <h2 className="text-2xl font-bold text-slate-100">{section.title}</h2>
              <p className="text-sm text-slate-400">
                Page {section.start_page} • Lines {section.start_line}-{section.end_line}
              </p>
            </div>
            <button
              onClick={() => openChatbot(section.title, section.content, 'heading')}
              className="px-3 py-2 bg-[#0ea5e9]/10 rounded-md text-[#0ea5e9]"
            >
              Ask AI
            </button>
          </div>
          <AnimatePresence>
            {expandedHeadings[section.title] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <pre className="text-sm text-slate-400 whitespace-pre-wrap">
                  {section.content}
                </pre>
                {section.subheadings.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {section.subheadings.map(sub => (
                      <div key={sub.title} className="p-4 bg-slate-800 rounded-xl">
                        <div className="flex justify-between items-center">
                          <div onClick={() => toggleSubheading(sub.title)} className="cursor-pointer">
                            <h3 className="text-slate-100 font-semibold">{sub.title}</h3>
                          </div>
                          <button
                            onClick={() => openChatbot(sub.title, sub.content, 'subheading')}
                            className="px-2 py-1 bg-[#7c3aed]/10 text-[#7c3aed] rounded-md text-sm"
                          >
                            Ask AI
                          </button>
                        </div>
                        <AnimatePresence>
                          {expandedSubheadings[sub.title] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <pre className="text-sm text-slate-400 whitespace-pre-wrap mt-2">
                                {sub.content}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <ChatbotPopup
        isOpen={chatbotPopup.isOpen}
        onClose={closeChatbot}
        title={chatbotPopup.title}
        content={chatbotPopup.content}
        type={chatbotPopup.type}
      />
    </div>
  )
}

/* ---------------- Export main component with dummy data ---------------- */
export default function DocumentAnalysis() {
  return <StructuredDataView data={dummyDocument} />
}
