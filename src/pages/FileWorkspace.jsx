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
    Search
} from 'lucide-react';
import { cn } from '../lib/utils';

const FileWorkspace = () => {
    const [files, setFiles] = useState([
        { id: 1, name: 'Project_Proposal.pdf', size: '2.4 MB', type: 'PDF', date: '2024-02-25' },
        { id: 2, name: 'System_Architecture.png', size: '1.8 MB', type: 'Image', date: '2024-02-26' },
        { id: 3, name: 'Database_Schema.sql', size: '45 KB', type: 'SQL', date: '2024-02-27' },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2">Workspace / Files</p>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent italic">
                        Centralized Storage
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                        <Upload size={18} /> Upload File
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* File List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Size</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {files.map((file) => (
                                    <tr key={file.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                                                    <File size={20} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-200">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-sans">{file.size}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-sans">{file.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><Download size={18} /></button>
                                                <button className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* GitHub Integration Sidebar Card */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Github size={24} className="text-white" /> GitHub Sync
                            </h2>
                            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-all">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Connected Repository</p>
                                    <ExternalLink size={14} className="text-blue-400" />
                                </div>
                                <p className="text-sm font-bold text-white mb-1">vithack/e-space-platform</p>
                                <p className="text-[10px] text-slate-500">Last commit: 12 minutes ago</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-slate-800/20 p-4 rounded-2xl border border-slate-700/50">
                                    <p className="text-2xl font-black text-white">142</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Commits</p>
                                </div>
                                <div className="bg-slate-800/20 p-4 rounded-2xl border border-slate-700/50">
                                    <p className="text-2xl font-black text-white">5</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Contributors</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                                Connect Repository
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Plus size={80} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Upgrade Storage?</h3>
                        <p className="text-sm text-slate-400 mb-4">You are using 14.2 MB of your 50 MB institucional allowance.</p>
                        <button className="text-blue-400 font-bold text-sm hover:underline">Request more space →</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileWorkspace;
