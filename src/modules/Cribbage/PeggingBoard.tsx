import React from 'react';

interface PeggingBoardProps {
    p1Score: number;
    p2Score: number;
}

// A classic cribbage board runs 0 → 121.
// We'll render it as two parallel tracks of holes (0–120, skipping 0),
// with the board doubling back so it is compact.
// Track layout: col A (p1 forward, 1-60), col B (p1 back, 61-120+finish)
// Same for p2 (mirrored underneath)

const TOTAL = 120;
const HOLES_PER_LEG = 30;  // 30 holes per leg, 5 per section

// Returns the grid [col, row] position for a given hole number 1-120
// Board layout: 4 legs of 30 holes arranged as 2 rows × 2 cols
// Leg 0: col 0, rows 0-29 (holes 1-30, going down)
// Leg 1: col 1, rows 29-0 (holes 31-60, going up)
// Leg 2: col 2, rows 0-29 (holes 61-90, going down)
// Leg 3: col 3, rows 29-0 (holes 91-120, going up)

function holePos(hole: number): { x: number; y: number } {
    if (hole <= 0) return { x: -20, y: -20 }; // off-board (starting peg)
    if (hole > 120) hole = 120;
    const idx = hole - 1; // 0-based
    const leg = Math.floor(idx / HOLES_PER_LEG);
    const posInLeg = idx % HOLES_PER_LEG;
    const col = leg;
    const row = leg % 2 === 0 ? posInLeg : (HOLES_PER_LEG - 1 - posInLeg);

    const PAD = 18;
    const HOLE_GAP = 8;
    const LEG_GAP = 26;

    // x based on column (leg), y based on row within leg
    const x = PAD + col * LEG_GAP;
    const y = PAD + row * HOLE_GAP;

    return { x, y };
}

const PeggingBoard: React.FC<PeggingBoardProps> = ({ p1Score, p2Score }) => {
    const W = 100 + 18 * 2; // 4 legs × 26 + padding
    const H = 30 * 8 + 18 * 2; // 30 holes × 8px + padding

    // Render all holes, then overlay pegs
    const renderHoles = (player: 'p1' | 'p2') => {
        const holes = [];
        const offsetX = player === 'p1' ? 6 : -6;
        for (let h = 1; h <= TOTAL; h++) {
            const pos = holePos(h);
            holes.push(
                <circle
                    key={`${player}-hole-${h}`}
                    cx={pos.x + offsetX}
                    cy={pos.y}
                    r={2.5}
                    fill="none"
                    stroke={player === 'p1' ? 'rgba(59,130,246,0.3)' : 'rgba(236,72,153,0.3)'}
                    strokeWidth={0.5}
                />
            );
        }
        return holes;
    };

    const renderSectionMarkers = () => {
        const marks = [];
        for (let h = 5; h <= TOTAL; h += 5) {
            const pos = holePos(h);
            const isMajor = h % 10 === 0;
            marks.push(
                <text
                    key={`mark-${h}`}
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    fontSize={isMajor ? 4 : 3}
                    fill={h === 91 ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.15)'}
                    fontWeight="bold"
                >{h}</text>
            );
        }
        return marks;
    };

    // Render pegs - each player has 2 pegs (front and back for leapfrog)
    // Front peg = current score, back peg = previous score position
    const renderPegs = (score: number, player: 'p1' | 'p2') => {
        if (score <= 0) return null;
        const color = player === 'p1' ? '#60a5fa' : '#f472b6';
        const offsetX = player === 'p1' ? 6 : -6;
        const pos = holePos(Math.min(score, 120));
        return (
            <g>
                {/* Outer glow */}
                <circle
                    cx={pos.x + offsetX}
                    cy={pos.y}
                    r={5}
                    fill={color}
                    opacity={0.15}
                />
                {/* Peg */}
                <circle
                    cx={pos.x + offsetX}
                    cy={pos.y}
                    r={3.5}
                    fill={color}
                    stroke="white"
                    strokeWidth={0.8}
                />
            </g>
        );
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex w-full justify-between px-1">
                <span className="text-blue-400">Dustin</span>
                <span className="text-[8px] text-slate-500">Pegging Board</span>
                <span className="text-pink-400">Tawnya</span>
            </div>
            <div className="bg-amber-950/80 rounded-xl border border-amber-900/40 shadow-lg overflow-hidden"
                style={{ width: W * 2.5, height: H * 2.5 }}
            >
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    width={W * 2.5}
                    height={H * 2.5}
                    style={{ display: 'block' }}
                >
                    {/* Background wood grain lines */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <line key={i} x1={0} y1={i * (H / 20)} x2={W} y2={i * (H / 20) + 2}
                            stroke="rgba(255,255,255,0.02)" strokeWidth={2} />
                    ))}
                    {/* Section labels */}
                    {renderSectionMarkers()}
                    {/* Holes */}
                    {renderHoles('p1')}
                    {renderHoles('p2')}
                    {/* Skunk line at 91 */}
                    {(() => {
                        const pos = holePos(91);
                        return (
                            <line
                                x1={pos.x - 12} y1={pos.y}
                                x2={pos.x + 12} y2={pos.y}
                                stroke="rgba(251,191,36,0.5)"
                                strokeWidth={0.8}
                                strokeDasharray="2,1"
                            />
                        );
                    })()}
                    {/* Pegs */}
                    {renderPegs(p2Score, 'p2')}
                    {renderPegs(p1Score, 'p1')}
                    {/* Score labels */}
                    <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={5}
                        fill="rgba(255,255,255,0.3)" fontWeight="bold"
                    >{p1Score} — {p2Score}</text>
                    {/* Win indicator */}
                    {(p1Score >= 121 || p2Score >= 121) && (
                        <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={8}
                            fill="rgba(251,191,36,0.9)" fontWeight="bold"
                        >🏆 WIN!</text>
                    )}
                </svg>
            </div>
        </div>
    );
};

export default PeggingBoard;
