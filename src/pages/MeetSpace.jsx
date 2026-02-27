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
    Users
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
        setMessages([...messages, { id: Date.now(), user: 'You', text: input, time: '11:10 AM', isSelf: true }]);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-purple-400 font-bold tracking-widest text-xs uppercase mb-1">Collaboration Space</p>
                    <h1 className="text-3xl font-black text-white italic">Meet & Chat</h1>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                        <Users className="text-blue-400" size={18} />
                        <span className="text-sm font-bold text-slate-300">5 Members Online</span>
                    </div>
                    <button
                        onClick={() => setIsJitsiActive(!isJitsiActive)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-lg",
                            isJitsiActive
                                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                        )}
                    >
                        <Video size={18} /> {isJitsiActive ? 'End Call' : 'Join Call'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Chat Area */}
                <div className={cn(
                    "bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col overflow-hidden transition-all duration-500",
                    isJitsiActive ? "w-1/3" : "flex-1"
                )}>
                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex flex-col", msg.isSelf ? "items-end" : "items-start")}>
                                <div className="flex items-center gap-2 mb-1">
                                    {!msg.isSelf && <span className="text-xs font-bold text-blue-400">{msg.user}</span>}
                                    <span className="text-[10px] text-slate-500 uppercase">{msg.time}</span>
                                </div>
                                <div className={cn(
                                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium",
                                    msg.isSelf
                                        ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10"
                                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-slate-900/80 border-t border-slate-800">
                        <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 transition-all">
                            <button className="p-2 text-slate-500 hover:text-slate-300 transition-all"><Paperclip size={20} /></button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200"
                            />
                            <button className="p-2 text-slate-500 hover:text-yellow-400 transition-all"><Smile size={20} /></button>
                            <button
                                onClick={handleSend}
                                className="bg-blue-600 p-2 rounded-xl text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Meeting Area (Jitsi Integration Placeholder) */}
                {isJitsiActive ? (
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl shadow-blue-500/5 animate-in zoom-in-95 duration-500">
                        {/* Real integration would use Jitsi External API iframe here */}
                        <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-blue-600/20 border-2 border-blue-500 animate-ping absolute inset-0" />
                                <div className="w-32 h-32 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center relative z-10">
                                    <Users size={48} className="text-blue-400" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-2 italic">Meeting in Session</h3>
                                <p className="text-sm text-slate-400 font-sans">Connecting to secure institutional bridge...</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition-all"><Mic size={24} /></button>
                                <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition-all"><Video size={24} /></button>
                                <button
                                    onClick={() => setIsJitsiActive(false)}
                                    className="p-4 bg-red-600 hover:bg-red-700 rounded-2xl text-white transition-all shadow-lg shadow-red-500/20"
                                >
                                    <LogOut size={24} className="rotate-180" />
                                </button>
                            </div>
                        </div>
                        {/* iframe src would be: `https://meet.jit.si/${profile.team_id || 'espace-test-room'}` */}
                        <iframe
                            src={`https://meet.jit.si/espace-vithack-${profile?.id?.slice(0, 8) || 'internal'}`}
                            className="w-full h-full border-none"
                            allow="camera; microphone; fullscreen; display-capture"
                        />
                    </div>
                ) : (
                    <div className="w-1/4 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
                            <Video className="text-slate-500" size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-400 mb-2">No active meeting</h4>
                        <p className="text-sm text-slate-500 mb-6">Start a quick audio/video sync with your team anytime.</p>
                        <button
                            onClick={() => setIsJitsiActive(true)}
                            className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-2"
                        >
                            Start Sync Now <ExternalLink size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetSpace;
