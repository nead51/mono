import React, { useState } from 'react';
import { RefreshCw, User, Users, Award, EyeOff, Eye, Hand } from 'lucide-react';
import { useCribbageEngine, type Card as CardType } from './useCribbageEngine';
import PeggingBoard from './PeggingBoard';

const Card = ({ card, onClick, selected, disabled }: { card: CardType, onClick?: () => void, selected?: boolean, disabled?: boolean }) => (
    <div
        onClick={disabled ? undefined : onClick}
        className={`w-10 h-14 sm:w-16 sm:h-24 bg-white rounded-lg shadow-md border 
        ${selected ? 'border-amber-400 -translate-y-2 ring-2 ring-amber-400/50' : 'border-slate-200'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
        flex flex-col items-center justify-center transition-all select-none`}
    >
        <span className={`text-sm sm:text-lg font-black ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-slate-800'}`}>
            {card.rank}
        </span>
        <span className={`text-xs sm:text-2xl ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-slate-800'}`}>
            {card.suit}
        </span>
    </div>
);

const CardBack = ({ onClick }: { onClick?: () => void }) => (
    <div
        onClick={onClick}
        className="w-16 h-24 bg-blue-900 rounded-lg shadow-md border-2 border-white/20 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-all select-none gap-1"
    >
        <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 border-t-2 border-r-2 border-white/60 rotate-45 translate-x-[-2px]" />
        </div>
        <span className="text-white/60 text-[9px] font-black uppercase tracking-widest text-center leading-tight px-1">Flip Top Card</span>
    </div>
);

