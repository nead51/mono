import { useState } from 'react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    id: string; // e.g., '10♠'
    rank: Rank;
    suit: Suit;
    value: number; // 1-10 for pegging/15s
    order: number; // 1-13 for runs
}

type Phase = 'deal' | 'discard' | 'cut' | 'pegging' | 'show' | 'game_over';
type Player = 'p1' | 'p2';

export const useCribbageEngine = () => {
    const [phase, setPhase] = useState<Phase>('deal');
    const [dealer, setDealer] = useState<Player>('p1');
    const [activePlayer, setActivePlayer] = useState<Player>('p2'); // Non-dealer starts
    const [score, setScore] = useState({ p1: 0, p2: 0 });
    const [history, setHistory] = useState<string[]>(['Welcome to Cribbage. Waiting to deal.']);

    const [deck, setDeck] = useState<Card[]>([]);
    const [p1Hand, setP1Hand] = useState<Card[]>([]);
    const [p2Hand, setP2Hand] = useState<Card[]>([]);
    const [crib, setCrib] = useState<Card[]>([]);
    const [starterCard, setStarterCard] = useState<Card | null>(null);

    const [p1Discarded, setP1Discarded] = useState<Card[]>([]);
    const [p2Discarded, setP2Discarded] = useState<Card[]>([]);
    const [p1Ready, setP1Ready] = useState(false);
    const [p2Ready, setP2Ready] = useState(false);

    // Pegging State
    const [peggingCards, setPeggingCards] = useState<{ card: Card, player: Player }[]>([]);
    const [runningTotal, setRunningTotal] = useState(0);
    const [goCount, setGoCount] = useState({ p1: false, p2: false });
    const [p1PegHand, setP1PegHand] = useState<Card[]>([]);
    const [p2PegHand, setP2PegHand] = useState<Card[]>([]);

    const addLog = (msg: string) => {
        setHistory(prev => [msg, ...prev].slice(0, 10));
    };

    const addScore = (player: Player, pts: number, reason: string) => {
        if (pts === 0) return;
        setScore(s => {
            const newScore = s[player] + pts;
            if (newScore >= 121) {
                setPhase('game_over');
                addLog(`${player === 'p1' ? 'Dustin' : 'Tawnya'} wins!`);
            }
            return { ...s, [player]: newScore };
        });
        addLog(`${player === 'p1' ? 'Dustin' : 'Tawnya'} +${pts} (${reason})`);
    };

    const createDeck = (): Card[] => {
        const suits: Suit[] = ['♠', '♥', '♦', '♣'];
        const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const newDeck: Card[] = [];
        suits.forEach(suit => {
            ranks.forEach((rank, idx) => {
                newDeck.push({
                    id: `${rank}${suit}`,
                    rank,
                    suit,
                    value: Math.min(idx + 1, 10),
                    order: idx + 1
                });
            });
        });
        // Fisher-Yates shuffle
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    };

    const deal = () => {
        const newDeck = createDeck();
        setP1Hand(newDeck.slice(0, 6));
        setP2Hand(newDeck.slice(6, 12));
        setDeck(newDeck.slice(12));
        setCrib([]);
        setP1Discarded([]);
        setP2Discarded([]);
        setStarterCard(null);
        setPeggingCards([]);
        setRunningTotal(0);
        setGoCount({ p1: false, p2: false });
        setP1Ready(false);
        setP2Ready(false);

        setPhase('discard');
        addLog('Hands dealt. Select 2 cards for the crib.');
    };

    const discardToCrib = (player: Player, card: Card) => {
        if (phase !== 'discard') return;

        if (player === 'p1') {
            if (p1Discarded.find(c => c.id === card.id)) {
                setP1Discarded(prev => prev.filter(c => c.id !== card.id));
            } else if (p1Discarded.length < 2) {
                setP1Discarded(prev => [...prev, card]);
            }
        } else {
            if (p2Discarded.find(c => c.id === card.id)) {
                setP2Discarded(prev => prev.filter(c => c.id !== card.id));
            } else if (p2Discarded.length < 2) {
                setP2Discarded(prev => [...prev, card]);
            }
        }
    };

    const confirmDiscard = (player: Player) => {
        if (player === 'p1' && p1Discarded.length === 2) {
            setP1Ready(true);
            if (p2Ready) proceedToCut();
        }
        if (player === 'p2' && p2Discarded.length === 2) {
            setP2Ready(true);
            if (p1Ready) proceedToCut();
        }
    };

    const proceedToCut = () => {
        // Both discarded
        const newCrib = [...p1Discarded, ...p2Discarded];
        setCrib(newCrib);

        const finalP1 = p1Hand.filter(c => !p1Discarded.find(d => d.id === c.id));
        const finalP2 = p2Hand.filter(c => !p2Discarded.find(d => d.id === c.id));
        setP1Hand(finalP1);
        setP2Hand(finalP2);
        setP1PegHand(finalP1);
        setP2PegHand(finalP2);

        setPhase('cut');
        addLog('Crib formed. Tap deck to cut.');
    };

    const cutDeck = () => {
        if (phase !== 'cut') return;
        const starter = deck[0];
        setStarterCard(starter);
        addLog(`Starter card is ${starter.id}`);
        if (starter.rank === 'J') {
            addScore(dealer, 2, 'Two for his heels');
        }
        // Starter card counts toward running total from the start
        setRunningTotal(starter.value);
        setPeggingCards([{ card: starter, player: 'p1' as Player }]); // sentinel: starter is always first in the stack
        setPhase('pegging');
        setActivePlayer(dealer === 'p1' ? 'p2' : 'p1');
        addLog('Pegging begins. Count includes starter card.');
    };

    // --- Pegging Logic Simplified ---
    const playPeggingCard = (player: Player, card: Card) => {
        if (phase !== 'pegging' || activePlayer !== player) return;
        if (runningTotal + card.value > 31) return; // invalid play

        const curHand = player === 'p1' ? p1PegHand : p2PegHand;
        const newHand = curHand.filter(c => c.id !== card.id);
        if (player === 'p1') setP1PegHand(newHand);
        else setP2PegHand(newHand);

        const newTotal = runningTotal + card.value;
        const newPeggingCards = [...peggingCards, { card, player }];

        setRunningTotal(newTotal);
        setPeggingCards(newPeggingCards);
        setGoCount({ p1: false, p2: false }); // reset gos on valid play

        // Check Pegging Score
        if (newTotal === 15) addScore(player, 2, 'Fifteen');
        if (newTotal === 31) addScore(player, 2, 'Thirty-One');

        // Check Pairs
        let pairCount = 0;
        for (let i = newPeggingCards.length - 2; i >= 0; i--) {
            if (newPeggingCards[i].card.rank === card.rank) pairCount++;
            else break;
        }
        if (pairCount === 1) addScore(player, 2, 'Pair');
        if (pairCount === 2) addScore(player, 6, 'Triple');
        if (pairCount === 3) addScore(player, 12, 'Quad');

        // Check Runs (simplistic)
        for (let len = newPeggingCards.length; len >= 3; len--) {
            const slice = newPeggingCards.slice(-len).map(c => c.card.order).sort((a, b) => a - b);
            let isRun = true;
            for (let i = 1; i < slice.length; i++) {
                if (slice[i] !== slice[i - 1] + 1) isRun = false;
            }
            if (isRun) {
                addScore(player, len, `Run of ${len}`);
                break;
            }
        }

        if (newTotal === 31) {
            setRunningTotal(0);
            setPeggingCards([]);
        }

        // Next turn
        checkNextPeggingTurn(player === 'p1' ? 'p2' : 'p1', newHand.length, player === 'p1' ? p2PegHand.length : p1PegHand.length);
    };

    const sayGo = (player: Player) => {
        if (phase !== 'pegging' || activePlayer !== player) return;
        const newGos = { ...goCount, [player]: true };
        setGoCount(newGos);

        const opponent = player === 'p1' ? 'p2' : 'p1';

        if (newGos.p1 && newGos.p2) {
            // Both said go
            addScore(opponent, 1, 'Go'); // Last player to play gets the Go pt
            setRunningTotal(0);
            setPeggingCards([]);
            setGoCount({ p1: false, p2: false });
            checkNextPeggingTurn(opponent, p1PegHand.length, p2PegHand.length);
        } else {
            setActivePlayer(opponent);
        }
    };

    const checkNextPeggingTurn = (nextP: Player, p1Len: number, p2Len: number) => {
        if (p1Len === 0 && p2Len === 0) {
            addScore(nextP === 'p1' ? 'p2' : 'p1', 1, 'Last Card');
            setPhase('show');
            addLog('Pegging complete. Tap to score hands.');
            return;
        }

        const nextHand = nextP === 'p1' ? p1PegHand : p2PegHand;
        if (nextHand.length === 0) {
            setActivePlayer(nextP === 'p1' ? 'p2' : 'p1');
        } else {
            setActivePlayer(nextP);
        }
    };

    const scoreShow = () => {
        if (phase !== 'show') return;

        // Extremely simplified hand scoring for prototype
        addLog('Hands Auto-Scored (Mock Logic)');
        addScore(dealer === 'p1' ? 'p2' : 'p1', 4, 'Hand');
        addScore(dealer, 5, 'Hand');
        addScore(dealer, 2, 'Crib');

        setDealer(dealer === 'p1' ? 'p2' : 'p1');
        setPhase('deal');
        addLog('Round complete. Ready to deal.');
    };

    return {
        phase, dealer, activePlayer, score, history, p1Hand, p2Hand, crib,
        starterCard, p1Discarded, p2Discarded, p1PegHand, p2PegHand, runningTotal, peggingCards, p1Ready, p2Ready,
        deal, discardToCrib, confirmDiscard, cutDeck, playPeggingCard, sayGo, scoreShow, setScore
    };
};
