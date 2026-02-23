import React from 'react';
import { ExternalLink } from 'lucide-react';

const NewsTicker: React.FC = () => {
    const headlines = [
        { source: 'Reuters', text: 'New developments in spatial computing highlight MIT Reality Hack outcomes.' },
        { source: 'The Verge', text: 'Touch-optimized browser interfaces seeing surge in home dashboard use.' },
        { source: 'Hacker News', text: 'Why choosing a Bento Box layout leads to 40% higher engagement on touch devices.' },
    ];

    return (
        <div className="flex flex-col gap-3 h-full overflow-hidden">
            {headlines.map((item, i) => (
                <div
                    key={i}
                    className="group flex gap-3 p-3 bg-white/40 hover:bg-white/80 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/60"
                >
                    <div className="min-w-[4px] h-auto bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">
                            {item.source}
                        </span>
                        <p className="text-sm font-bold leading-tight text-slate-700 line-clamp-2">
                            {item.text}
                        </p>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
            ))}
        </div>
    );
};

export default NewsTicker;
