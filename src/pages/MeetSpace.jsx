import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Video,
    Mic,
    MicOff,
    VideoOff,
    MoreVertical,
    Paperclip,
    Smile,
    Users,
    ChevronRight,
    LogOut,
    Sparkles,
    MessageSquare,
    PhoneCall,
    ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const MeetSpace = () => {
    const { profile } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, user: 'Rahul P.', text: 'Hey team, I updated the database schema. Check the SQL file in workspace.', time: '10:45 AM' },
        { id: 2, user: 'Sneha K.', text: 'Great! I will start working on the API integration now.', time: '10:52 AM' },
        { id: 3, user: 'You', text: 'Awesome, I am finalizing the UI components.', time: '11:05 AM', isSelf: true },
    ]);
    const [input, setInput] = useState('');
    const [isJitsiActive, setIsJitsiActive] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages([...messages, { id: Date.now(), user: 'You', text: input, time, isSelf: true }]);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* Mission Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 text-brand mb-3">
                        <MessageSquare size={16} />
                        <p className="font-black tracking-[0.4em] text-[10px] uppercase italic">Strategic Communications Bridge</p>
                    </div>
                    <h1 className="text-5xl font-black gold-text-gradient italic tracking-tighter leading-none uppercase">
                        MEET & SYNC
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="glassmorphism px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/5">
                        <div className="relative">
                            <Users className="text-brand" size={18} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-bg-deep animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">05 PERSONNEL ACTIVE</span>
                    </div>
                    <button
                        onClick={() => setIsJitsiActive(!isJitsiActive)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-3 rounded-2xl font-black italic tracking-tighter transition-all shadow-xl active:scale-[0.98] uppercase",
                            isJitsiActive
                                ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5 hover:bg-red-500 hover:text-white"
                                : "bg-brand text-bg-deep shadow-brand/20 hover:bg-brand-light"
                        )}
                    >
                        <Video size={18} /> {isJitsiActive ? 'TERMINATE UPLINK' : 'INITIATE SYNC'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Secure Chat Nexus */}
                <div className={cn(
                    "glassmorphism rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden transition-all duration-700 relative group",
                    isJitsiActive ? "w-1/3" : "flex-1"
                )}>
                    {/* Background Chat Glow */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/5 blur-3xl pointer-events-none group-hover:bg-brand/10 transition-colors" />

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative z-10">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex flex-col group/msg transition-all duration-300", msg.isSelf ? "items-end" : "items-start")}>
                                <div className="flex items-center gap-3 mb-2 px-2">
                                    {!msg.isSelf && <span className="text-[10px] font-black text-brand uppercase tracking-widest">{msg.user}</span>}
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-0 group-hover/msg:opacity-100 transition-opacity">{msg.time}</span>
                                </div>
                                <div className={cn(
                                    "max-w-[85%] p-5 rounded-[1.5rem] text-sm font-medium tracking-tight leading-relaxed transition-all duration-500",
                                    msg.isSelf
                                        ? "bg-brand text-bg-deep rounded-tr-none shadow-xl shadow-brand/10 italic font-bold"
                                        : "bg-white/[0.03] text-slate-200 rounded-tl-none border border-white/5 hover:border-brand/30"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Uplink Input Area */}
                    <div className="p-8 bg-white/[0.01] border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-4 bg-white/[0.02] p-2 pr-2 rounded-2xl border border-white/5 focus-within:border-brand/40 transition-all shadow-inner overflow-hidden">
                            <button className="p-3 text-slate-600 hover:text-brand transition-all hover:bg-white/5 rounded-xl"><Paperclip size={20} /></button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="TRANSMIT MESSAGE..."
                                className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold text-white placeholder:text-slate-700 placeholder:italic uppercase tracking-widest py-2"
                            />
                            <button className="p-3 text-slate-600 hover:text-brand transition-all hover:bg-white/5 rounded-xl"><Smile size={20} /></button>
                            <button
                                onClick={handleSend}
                                className="bg-brand p-3 rounded-xl text-bg-deep hover:bg-brand-light transition-all shadow-xl shadow-brand/20 active:scale-95 group/send"
                            >
                                <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Multimedia Uplink Bridge (Jitsi) */}
                {isJitsiActive ? (
                    <div className="flex-1 glassmorphism rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-[0_0_100px_rgba(255,184,0,0.05)] animate-in zoom-in-95 duration-700">
                        {/* Status Overlay */}
                        <div className="absolute top-8 left-8 z-30 flex gap-3">
                            <div className="glassmorphism px-5 py-2 rounded-full flex items-center gap-3 border border-brand/20 shadow-2xl">
                                <div className="w-2 h-2 bg-brand rounded-full animate-pulse shadow-[0_0_10px_#FFB800]" />
                                <span className="text-[10px] font-black text-brand uppercase tracking-widest italic">SECURE BRIDGE ACTIVE</span>
                            </div>
                        </div>

                        {/* Control Deck Overlay (at Bottom) */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 glassmorphism p-4 px-8 rounded-[2rem] border border-white/10 shadow-2xl">
                            <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center border border-white/5 group active:scale-90">
                                <Mic size={24} className="group-hover:scale-110" />
                            </button>
                            <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center border border-white/5 group active:scale-90">
                                <Video size={24} className="group-hover:scale-110" />
                            </button>
                            <div className="w-px h-8 bg-white/10 mx-2" />
                            <button
                                onClick={() => setIsJitsiActive(false)}
                                className="w-16 h-16 bg-red-600 hover:bg-red-500 text-white rounded-[1.25rem] transition-all flex items-center justify-center shadow-xl shadow-red-500/20 active:scale-95 group"
                            >
                                <PhoneCall size={28} className="rotate-[135deg] group-hover:scale-110" />
                            </button>
                        </div>

                        <iframe
                            src={`https://meet.jit.si/espace-vithack-${profile?.id?.slice(0, 8) || 'internal'}`}
                            className="w-full h-full border-none grayscale-[0.2] brightness-75"
                            allow="camera; microphone; fullscreen; display-capture"
                        />
                    </div>
                ) : (
                    <div className="w-1/4 glassmorphism border border-white/5 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000 group">
                        <div className="w-24 h-24 bg-brand/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:border-brand/30 transition-all duration-700 relative">
                            <div className="absolute inset-0 bg-brand/5 blur-2xl rounded-full animate-pulse" />
                            <PhoneCall className="text-slate-700 group-hover:text-brand transition-colors relative z-10" size={40} />
                        </div>
                        <h4 className="text-xl font-black text-white italic tracking-tighter mb-4">UPLINK STANDBY</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10 leading-relaxed px-4">Ready to initiate high-bandwidth strategic synchronization.</p>
                        <button
                            onClick={() => setIsJitsiActive(true)}
                            className="text-[10px] font-black text-brand hover:text-brand-light transition-all flex items-center gap-3 uppercase tracking-[0.3em] group/start"
                        >
                            INITIATE BRIDGE <ExternalLink size={14} className="group-hover/start:translate-x-1 group-hover/start:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetSpace;
