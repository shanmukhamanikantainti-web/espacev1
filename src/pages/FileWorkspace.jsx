import React, { useState } from 'react';
import {
    File,
    Upload,
    Download,
    Trash2,
    Github,
    ExternalLink,
    Plus,
    RefreshCw,
    Search,
    ChevronRight,
    FileText,
    Database,
    Cloud
} from 'lucide-react';
import { cn } from '../lib/utils';

const FileWorkspace = () => {
    const [files, setFiles] = useState([
        { id: 1, name: 'Project_Proposal.pdf', size: '2.4 MB', type: 'PDF', date: '2024-02-25' },
        { id: 2, name: 'System_Architecture.png', size: '1.8 MB', type: 'Image', date: '2024-02-26' },
        { id: 3, name: 'Database_Schema.sql', size: '45 KB', type: 'SQL', date: '2024-02-27' },
    ]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 text-brand mb-3">
                        <Database size={16} />
                        <p className="font-black tracking-[0.4em] text-[10px] uppercase italic">Strategic Data Repository</p>
                    </div>
                    <h1 className="text-6xl font-black gold-text-gradient italic tracking-tighter leading-none">
                        WORKSPACE STORAGE
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH PROTOCOLS..."
                            className="bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] text-white font-black tracking-widest focus:border-brand/40 outline-none transition-all w-72 uppercase"
                        />
                    </div>
                    <button className="flex items-center gap-3 bg-brand hover:bg-brand-light text-bg-deep px-8 py-4 rounded-2xl font-black italic tracking-tighter transition-all shadow-xl shadow-brand/20 active:scale-[0.98]">
                        <Upload size={18} /> UPLOAD ASSET
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Tactical File Registry */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glassmorphism rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Designation</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Payload</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Timestamp</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {files.map((file) => (
                                    <tr key={file.id} className="hover:bg-white/[0.02] transition-all group cursor-default">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-brand/5 border border-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:scale-110 transition-transform duration-500">
                                                    <FileText size={22} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white italic tracking-tight uppercase">{file.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{file.type} FORMAT</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-slate-400 tracking-widest">{file.size}</td>
                                        <td className="px-8 py-6 text-[10px] font-black text-slate-400 tracking-widest">{file.date}</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="p-3 bg-white/5 hover:bg-brand/10 rounded-xl text-slate-500 hover:text-brand border border-transparent hover:border-brand/20 transition-all">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* External Sync Architecture */}
                <div className="space-y-10">
                    <div className="glassmorphism rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden group">
                        {/* Background Sync Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white italic flex items-center gap-4 tracking-tighter">
                                <Github size={28} className="text-white" /> GITHUB SYNC
                            </h2>
                            <button className="p-3 bg-white/5 hover:bg-brand/10 rounded-xl text-slate-500 hover:text-brand transition-all border border-white/5 group/sync">
                                <RefreshCw size={18} className="group-hover/sync:rotate-180 transition-transform duration-500" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 bg-white/[0.02] rounded-[1.5rem] border border-white/10 group-hover:border-brand/20 transition-all duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Operational Unit Repository</p>
                                    <ExternalLink size={14} className="text-brand animate-pulse" />
                                </div>
                                <p className="text-md font-black text-white mb-2 tracking-tight italic">ECELL_VITB / E-SPACE_CORE</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Sync: 12m Ago</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-center">
                                <div className="glassmorphism p-6 rounded-[1.5rem] border border-white/5 group-hover:border-white/10 transition-colors">
                                    <p className="text-3xl font-black text-white italic tracking-tighter">142</p>
                                    <p className="text-[10px] text-brand/70 font-black uppercase tracking-[0.2em] mt-1">Commits</p>
                                </div>
                                <div className="glassmorphism p-6 rounded-[1.5rem] border border-white/5 group-hover:border-white/10 transition-colors">
                                    <p className="text-3xl font-black text-white italic tracking-tighter">05</p>
                                    <p className="text-[10px] text-brand/70 font-black uppercase tracking-[0.2em] mt-1">Personnel</p>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 rounded-[1.5rem] font-black italic tracking-tighter transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                CONNECT EXTERNAL ASSET
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Storage Allocation Alert */}
                    <div className="bg-brand/10 border border-brand/20 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-brand/40 transition-all duration-700">
                        <div className="absolute top-[-20%] right-[-10%] p-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                            <Cloud size={120} />
                        </div>
                        <h3 className="text-xl font-black text-brand italic mb-3 tracking-tighter leading-none">ALLOCATION UPGRADE</h3>
                        <p className="text-xs font-bold font-poppets text-brand/70 mb-6 uppercase tracking-wide leading-relaxed">
                            Utilizing <span className="text-white font-black">14.2 MB</span> of standard <span className="text-white font-black">50 MB</span> institutional quota.
                        </p>
                        <button className="text-brand font-black text-[10px] tracking-[0.2em] uppercase hover:underline decoration-brand decoration-2 underline-offset-8 flex items-center gap-2">
                            REQUEST QUOTA EXPANSION <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileWorkspace;