const CribbageAlchemist: React.FC = () => {
    const engine = useCribbageEngine();

    const [p1Visible, setP1Visible] = useState(false);
    const [p2Visible, setP2Visible] = useState(false);

    const renderPlayerHand = (player: 'p1' | 'p2', visible: boolean, setVisible: (v: boolean) => void) => {
        const hand = player === 'p1' ? engine.p1Hand : engine.p2Hand;
        const pegHand = player === 'p1' ? engine.p1PegHand : engine.p2PegHand;
        const discarded = player === 'p1' ? engine.p1Discarded : engine.p2Discarded;
        const colorTitle = player === 'p1' ? 'text-blue-400' : 'text-pink-400';
        const colorBg = player === 'p1' ? 'bg-blue-50/50 border-blue-200/50' : 'bg-pink-50/50 border-pink-200/50';

        const isActive = engine.phase === 'pegging' && engine.activePlayer === player;

        return (
            <div
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed relative select-none touch-none ${colorBg} ${isActive ? 'ring-4 ring-amber-300 ring-offset-2 bg-white' : ''}`}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className={`absolute top-3 ${player === 'p1' ? 'left-3' : 'right-3'} flex items-center gap-2 ${colorTitle}`}>
                    {player === 'p1' && (visible ? <Eye size={16} /> : <EyeOff size={16} />)}
                    <span className="text-[10px] uppercase font-bold tracking-widest">{player === 'p1' ? "Dustin's Hand" : "Tawnya's Hand"}</span>
                    {player === 'p2' && (visible ? <Eye size={16} /> : <EyeOff size={16} />)}
                </div>

                {engine.phase === 'deal' || engine.phase === 'game_over' ? (
                    <div className="text-slate-400/50 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm">Waiting...</div>
                ) : visible ? (
                    <div className="flex gap-1 sm:gap-2 mt-4 transition-all">
                        {engine.phase === 'discard' && hand.map(c => (
                            <Card
                                key={c.id}
                                card={c}
                                selected={!!discarded.find(d => d.id === c.id)}
                                onClick={() => engine.discardToCrib(player, c)}
                            />
                        ))}
                        {engine.phase === 'pegging' && pegHand.map(c => (
                            <Card
                                key={c.id}
                                card={c}
                                disabled={engine.activePlayer !== player || engine.runningTotal + c.value > 31}
                                onClick={() => {
                                    engine.playPeggingCard(player, c);
                                    setVisible(false);
                                }}
                            />
                        ))}
                        {(engine.phase === 'cut' || engine.phase === 'show') && hand.map(c => (
                            <Card key={c.id} card={c} />
                        ))}
                        <button
                            onClick={() => setVisible(false)}
                            className={`absolute bottom-3 ${player === 'p1' ? 'right-3' : 'left-3'} py-1 px-3 ${player === 'p1' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'} rounded-full text-xs font-black shadow-sm z-10 flex items-center gap-1 active:scale-95`}
                        >
                            <EyeOff size={12} /> Hide
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setVisible(true)}
                        className={`px-6 py-4 rounded-2xl ${player === 'p1' ? 'bg-blue-100/50 hover:bg-blue-100 text-blue-800' : 'bg-pink-100/50 hover:bg-pink-100 text-pink-800'} font-bold uppercase tracking-[0.2em] text-sm sm:text-base border ${player === 'p1' ? 'border-blue-200' : 'border-pink-200'} shadow-sm transition-all active:scale-95 flex items-center gap-2`}
                    >
                        <Eye size={18} /> Tap to Peek
                    </button>
                )}

                {engine.phase === 'discard' && discarded.length === 2 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setVisible(false); engine.confirmDiscard(player); }}
                        disabled={player === 'p1' ? engine.p1Ready : engine.p2Ready}
                        className={`absolute bottom-3 ${player === 'p1' ? 'left-3' : 'right-3'} py-2 px-4 ${player === 'p1' ? (engine.p1Ready ? 'bg-blue-200 text-blue-500' : 'bg-blue-600 text-white') : (engine.p2Ready ? 'bg-pink-200 text-pink-500' : 'bg-pink-500 text-white')} rounded-full text-xs font-black shadow-md z-10 transition-all active:scale-95`}
                    >
                        {(player === 'p1' ? engine.p1Ready : engine.p2Ready) ? 'Ready' : 'To Crib'}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-full">
            <div className="flex-1 bg-amber-50/50 rounded-3xl border border-amber-200/50 p-4 sm:p-6 flex flex-col justify-between relative">

                {/* Score Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg transition-all ${engine.dealer === 'p1' ? 'ring-4 ring-amber-400/50' : ''} ${engine.score.p1 >= 121 ? 'bg-green-500' : 'bg-blue-600'}`}>
                            <User size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                Dustin {engine.dealer === 'p1' && <span className="text-amber-500">(Dealer)</span>}
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-800 tabular-nums leading-none">{engine.score.p1}</div>
                        </div>
                    </div>

                    <div className="hidden sm:flex h-px flex-1 mx-8 bg-amber-200/30 items-center justify-center relative"></div>

                    <div className="flex items-center gap-3 text-right">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-pink-600">
                                Tawnya {engine.dealer === 'p2' && <span className="text-amber-500">(Dealer)</span>}
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-800 tabular-nums leading-none">{engine.score.p2}</div>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg transition-all ${engine.dealer === 'p2' ? 'ring-4 ring-amber-400/50' : ''} ${engine.score.p2 >= 121 ? 'bg-green-500' : 'bg-pink-500'}`}>
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                {/* Interactive Card Board */}
                <div className="flex-1 bg-white/40 rounded-2xl border border-amber-200/50 shadow-inner flex flex-col gap-3 p-4 mb-6 min-h-0">
                    {/* Top row: Player hands + center control pillar */}
                    <div className="flex gap-3 flex-1 min-h-0">
                        {renderPlayerHand('p1', p1Visible, setP1Visible)}

                        {/* Center Control Pillar */}
                        <div className="w-24 shrink-0 bg-slate-800/90 rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 border-t border-slate-700 relative overflow-hidden">
                            {engine.phase === 'deal' && (
                                <button onClick={engine.deal} className="bg-amber-500 text-white rounded-full p-2 hover:scale-110 shadow-lg transition-transform flex flex-col items-center gap-1 w-16 h-16 justify-center">
                                    <Hand size={20} />
                                    <span className="text-[10px] uppercase font-black tracking-widest leading-none">Deal</span>
                                </button>
                            )}
                            {engine.phase === 'discard' && (
                                <div className="text-white/40 text-[10px] uppercase font-black tracking-widest text-center px-2">Select 2 cards each</div>
                            )}
                            {engine.phase === 'cut' && (
                                <div className="scale-75" onClick={engine.cutDeck}>
                                    <CardBack />
                                </div>
                            )}
                            {engine.phase === 'pegging' && (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black">Total</span>
                                    <span className="text-white font-black text-5xl leading-none">{engine.runningTotal}</span>
                                </div>
                            )}
                            {engine.phase === 'show' && engine.starterCard && (
                                <div className="scale-75 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 italic text-[10px] text-white z-10 font-bold bg-black/50 px-2 rounded-full">Starter</div>
                                    <Card card={engine.starterCard} disabled />
                                </div>
                            )}
                        </div>

                        {renderPlayerHand('p2', p2Visible, setP2Visible)}
                    </div>

                    {/* Pegging Stack — visible to both players */}
                    {engine.phase === 'pegging' && (
                        <div className="shrink-0 bg-slate-700/30 rounded-xl border border-slate-200/20 p-3 flex flex-col gap-2">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Played Cards</div>
                            <div className="flex flex-wrap gap-1.5 justify-center items-end min-h-[60px]">
                                {engine.peggingCards.map((entry, i) => (
                                    <div key={i} className="relative flex flex-col items-center gap-0.5">
                                        {i === 0 && (
                                            <span className="text-[8px] text-amber-400 font-black uppercase tracking-wide">Starter</span>
                                        )}
                                        {i > 0 && (
                                            <span className="text-[8px] text-white/30 font-bold">
                                                {entry.player === 'p1' ? 'D' : 'T'}
                                            </span>
                                        )}
                                        <Card card={entry.card} disabled />
                                    </div>
                                ))}
                                {engine.peggingCards.length === 0 && (
                                    <div className="text-slate-500/50 text-xs font-bold">No cards played yet</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>


                {/* Contextual Action Bar */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    {engine.phase === 'pegging' && (
                        <>
                            <button
                                onClick={() => engine.sayGo('p1')}
                                disabled={engine.activePlayer !== 'p1'}
                                className={`flex-1 min-w-[30%] py-3 rounded-xl font-black text-sm transition-all shadow-sm ${engine.activePlayer === 'p1' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                                Dustin: GO
                            </button>
                            <button
                                onClick={() => engine.sayGo('p2')}
                                disabled={engine.activePlayer !== 'p2'}
                                className={`flex-1 min-w-[30%] py-3 rounded-xl font-black text-sm transition-all shadow-sm ${engine.activePlayer === 'p2' ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                                Tawnya: GO
                            </button>
                        </>
                    )}
                    {engine.phase === 'show' && (
                        <button
                            onClick={engine.scoreShow}
                            className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl font-black text-sm transition-all shadow-sm"
                        >
                            Score Hands & Continue
                        </button>
                    )}
                    <button
                        onClick={() => { engine.setScore({ p1: 0, p2: 0 }); engine.deal(); }}
                        className="p-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all active:scale-95 ml-auto"
                        aria-label="Reset Match"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Sidebar: Pegging Board + Log */}
            <div className="w-full xl:w-64 bg-slate-900 rounded-3xl p-5 flex flex-col gap-4 min-h-[160px]">
                {/* Pegging Board */}
                <PeggingBoard p1Score={engine.score.p1} p2Score={engine.score.p2} />

                {/* Log */}
                <div className="flex items-center gap-2 text-amber-400">
                    <Award size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Log</h3>
                </div>
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {engine.history.map((log, i) => (
                        <div key={i} className={`text-[10px] font-bold leading-tight pb-2 border-b border-white/5 last:border-0 ${i === 0 ? 'text-white' : 'text-slate-400'}`}>
                            <span className="text-white/20 mr-1">[{engine.history.length - i}]</span>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CribbageAlchemist;
