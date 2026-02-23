import React, { useState, useEffect } from 'react';
import { X, Cloud, Newspaper, Timer, Image as ImageIcon, LayoutGrid, Calculator } from 'lucide-react';
import { FullscreenToggle } from './components/FullscreenToggle';
import CribbageAlchemist from './modules/Cribbage';
import Weather from './modules/Weather';
import NewsTicker from './modules/News';
import KitchenTimer from './modules/Timer';
import PhotoFrame from './modules/Photos';
import QuickLaunch from './modules/Tools';

interface ModuleProps {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  span?: string;
  children: React.ReactNode;
}

const BentoTile: React.FC<ModuleProps & { onFocus: (id: string) => void, isFocused: boolean }> = ({
  id, title, icon: Icon, color, span = "col-span-4", children, onFocus, isFocused
}) => {
  return (
    <div
      className={`bento-tile ${span} ${isFocused ? 'fixed inset-4 md:inset-8 z-50 scale-100 cursor-default' : ''}`}
      onClick={() => !isFocused && onFocus(id)}
      style={{ backgroundColor: isFocused ? 'white' : color }}
    >
      <div className={`p-6 h-full flex flex-col transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-90'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-2xl ${isFocused ? 'bg-slate-50' : 'bg-white/50'}`}>
              <Icon size={24} className="text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
              {!isFocused && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</p>}
            </div>
          </div>
          {isFocused && (
            <button
              onClick={(e) => { e.stopPropagation(); onFocus(''); }}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all shadow-sm"
              aria-label="Close"
            >
              <X size={24} className="text-slate-600" />
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [focusedModule, setFocusedModule] = useState<string | null>(null);

  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err: any) {
        console.warn('Wake Lock request failed:', err.message);
      }
    };

    requestWakeLock();
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(console.error);
      }
    };
  }, []);

  const modules = [
    { id: 'cribbage', title: 'Cribbage', icon: Calculator, color: '#e0faff', span: 'col-span-12 lg:col-span-8 row-span-2', component: CribbageAlchemist },
    { id: 'weather', title: 'Hometown Weather', icon: Cloud, color: '#e0f2ff', span: 'col-span-12 md:col-span-6 lg:col-span-4 row-span-1', component: Weather },
    { id: 'news', title: 'Global News Feed', icon: Newspaper, color: '#e0ffe0', span: 'col-span-12 md:col-span-6 lg:col-span-4 row-span-1', component: NewsTicker },
    { id: 'timer', title: 'Kitchen Timer', icon: Timer, color: '#ffe0f0', span: 'col-span-12 md:col-span-6 lg:col-span-4 row-span-1', component: KitchenTimer },
    { id: 'photos', title: 'Photo Frame', icon: ImageIcon, color: '#f0e0ff', span: 'col-span-12 md:col-span-6 lg:col-span-4 row-span-1', component: PhotoFrame },
    { id: 'tools', title: 'Alchemist', icon: LayoutGrid, color: '#fffde0', span: 'col-span-12 md:col-span-6 lg:col-span-4 row-span-1', component: QuickLaunch },
  ];

  return (
    <div className="min-h-screen bg-hearth-bg overflow-x-hidden selection:bg-blue-100">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pastel-cyan blur-[120px] rounded-full opacity-30 -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-pink blur-[120px] rounded-full opacity-30 -z-10"></div>

      <div className="fixed top-6 right-6 z-40">
        <FullscreenToggle />
      </div>

      <main className="grid grid-cols-12 gap-4 md:gap-6 p-6 md:p-12 mt-12 max-w-[1800px] mx-auto pb-24">
        {modules.map((mod) => (
          <BentoTile
            key={mod.id}
            {...mod}
            isFocused={focusedModule === mod.id}
            onFocus={(id) => setFocusedModule(id)}
          >
            <mod.component />
          </BentoTile>
        ))}
      </main>

      {focusedModule && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setFocusedModule(null)}
        />
      )}

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/40 backdrop-blur-xl px-6 py-3 rounded-3xl border border-white/50 shadow-xl z-30">
        <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Varsendagger LLC © 2026</p>
      </footer>
    </div>
  );
};

export default App;
