import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const KitchenTimer: React.FC = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('hearth-timer');
        if (saved) {
            const { time, running, lastUpdate } = JSON.parse(saved);
            if (running) {
                const elapsed = Math.floor((Date.now() - lastUpdate) / 1000);
                const remaining = Math.max(0, time - elapsed);
                setSeconds(remaining);
                if (remaining > 0) setIsActive(true);
            } else {
                setSeconds(time);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('hearth-timer', JSON.stringify({
            time: seconds,
            running: isActive,
            lastUpdate: Date.now()
        }));

        if (isActive && seconds > 0) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0 && isActive) {
            setIsActive(false);
            // Logic for alarm could go here
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, seconds]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setSeconds(0);
    };

    const addTime = (mins: number) => setSeconds(s => s + mins * 60);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-6xl font-black text-slate-800 tracking-tighter tabular-nums">
                {formatTime(seconds)}
            </div>

            <div className="flex gap-2 w-full">
                {[1, 5, 10].map(m => (
                    <button
                        key={m}
                        onClick={() => addTime(m)}
                        className="flex-1 py-3 bg-white/60 hover:bg-white border border-white/40 rounded-2xl font-bold text-slate-700 transition-all shadow-sm"
                    >
                        +{m}m
                    </button>
                ))}
            </div>

            <div className="flex gap-4 w-full">
                <button
                    onClick={toggle}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl font-black text-lg transition-all shadow-md ${isActive ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    {isActive ? 'PAUSE' : 'START'}
                </button>
                <button
                    onClick={reset}
                    className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
};

export default KitchenTimer;
