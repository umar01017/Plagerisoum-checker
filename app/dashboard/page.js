"use client";

import { useState } from 'react';
import { rewriteTextAPI, uploadDocumentAPI, detectPlagiarismAPI } from '@/lib/api';
import { Loader2, UploadCloud, Copy, Download, CheckCircle2, Search, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODES = [
  { id: 'light', label: 'Light', desc: 'Fixes grammar and flow' },
  { id: 'standard', label: 'Standard', desc: 'Bypasses basic detectors' },
  { id: 'deep', label: 'Deep', desc: 'Maximum uniqueness' },
  { id: 'academic', label: 'Academic', desc: 'Formal and scholarly tone' },
  { id: 'seo', label: 'SEO', desc: 'Optimized for search engines' }
];

export default function Dashboard() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleRewrite = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await rewriteTextAPI(text, mode);
      setResult(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadDocumentAPI(file);
      setText(res.data.extracted_text);
    } catch (err) {
      alert("Upload error: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleScan = async () => {
    if (!text.trim()) return;
    setScanLoading(true);
    setScanResult(null);
    try {
      const res = await detectPlagiarismAPI(text);
      setScanResult(res.data);
    } catch (err) {
      alert("Scan error: " + (err.response?.data?.detail || err.message));
    } finally {
      setScanLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.rewritten_text);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.rewritten_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rewritten-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Rewriter</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Paste your text or upload a document to make it 100% unique.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Original Text</span>
              <div className="relative">
                <input type="file" id="file-upload" className="sr-only" accept=".txt,.pdf,.docx" onChange={handleFileUpload} disabled={uploading}/>
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Upload
                </label>
              </div>
            </div>
            <textarea
              className="flex-1 w-full p-4 resize-none outline-none dark:bg-gray-800 dark:text-white"
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex gap-4">
                  <span>{text.length} characters</span>
                  <span>{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
                </div>
                <button 
                  onClick={handleScan} 
                  disabled={scanLoading || !text.trim()} 
                  className="flex items-center gap-2 px-3 py-1.5 font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg transition-colors disabled:opacity-50"
                  title="Check Plagiarism Level"
                >
                  {scanLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                  Scan Plagiarism
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {scanResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl p-4 overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 text-purple-500 dark:text-purple-400">
                    {scanResult.plagiarism_score > 40 ? <AlertTriangle className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-4">
                      <span>Plagiarism: {scanResult.plagiarism_score}%</span>
                      <span className="text-gray-400 font-normal">|</span>
                      <span>AI Prob: {scanResult.ai_generated_score}%</span>
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">{scanResult.details}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Select Rewrite Mode</h3>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${mode === m.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-gray-500'}`}
                >
                  <div className={`font-medium ${mode === m.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{m.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={handleRewrite}
              disabled={loading || !text.trim()}
              className="w-full mt-4 flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Rewrite Content'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] lg:h-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">Rewritten Text</span>
            {result && (
              <div className="flex gap-2">
                <button onClick={handleCopy} className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={handleDownload} className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto relative min-h-[300px]">
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 font-medium text-gray-600 dark:text-gray-300">Intelligently rewriting your content...</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {result ? (
              <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{result.rewritten_text}</div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Your rewritten text will appear here.
              </div>
            )}
          </div>
          {result && (
             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Uniqueness</div>
                 <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                   {result.uniqueness_score}% <CheckCircle2 className="w-5 h-5"/>
                 </div>
               </div>
               <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score</div>
                 <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                   {result.readability_score}%
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
