/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Link as LinkIcon, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Play,
  X,
  Zap,
  Facebook,
  Youtube,
  Instagram,
  Send,
  MessageCircle,
  Globe,
  Monitor
} from 'lucide-react';

interface VideoData {
  title: string;
  high: string;
  low: string;
  thumbnail?: string;
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoData | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid video link first.");
      return;
    }

    try {
      if (!url.startsWith('http')) {
        throw new Error();
      }
      new URL(url);
    } catch {
      setError("The link you entered doesn't look like a valid URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setActiveVideoUrl(null);

    try {
      const apiURL = `/api/download?url=${encodeURIComponent(url)}`;
      const res = await axios.get(apiURL);
      const data = res?.data?.data?.data;

      if (res.data?.status === false || res.data?.error) {
        throw new Error(res.data?.message || "This video source is currently not supported.");
      }

      if (!data || (!data.high && !data.low)) {
        throw new Error("Could not extract download links. The video might be private or deleted.");
      }

      setResult({
        title: data.title || "Untitled Video",
        high: data.high,
        low: data.low,
        thumbnail: data.thumbnail
      });
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 404) {
          setError("Video not found. Please check if the link is correct.");
        } else if (status === 500) {
          setError("The downloader service is currently unavailable. Try again later.");
        } else if (err.code === 'ERR_NETWORK') {
          setError("Network connection issue. Please check your internet.");
        } else {
          setError(err.response?.data?.details || err.message);
        }
      } else {
        setError(err?.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (downloadUrl: string, quality: string) => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen text-slate-50 font-sans selection:bg-blue-600 selection:text-white pb-12">
      {/* Subtle Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[500px] bg-blue-900/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl rounded-2xl overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-6 right-6 z-51 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              <video 
                src={activeVideoUrl} 
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative bg-blue-600 p-2.5 rounded-xl shadow-lg ring-1 ring-blue-400/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Aminul</h1>
              <p className="text-[9px] font-bold tracking-[0.3em] text-blue-400 uppercase opacity-70">Media Protocol</p>
            </div>
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex items-center gap-1 p-1.5 bg-slate-900/50 rounded-full border border-white/5 backdrop-blur-md"
          >
            {['Home', 'History', 'API Docs', 'Support'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className={`px-6 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all ${item === 'Home' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                {item}
              </a>
            ))}
          </motion.nav>

          <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/10 transition-colors">
              <Monitor className="w-4 h-4" /> Dashboard
            </button>
          </motion.div>
        </header>

        {/* Hero Area */}
        <div className="max-w-4xl mx-auto w-full text-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
              The Enterprise Standard <br />
              <span className="text-blue-500">for Media Retrieval.</span>
            </h2>
            <p className="text-slate-400 text-lg sm:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Professional-grade media extraction infrastructure. Fast, secure, and reliable processing for all primary social platforms.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <form onSubmit={handleDownload} className="relative z-20">
              <div className={`pro-card rounded-2xl p-2 sm:p-2.5 transition-shadow hover:pro-shadow ${loading ? 'opacity-80' : ''}`}>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 flex items-center px-6 min-h-[56px]">
                    <LinkIcon className="w-5 h-5 text-slate-500 mr-4 shrink-0" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter a video link from TikTok, Instagram, YouTube..."
                      className="w-full bg-transparent border-none text-base focus:outline-none placeholder-slate-600 text-white font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-14 sm:h-auto px-8 sm:px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-950/20"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        Extract <Download className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3 opacity-60">
              {[
                { icon: Youtube, label: 'YouTube' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Zap, label: 'TikTok' }
              ].map((p, i) => (
                <div 
                  key={p.label} 
                  className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest bg-slate-800/40 border border-white/5 px-4 py-2 rounded-lg`}
                >
                  <p.icon className="w-3.5 h-3.5" /> 
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-24">
          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="pro-card rounded-2xl p-8 text-center border-red-500/20"
                >
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 text-red-500">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">Extraction Error</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all"
                  >
                    Return
                  </button>
                </motion.div>
              )}

              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pro-card rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> System Validated
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                      REF: {Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-10 mb-10">
                    <div className="md:w-64 aspect-video md:aspect-square bg-slate-800 rounded-2xl overflow-hidden relative group shrink-0 shadow-lg border border-white/5">
                      {result.thumbnail ? (
                        <img src={result.thumbnail} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                          <Play className="w-12 h-12 fill-current" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl text-white">
                           <Play className="w-6 h-6 fill-current translate-x-0.5" />
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="mb-6">
                        <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-1">Video Resource</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                          {result.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-slate-800 rounded-lg text-[9px] font-semibold text-slate-400 border border-white/5">ENCODING: MP4</span>
                         <span className="px-3 py-1 bg-slate-800 rounded-lg text-[9px] font-semibold text-slate-400 border border-white/5">PROTECTION: SSL</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.high && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerDownload(result.high, 'High')}
                          className="flex-1 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex flex-col items-center justify-center shadow-lg transition-all group"
                        >
                          <span className="font-bold text-lg">Download High-Res</span>
                          <span className="text-[10px] font-medium opacity-70 mt-0.5 uppercase tracking-widest">Highest Quality Available</span>
                        </button>
                        <button
                          onClick={() => setActiveVideoUrl(result.high)}
                          className="w-16 bg-slate-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all border border-white/5"
                        >
                          <Play className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                    )}
                    {result.low && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerDownload(result.low, 'Low')}
                          className="flex-1 px-8 py-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex flex-col items-center justify-center border border-white/10 transition-all"
                        >
                          <span className="font-bold text-lg">Standard Def</span>
                          <span className="text-[10px] font-medium opacity-50 mt-0.5 uppercase tracking-widest">Optimized for Storage</span>
                        </button>
                        <button
                          onClick={() => setActiveVideoUrl(result.low)}
                          className="w-16 bg-slate-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all border border-white/5"
                        >
                          <Play className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : !loading && (
                <div className="pro-card rounded-[40px] flex flex-col items-center justify-center min-h-[500px] border-dashed text-slate-800">
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-full" />
                    <Download className="w-16 h-16 relative opacity-20" />
                  </div>
                  <div className="text-center px-6">
                    <p className="font-bold tracking-[0.2em] text-xs uppercase opacity-40 mb-2">Waiting for input</p>
                    <p className="text-slate-500/60 font-medium text-sm max-w-xs mx-auto">Please enter a valid media resource identifier to initiate the extraction protocol.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Side Bento Area */}
          <div className="space-y-8">
            {/* Global Activity */}
            <div className="pro-card rounded-3xl p-8">
              <h4 className="text-sm font-bold mb-8 flex items-center gap-3 text-slate-300">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>
                Live Activity
              </h4>
              <div className="space-y-6">
                {[
                  { tag: 'TT', name: 'aminul_media.mp4', platform: 'TikTok' },
                  { tag: 'IG', name: 'aesthetic.mov', platform: 'Instagram' },
                  { tag: 'YT', name: 'podcast.mkv', platform: 'YouTube' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {item.tag}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">{item.platform}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
             <div className="pro-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Globe className="w-12 h-12" />
              </div>
              <h4 className="text-sm font-bold mb-8 text-slate-300 uppercase tracking-widest">
                Support
              </h4>
              <div className="space-y-3">
                {[
                  { href: "https://www.facebook.com/100071880593545", icon: Facebook, label: "Facebook", color: "bg-[#1877F2]" },
                  { href: "https://t.me/Aminulsordar", icon: Send, label: "Telegram", color: "bg-[#0088cc]" },
                  { href: "https://wa.me/8801704407109", icon: MessageCircle, label: "WhatsApp", color: "bg-[#25D366]" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-3.5 rounded-xl transition-all border border-white/5 hover:bg-slate-800/80 group"
                  >
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <item.icon className="w-5 h-5 fill-current text-white" />
                    </div>
                    <p className="text-xs font-bold text-slate-300">{item.label}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-blue-600 rounded-3xl p-10 text-center shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-[40px] rounded-full" />
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em] mb-3">Total Volume</p>
              <div className="text-4xl font-black text-white mb-2 tracking-tight">1.2M+</div>
              <p className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest">Global Downloads</p>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="mt-auto py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">
              Aminul Protocol &bull; v4.2.0-STABLE
            </p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.1em]">
              &copy; {new Date().getFullYear()} Aminul Infrastructure Group.
            </p>
          </div>
          
          <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
            <Youtube className="w-5 h-5 cursor-pointer" />
            <Zap className="w-5 h-5 cursor-pointer" />
            <Facebook className="w-5 h-5 cursor-pointer" />
            <Instagram className="w-5 h-5 cursor-pointer" />
          </div>
        </footer>
      </div>
    </div>
  );
}
