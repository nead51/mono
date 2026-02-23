import React, { useState, useEffect } from 'react';
import { Sun, Wind } from 'lucide-react';

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        // Placeholder fetching logic
        // In a real app, this would call OpenWeatherMap with API Key
        setWeather({
            temp: 42,
            condition: 'Partly Cloudy',
            location: 'Malden, MA',
            high: 48,
            low: 32,
            wind: 12
        });
    }, []);

    if (!weather) return null;

    return (
        <div className="flex flex-col justify-between h-full bg-blue-50/30 -m-6 p-6 rounded-bento border border-blue-100/50">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-4xl font-black text-blue-900 tracking-tighter">{weather.temp}°</div>
                    <div className="text-blue-800 font-bold opacity-80">{weather.condition}</div>
                </div>
                <Sun size={48} className="text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200/30">
                <div className="flex items-center gap-2">
                    <Wind size={16} className="text-blue-400" />
                    <span className="text-sm font-bold text-blue-900/60">{weather.wind} mph</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-blue-900/40 uppercase tracking-widest">H: {weather.high}° L: {weather.low}°</span>
                </div>
            </div>
        </div>
    );
};

export default Weather;
