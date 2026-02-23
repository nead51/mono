import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudSnow } from 'lucide-react';

const Weather: React.FC = () => {
    const [weatherData, setWeatherData] = useState<any[]>([]);

    useEffect(() => {
        // Placeholder data for the requested locations
        setWeatherData([
            { id: 1, location: 'Malden, MA', temp: 42, condition: 'Partly Cloudy', icon: Cloud },
            { id: 2, location: 'Victor, MT', temp: 25, condition: 'Snow', icon: CloudSnow },
            { id: 3, location: 'Santa Fe, TN', temp: 58, condition: 'Sunny', icon: Sun },
            { id: 4, location: 'San Antonio, TX', temp: 72, condition: 'Clear', icon: Sun }
        ]);
    }, []);

    if (!weatherData.length) return null;

    return (
        <div className="h-full bg-gradient-to-br from-blue-50/50 to-indigo-50/30 -m-6 p-4 rounded-bento border border-white/60 overflow-hidden flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-3 h-full">
                {weatherData.map((loc) => {
                    const Icon = loc.icon;
                    return (
                        <div key={loc.id} className="bg-white/60 backdrop-blur-md p-4 rounded-[24px] border border-white/80 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02]">
                            <h3 className="text-[9px] font-black text-blue-900/60 uppercase tracking-[0.2em] leading-tight line-clamp-1">{loc.location}</h3>
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{loc.temp}°</div>
                                    <div className="text-[11px] font-extrabold text-blue-800/70 mt-1 uppercase tracking-wider">{loc.condition}</div>
                                </div>
                                <Icon size={24} className={loc.condition.includes('Sun') || loc.condition.includes('Clear') ? "text-amber-400" : "text-blue-400"} strokeWidth={2.5} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Weather;
