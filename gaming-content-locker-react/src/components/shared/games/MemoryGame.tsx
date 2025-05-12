import { useState, useEffect } from "react";

// Game icons for memory cards
const CARD_ICONS = [
  "🎮", "🎯", "🏆", "🎲", "🎧", "🎨", "🎭", "🎪"
];

interface MemoryGameProps {
  onGameComplete: (success: boolean) => void;
}

export default function MemoryGame({ onGameComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Initialize the game with shuffled cards
  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...CARD_ICONS, ...CARD_ICONS]
      .map((icon, index) => ({
        id: index,
        icon,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5); // Shuffle the cards

    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameOver(false);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore clicks if game is over or card is already flipped/matched
    if (gameOver || cards[id].flipped || cards[id].matched) return;

    // Ignore if two cards are already flipped and not checked yet
    if (flippedCards.length === 2) return;

    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);

    // Add card to flipped cards
    setFlippedCards([...flippedCards, id]);
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCardId, secondCardId] = flippedCards;

      if (cards[firstCardId].icon === cards[secondCardId].icon) {
        // Match found
        const updatedCards = [...cards];
        updatedCards[firstCardId].matched = true;
        updatedCards[secondCardId].matched = true;
        setCards(updatedCards);
        setMatchedPairs(matchedPairs + 1);
        setFlippedCards([]);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstCardId].flipped = false;
          updatedCards[secondCardId].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matchedPairs, moves]);

  // Check for game over
  useEffect(() => {
    if (matchedPairs === CARD_ICONS.length && !gameOver) {
      setGameOver(true);
      // Success if completed in less than 15 moves
      const success = moves <= 15;
      // Delay the game complete callback to allow seeing the final state
      setTimeout(() => {
        onGameComplete(success);
      }, 1500);
    }
  }, [matchedPairs, moves, gameOver, onGameComplete]);

  return (
    <div className="flex flex-col items-center py-4">
      <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Memory Match</h3>
      <p className="text-center text-sm text-muted-foreground mb-4">
        Flip cards to find matching pairs. Complete the game in 15 moves or less to unlock content!
      </p>

      <div className="flex justify-between w-full text-sm mb-4">
        <div>Moves: <span className="font-semibold">{moves}</span></div>
        <div>Matches: <span className="font-semibold">{matchedPairs}/{CARD_ICONS.length}</span></div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 max-w-sm">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative h-16 w-16 cursor-pointer rounded-lg transition-transform duration-300 transform ${
              card.flipped || card.matched ? "rotate-y-180" : ""
            } ${gameOver && !card.matched ? "opacity-50" : ""}`}
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => handleCardClick(card.id)}
          >
            {/* Card back (question mark) */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-lg bg-[#00f7ff]/80 text-white backface-hidden ${
                card.flipped || card.matched ? "hidden" : ""
              }`}
            >
              ?
            </div>

            {/* Card front (emoji) */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-lg bg-white text-2xl backface-hidden ${
                card.flipped || card.matched ? "" : "hidden"
              } ${card.matched ? "bg-green-100" : ""}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="text-center mt-2">
          <div className={`text-lg font-semibold ${moves <= 15 ? "text-green-500" : "text-red-500"}`}>
            {moves <= 15 ? "Great job! Content unlocked!" : "Too many moves. Try again!"}
          </div>
          <p className="text-sm text-muted-foreground">
            {moves <= 15
              ? "You've successfully completed the challenge!"
              : `You completed in ${moves} moves. Need 15 or fewer to unlock.`}
          </p>
          <button
            onClick={initializeGame}
            className="mt-4 px-4 py-2 rounded-md bg-[#00f7ff] text-white font-medium hover:bg-[#00f7ff]/80 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
