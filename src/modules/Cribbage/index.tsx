import React, { useState } from 'react';
import { RefreshCw, User, Cpu, Award } from 'lucide-react';

const CribbageAlchemist: React.FC = () => {
    const [score, setScore] = useState({ p1: 0, p2: 0 });
    const [history, setHistory] = useState<string[]>(['Initial deal completed.']);

    const addPoints = (player: 'p1' | 'p2', pts: number, reason: string) => {
        setScore(s => ({ ...s, [player]: s[player] + pts }));
        setHistory(h => [`${player === 'p1' ? 'Skinny D' : 'CPU'} scored ${pts} (${reason})`, ...h].slice(0, 5));
    };

    return (
        <div className="flex gap-6 h-full">
            {/* Board Visualization (Conceptual for now) */}
            <div className="flex-1 bg-amber-50/50 rounded-3xl border border-amber-200/50 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg transition-all ${score.p1 >= 121 ? 'bg-green-500' : 'bg-blue-600'}`}>
                            <User size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Skinny D</div>
                            <div className="text-3xl font-black text-slate-800 tabular-nums">{score.p1}</div>
                        </div>
                    </div>

                    <div className="h-px flex-1 mx-8 bg-amber-200/30 flex items-center justify-center relative">
                        <div className="bg-amber-100 px-3 text-[10px] font-black text-amber-800 tracking-tighter">THE BATTLE</div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-red-600">The Forge CPU</div>
                            <div className="text-3xl font-black text-slate-800 tabular-nums">{score.p2}</div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                            <Cpu size={24} />
                        </div>
                    </div>
                </div>

                {/* Pegging Simulation Area */}
                <div className="flex-1 my-6 flex gap-4 items-center">
                    <div className="flex-1 h-32 bg-white/40 rounded-2xl border-2 border-dashed border-amber-300/30 flex items-center justify-center text-slate-400 italic font-medium">
                        Interactive Board Rendering...
                    </div>
                    <div className="w-24 h-32 bg-slate-800 rounded-xl shadow-xl flex items-center justify-center border-t-2 border-slate-700">
                        <div className="text-slate-500 font-black text-xs rotate-90 tracking-widest">DECK</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => addPoints('p1', 2, 'Pair')}
                        className="flex-1 py-3 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-black text-sm transition-all"
                    >
                        +2 PAIR
                    </button>
                    <button
                        onClick={() => addPoints('p1', 3, 'Run')}
                        className="flex-1 py-3 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-black text-sm transition-all"
                    >
                        +3 RUN
                    </button>
                    <button
                        onClick={() => setScore({ p1: 0, p2: 0 })}
                        className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-xl transition-all"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* History log */}
            <div className="w-64 bg-slate-900 rounded-3xl p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                    <Award size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Alchemist Log</h3>
                </div>
                <div className="flex-1 space-y-3 overflow-hidden">
                    {history.map((log, i) => (
                        <div key={i} className="text-[11px] font-bold text-slate-400 leading-tight pb-3 border-b border-white/5 last:border-0">
                            <span className="text-white/20 mr-2">[{history.length - i}]</span>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CribbageAlchemist;
