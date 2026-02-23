import React from 'react';
import { Gamepad2, Settings, Zap, Coffee } from 'lucide-react';

const QuickLaunch: React.FC = () => {
    const links = [
        { icon: Zap, label: 'Blitz', color: 'bg-yellow-400' },
        { icon: Gamepad2, label: 'Retro', color: 'bg-purple-500' },
        { icon: Coffee, label: 'Break', color: 'bg-emerald-500' },
        { icon: Settings, label: 'Config', color: 'bg-slate-400' },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 h-full">
            {links.map((link, i) => (
                <button
                    key={i}
                    className="flex flex-col items-center justify-center p-4 bg-white/60 hover:bg-white border border-white/40 rounded-2xl transition-all shadow-sm group"
                >
                    <link.icon className={`w-8 h-8 mb-2 transition-transform group-hover:scale-110 ${link.color.replace('bg-', 'text-')}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{link.label}</span>
                </button>
            ))}
        </div>
    );
};

export default QuickLaunch;
