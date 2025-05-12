import { useState, useEffect } from "react";

// Game icons for memory cards
const CARD_ICONS = [
  "🎮", "🎯", "🏆", "🎲", "🎧", "🎨", "🎭", "🎪"
];

interface MemoryMatchProps {
  onGameComplete: (success: boolean) => void;
}

export default function MemoryMatch({ onGameComplete }: MemoryMatchProps) {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
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
    setGameStarted(true);
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
    if (gameStarted && matchedPairs === CARD_ICONS.length) {
      setGameOver(true);
      // Success if completed in less than 15 moves
      const success = moves <= 15;
      onGameComplete(success);
    }
  }, [matchedPairs, moves, gameStarted, onGameComplete]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Memory Match</h3>
        <p className="text-gray-300 mb-6">Flip cards to find matching pairs. Complete the game in 15 moves or less to unlock content!</p>
        <button
          onClick={initializeGame}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold text-purple-400 mb-2">Memory Match</h3>

      <div className="flex justify-between w-full mb-4">
        <div className="text-gray-300">Moves: <span className="font-bold">{moves}</span></div>
        <div className="text-gray-300">Matches: <span className="font-bold">{matchedPairs}/{CARD_ICONS.length}</span></div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6 max-w-md">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card relative h-20 w-20 cursor-pointer bg-gray-700 rounded-lg ${
              card.flipped || card.matched ? "flipped" : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="memory-card-back absolute inset-0 flex items-center justify-center bg-purple-600 rounded-lg text-gray-300 text-sm">
              ?
            </div>
            <div className="memory-card-front absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg text-4xl">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="text-center">
          <h4 className={`text-xl font-bold mb-2 ${moves <= 15 ? "text-green-400" : "text-red-400"}`}>
            {moves <= 15 ? "Success! Content Unlocked!" : "Try Again!"}
          </h4>
          <p className="text-gray-300 mb-4">
            {moves <= 15
              ? "Congratulations! You've completed the game efficiently."
              : `You completed the game in ${moves} moves. Try again and complete in 15 or fewer moves to unlock content.`}
          </p>
          <button
            onClick={initializeGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
