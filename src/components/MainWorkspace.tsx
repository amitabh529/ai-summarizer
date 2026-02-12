import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFileWithFallback } from '../utils/response'
import Mindmap from './FlowchartMindmap'
import BeautifulMindmap from './BeautifulMindmap'

// Type definitions
interface Subheading {
  title: string
  content: string
  start_page: number
  start_line: number
  end_page: number
  end_line: number
  subheadings: Subheading[]
}

interface Heading {
  title: string
  content: string
  start_page: number
  start_line: number
  end_page: number
  end_line: number
  subheadings: Subheading[]
}

interface DocumentData {
  headings: Heading[]
  summary: string
  keywords: string[]
}

export default function MainWorkspace() {
  const [view, setView] = useState<'upload' | 'loading' | 'structured'>('upload')
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mindmapType, setMindmapType] = useState<'flowchart' | 'beautiful'>('beautiful')

  const handleFileUpload = async (file: File) => {
    console.log('🚀 Starting file upload...', file.name)
    setView('loading')
    
    try {
      console.log('📤 Uploading file to API...')
      const response = await uploadFileWithFallback(file)
      
      console.log('📥 API Response received:', response)
      
      if (response.success && response.data) {
        console.log('✅ Setting document data from API response')
        console.log('📋 Document Data:', JSON.stringify(response.data, null, 2))
        
        setDocumentData(response.data)
        setView('structured')
      } else {
        const errorMsg = response.message || (response as any).error || 'API response was not successful'
        console.error('❌ API response was not successful:', errorMsg)
        alert(`Upload failed: ${errorMsg}`)
        setView('upload')
      }
      
    } catch (error: any) {
      console.error('💥 Upload error:', error)
      
      // Handle different error formats
      let errorMessage = 'Unknown error occurred during upload'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.error) {
        errorMessage = error.error
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      // Show error to user
      alert(`Upload failed: ${errorMessage}\n\nPlease try again or check your file.`)
      
      setView('upload')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {view === 'upload' && (
            <UploadZone key="upload" onFileUpload={handleFileUpload} />
          )}
          {view === 'loading' && <LoadingView key="loading" />}
          {view === 'structured' && documentData && (
            <StructuredView 
              key="structured" 
              data={documentData} 
              reset={() => { setView('upload'); setDocumentData(null)}}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              mindmapType={mindmapType}
              setMindmapType={setMindmapType}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// === Upload Zone ===
function UploadZone({ onFileUpload }: { onFileUpload: (file: File) => void }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={e => { e.preventDefault(); setIsDragOver(false) }}
        onDrop={e => {
          e.preventDefault()
          setIsDragOver(false)
          const file = e.dataTransfer.files?.[0]
          file && onFileUpload(file)
        }}
        className={`relative w-full max-w-2xl h-96 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-cyan-400 bg-cyan-500/5 shadow-[0_0_40px_rgba(6,182,212,0.4)] scale-105' 
            : 'border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/5'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            animate={{ y: isDragOver ? -10 : 0 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-6"
          >
            <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>
          <h3 className="text-xl font-semibold">{isDragOver ? 'Drop your PDF here!' : 'Upload PDF Document'}</h3>
          <p className="text-slate-400 mb-6">Drag and drop your PDF file here, or click to browse</p>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && onFileUpload(e.target.files[0])} />
        </div>
      </div>
    </motion.div>
  )
}

// === Loading View ===
function LoadingView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-2">Processing Document</h3>
        <p className="text-slate-400">Extracting and analyzing content...</p>
      </div>
    </motion.div>
  )
}

// === Structured View ===
function StructuredView({ 
  data, 
  reset, 
  isModalOpen, 
  setIsModalOpen, 
  mindmapType, 
  setMindmapType 
}: { 
  data: DocumentData
  reset: () => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  mindmapType: 'flowchart' | 'beautiful'
  setMindmapType: (type: 'flowchart' | 'beautiful') => void
}) {
  const [openHeadingIndex, setOpenHeadingIndex] = useState<number | null>(null);
  const [openSubheadingIndex, setOpenSubheadingIndex] = useState<number | null>(null);

  const toggleHeading = (index: number) => {
    setOpenHeadingIndex(openHeadingIndex === index ? null : index);
    setOpenSubheadingIndex(null);
  };

  const toggleSubheading = (index: number) => {
    setOpenSubheadingIndex(openSubheadingIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Document Analysis 🤖</h3>
        <div className="flex gap-4 items-center">
          {/* Mindmap Type Selector */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-600">
            <button
              onClick={() => setMindmapType('flowchart')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                mindmapType === 'flowchart' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flowchart
            </button>
            <button
              onClick={() => setMindmapType('beautiful')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                mindmapType === 'beautiful' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive
            </button>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)} // Toggles the modal state
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-transform duration-300 shadow-lg bg-gradient-to-r from-violet-500 to-cyan-500 hover:scale-105"
          >
            Open Mindmap
          </button>
          <button
            onClick={reset}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-sm font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Upload New
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700"
      >
        <h4 className="text-xl font-bold mb-3 text-cyan-300">Summary</h4>
        <p className="text-slate-400 leading-relaxed">{data.summary}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700"
      >
        <h4 className="text-xl font-bold mb-3 text-cyan-300">Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {data.keywords?.map((keyword, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="px-4 py-1.5 bg-violet-500/30 rounded-full text-sm font-medium text-violet-300"
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div>
        <h4 className="text-2xl font-bold my-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Document Structure</h4>
        <div className="space-y-4">
          {data.headings?.map((heading, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
              className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleHeading(idx)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h5 className="font-semibold text-lg text-cyan-300 hover:text-cyan-200 transition-colors">{heading.title}</h5>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Add your chat functionality here
                        console.log('Chat with heading:', heading.title)
                        alert(`Chat feature for: ${heading.title}`)
                      }}
                      className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 group"
                      title="Chat about this section"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.13 8.13 0 01-2.939-.571L7 21l1.29-3.061A8.001 8.001 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    📄 Page {heading.start_page}, Lines {heading.start_line}-{heading.end_line}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openHeadingIndex === idx ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-6 h-6 flex items-center justify-center text-slate-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </motion.div>
              </div>

              <AnimatePresence>
                {openHeadingIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">{heading.content}</p>

                    {heading.subheadings?.length > 0 && (
                      <div className="ml-4 mt-4 space-y-3">
                        {heading.subheadings.map((sub, j) => (
                          <div key={j} className="border-l-2 border-violet-500 pl-4">
                            <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleSubheading(j)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-violet-300 text-sm font-medium hover:text-violet-200 transition-colors">{sub.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // Add your chat functionality here
                                      console.log('Chat with subheading:', sub.title)
                                      alert(`Chat feature for: ${sub.title}`)
                                    }}
                                    className="p-1 rounded-md bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 transition-all duration-200 group"
                                    title="Chat about this subsection"
                                  >
                                    <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.13 8.13 0 01-2.939-.571L7 21l1.29-3.061A8.001 8.001 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="text-xs text-slate-600 mt-0.5">
                                  📄 Page {sub.start_page}, Lines {sub.start_line}-{sub.end_line}
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: openSubheadingIndex === j ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-5 h-5 flex items-center justify-center text-slate-400"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                              </motion.div>
                            </div>
                            
                            <AnimatePresence>
                              {openSubheadingIndex === j && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{sub.content}</p>
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Conditional Mindmap Rendering */}
      {isModalOpen && mindmapType === 'flowchart' && (
        <Mindmap isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
      )}
      {isModalOpen && mindmapType === 'beautiful' && (
        <BeautifulMindmap 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          data={data.headings?.map(heading => ({
            heading: heading.title,
            subheadings: heading.subheadings?.map(sub => ({
              title: sub.title,
              summary: sub.content
            })) || []
          }))}
        />
      )}
    </div>
  )
}