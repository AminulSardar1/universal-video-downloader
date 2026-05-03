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
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Background elements moved to index.css radial gradients but let's add some extra floating glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -20, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-pink-600/5 blur-[150px] rounded-full" 
        />
      </div>

      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl rounded-[40px] overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-6 right-6 z-51 p-4 bg-white/5 hover:bg-white hover:text-indigo-900 rounded-3xl transition-all shadow-2xl backdrop-blur-md"
              >
                <X className="w-6 h-6" />
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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 group"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-3 bg-indigo-500 blur-xl opacity-30 group-hover:opacity-70 transition-opacity" 
              />
              <div className="relative bg-white p-3 rounded-3xl shadow-2xl">
                <Zap className="w-7 h-7 text-indigo-600 fill-indigo-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter italic leading-none text-white">VELO</h1>
              <p className="text-[10px] font-black tracking-[0.4em] text-indigo-400 mt-1 uppercase opacity-60">High-Speed Grabber</p>
            </div>
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:flex items-center gap-2 p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl"
          >
            {['Home', 'History', 'Partners', 'Support'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${item === 'Home' ? 'bg-white text-indigo-950 shadow-2xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {item}
              </a>
            ))}
          </motion.nav>

          <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-colors">
              <Monitor className="w-4 h-4" /> APP
            </button>
          </motion.div>
        </header>

        {/* Hero Area */}
        <div className="max-w-4xl mx-auto w-full text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-gradient">
              Download Media <br />
              <span className="text-white italic">At Lightspeed.</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium mb-16 max-w-xl mx-auto leading-relaxed border-l-2 border-white/5 pl-8 text-left italic">
              Premium universal downloader for creators and enthusiasts. No limits. No ads. Just pure high-fidelity content grab.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <form onSubmit={handleDownload} className="relative z-20 group">
              <div className={`glass-card rounded-[40px] p-3 transition-all duration-700 premium-shadow ${loading ? 'scanning' : 'hover:border-white/20'}`}>
                {loading && <div className="scanning-line" />}
                <div className="flex flex-col md:flex-row items-stretch gap-3">
                  <div className="flex-1 flex items-center px-8 min-h-[70px]">
                    <LinkIcon className="w-6 h-6 text-indigo-400/30 mr-6" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste link from TikTok, IG, FB, YT..."
                      className="w-full bg-transparent border-none text-2xl focus:outline-none placeholder-white/10 text-white font-bold"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="h-20 md:h-auto px-12 bg-white text-indigo-950 rounded-[30px] font-black text-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-indigo-50 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-7 h-7" />
                    ) : (
                      <>
                        FETCH <Download className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
            
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {[
                { icon: Youtube, label: 'YouTube', color: 'text-red-500' },
                { icon: Facebook, label: 'Facebook', color: 'text-blue-500' },
                { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
                { icon: Zap, label: 'TikTok', color: 'text-cyan-500' }
              ].map((p, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={p.label} 
                  className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/5 px-6 py-2.5 rounded-full backdrop-blur-xl group cursor-default`}
                >
                  <p.icon className={`w-4 h-4 ${p.color} transition-transform group-hover:scale-125`} /> 
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity">{p.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-32">
          <div className="lg:col-span-3 space-y-12">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-[50px] p-12 text-center relative border-red-500/20"
                >
                  <div className="w-24 h-24 bg-red-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 ring-1 ring-red-500/20">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-red-100 mb-4 tracking-tight">Operation Failed</h3>
                  <p className="text-slate-400 text-lg font-medium max-w-md mx-auto leading-relaxed">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-10 px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-3xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[64px] p-10 md:p-14 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] text-slate-900 relative overflow-hidden"
                >
                  {/* Result Background Decoration */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-8 mb-16 relative">
                    <div className="flex items-center gap-4 px-8 py-3 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40">
                      <CheckCircle2 className="w-5 h-5" /> READY FOR CAPTURE
                    </div>
                    <div className="flex items-center gap-3">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TRANSACTION</p>
                       <p className="font-mono text-xs font-black bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-indigo-600">
                         {Math.random().toString(36).substring(2, 10).toUpperCase()}
                       </p>
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-14 mb-16 relative">
                    <div className="xl:w-80 aspect-video xl:aspect-square bg-slate-50 rounded-[48px] overflow-hidden relative group shrink-0 border-8 border-slate-50 shadow-2xl">
                      {result.thumbnail ? (
                        <img src={result.thumbnail} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-100">
                          <Play className="w-20 h-20 fill-current" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl">
                           <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center gap-8">
                      <div className="space-y-4">
                        <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] italic mb-2">SOURCE VERIFIED</p>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1] tracking-tighter">
                          {result.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4">
                         <span className="px-5 py-2.5 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">FORMAT: MP4</span>
                         <span className="px-5 py-2.5 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">ENCRYPTION: SSL</span>
                         <span className="px-5 py-2.5 bg-indigo-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600">STATE: ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {result.high && (
                      <motion.div className="flex gap-4 group/btn h-32">
                        <motion.button
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => triggerDownload(result.high, 'High')}
                          className="flex-1 px-10 bg-slate-900 text-white rounded-[32px] flex flex-col items-center justify-center shadow-2xl hover:bg-black transition-all border-b-8 border-indigo-600/50"
                        >
                          <span className="font-black text-3xl tracking-tighter italic">ULTRA HD</span>
                          <span className="text-[10px] font-black opacity-40 mt-1 uppercase tracking-[0.3em]">Pure Fidelity Output</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveVideoUrl(result.high)}
                          className="w-32 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-xl group-hover/btn:shadow-indigo-600/20"
                        >
                          <Play className="w-10 h-10 fill-current" />
                        </motion.button>
                      </motion.div>
                    )}
                    {result.low && (
                      <motion.div className="flex gap-4 group/btn h-32">
                        <motion.button
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => triggerDownload(result.low, 'Low')}
                          className="flex-1 px-10 bg-slate-100 rounded-[32px] flex flex-col items-center justify-center text-slate-800 hover:bg-slate-200 transition-all border-b-8 border-slate-300"
                        >
                          <span className="font-black text-3xl tracking-tighter italic">DATA SAVER</span>
                          <span className="text-[10px] font-black opacity-40 mt-1 uppercase tracking-[0.3em]">Optimized For Web</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveVideoUrl(result.low)}
                          className="w-32 bg-slate-800 text-white rounded-[32px] flex items-center justify-center hover:bg-black transition-all shadow-xl"
                        >
                          <Play className="w-10 h-10 fill-current" />
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : !loading && (
                <div className="h-full min-h-[600px] glass-card rounded-[80px] flex flex-col items-center justify-center text-white/5 space-y-12 border-dashed border-4">
                  <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="p-16 bg-white/5 rounded-[60px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/5"
                  >
                    <Download className="w-32 h-32 opacity-10" />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-black tracking-[0.6em] text-lg uppercase italic opacity-20">SYSTEM IDLE</p>
                    <p className="text-sm opacity-10 mt-4 font-medium max-w-xs mx-auto">Velo protocol is active and awaiting media resource initialization.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Side Bento Area */}
          <div className="space-y-12">
            {/* Global Activity */}
            <div className="glass-card rounded-[50px] p-10 premium-shadow">
              <h4 className="text-2xl font-black mb-12 flex items-center gap-4">
                <span className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] animate-pulse"></span>
                NETWORK
              </h4>
              <div className="space-y-10">
                {[
                  { tag: 'TT', name: 'velocity_edit.mp4', platform: 'TikTok' },
                  { tag: 'IG', name: 'aesthetic_shots.mov', platform: 'Instagram' },
                  { tag: 'YT', name: 'podcast_clip.mkv', platform: 'YouTube' },
                  { tag: 'FB', name: 'documentary.mp4', platform: 'Facebook' }
                ].map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    key={idx} 
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xl italic">
                      {item.tag}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-base font-black italic opacity-80 group-hover:text-indigo-400 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[10px] opacity-30 font-black uppercase tracking-[0.2em] mt-2 italic">{item.platform} &bull; COMPLETED</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Admin Hub */}
             <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-[50px] p-10 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <h4 className="text-2xl font-black mb-10 flex items-center gap-4">
                <Globe className="w-6 h-6 text-indigo-400" />
                CONCIERGE
              </h4>
              <div className="space-y-5">
                {[
                  { href: "https://www.facebook.com/100071880593545", icon: Facebook, label: "FACEBOOK", sub: "FOUNDER ACCESS", color: "bg-[#1877F2]" },
                  { href: "https://t.me/Aminulsordar", icon: Send, label: "TELEGRAM", sub: "GLOBAL NODE", color: "bg-[#0088cc]" },
                  { href: "https://wa.me/8801704407109", icon: MessageCircle, label: "WHATSAPP", sub: "INSTANT LINE", color: "bg-[#25D366]" }
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-6 p-5 rounded-[32px] transition-all group border border-white/5"
                  >
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform shrink-0`}>
                      <item.icon className="w-7 h-7 fill-current text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-base font-black tracking-tighter italic">{item.label}</p>
                      <p className="text-[10px] opacity-30 font-black tracking-[0.3em] uppercase truncate mt-1">{item.sub}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Performance Stat */}
            <div className="bg-indigo-600 rounded-[50px] p-14 text-center shadow-[0_40px_100px_-20px_rgba(79,70,229,0.5)] relative overflow-hidden group border border-white/20">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <p className="text-[11px] font-black text-indigo-200 uppercase tracking-[0.6em] mb-6 italic opacity-80">Aggregate Load</p>
              <div className="text-7xl font-black mb-4 tracking-tighter leading-none italic">1.2M+</div>
              <p className="text-sm font-black text-white/50 tracking-widest uppercase italic">Files Processed</p>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="mt-auto py-24 border-t border-white/5 flex flex-col items-center gap-16">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-20 text-[11px] font-black tracking-[0.4em] grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 cursor-default">
            <div className="flex items-center gap-4 hover:scale-110 transition-transform"><Youtube className="w-6 h-6" /> YOUTUBE</div>
            <div className="flex items-center gap-4 hover:scale-110 transition-transform"><Zap className="w-6 h-6" /> TIKTOK</div>
            <div className="flex items-center gap-4 hover:scale-110 transition-transform"><Facebook className="w-6 h-6" /> FACEBOOK</div>
            <div className="flex items-center gap-4 hover:scale-110 transition-transform"><Instagram className="w-6 h-6" /> INSTAGRAM</div>
          </div>
          
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 filter drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              <p className="text-[11px] text-indigo-400 font-black tracking-[0.5em] uppercase italic">VELO ENGINE v4.2.0 ACTIVE</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-white/10 font-black tracking-[0.4em] uppercase">
                &copy; 2026 VELO MEDIA INFRASTRUCTURE &bull; SYNCED
              </p>
              <p className="text-[10px] text-white/5 font-bold uppercase tracking-widest leading-relaxed">
                Design by Aminul &bull; Built with Advanced Liquid Glass &bull; All Rights Reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
