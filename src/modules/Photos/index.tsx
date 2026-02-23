import React from 'react';

const PhotoFrame: React.FC = () => {
    return (
        <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-100 group">
            <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
                alt="Tech Aesthetic"
                className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">PROJECT ARCHIVE</p>
                <p className="text-sm font-bold text-white leading-tight">VARSENDAGGER OVERLOOK v2.0</p>
            </div>
        </div>
    );
};

export default PhotoFrame;
