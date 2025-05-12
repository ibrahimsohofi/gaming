import { useState, useEffect, useRef } from "react";

interface ReactionTestProps {
  onGameComplete: (success: boolean) => void;
}

export default function ReactionTest({ onGameComplete }: ReactionTestProps) {
  const [gameState, setGameState] = useState<"ready" | "waiting" | "click" | "result" | "complete">("ready");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(3);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start the game
  const startGame = () => {
    setGameState("waiting");
    setCountdown(3);
    setAttempts([]);
  };

  // Handle the countdown timer
  useEffect(() => {
    if (gameState === "waiting") {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
      // Countdown complete, start the reaction test with a random delay
      const randomDelay = 2000 + Math.random() * 3000; // Random delay between 2-5 seconds

      timeoutRef.current = setTimeout(() => {
        setStartTime(Date.now());
        setGameState("click");
      }, randomDelay);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [gameState, countdown]);

  // Handle early click (clicked too soon)
  const handleEarlyClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGameState("result");
    setReactionTime(-1); // Indicates an early click
  };

  // Handle target click
  const handleClick = () => {
    if (gameState === "click") {
      const clickTime = Date.now();
      const time = clickTime - startTime;
      setReactionTime(time);
      setAttempts([...attempts, time]);

      // Show result
      setGameState("result");
    }
  };

  // Handle next attempt
  const handleNextAttempt = () => {
    // If we have 5 valid attempts, complete the game
    if (attempts.length >= 4 && reactionTime > 0) {
      const validAttempts = [...attempts, reactionTime].filter(t => t > 0);
      const avgTime = validAttempts.reduce((sum, time) => sum + time, 0) / validAttempts.length;

      setGameState("complete");
      // Success if average reaction time is less than 500ms
      onGameComplete(avgTime < 500);
    } else {
      setGameState("waiting");
      setCountdown(3);
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameState("ready");
    setAttempts([]);
  };

  // Render the game based on current state
  const renderGameContent = () => {
    switch (gameState) {
      case "ready":
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Reaction Test</h3>
            <p className="text-gray-300 mb-6">
              Test your reaction speed! Click the target as soon as it turns green. Complete 5 attempts
              with an average time under 500ms to unlock content.
            </p>
            <button
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Start Game
            </button>
          </div>
        );

      case "waiting":
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Get Ready!</h3>
            {countdown > 0 ? (
              <p className="text-4xl font-bold text-yellow-400 mb-6">{countdown}</p>
            ) : (
              <>
                <p className="text-gray-300 mb-6">Wait for the target to turn green...</p>
                <div
                  className="reaction-target w-64 h-64 bg-red-600 rounded-lg mx-auto flex items-center justify-center cursor-pointer"
                  onClick={handleEarlyClick}
                >
                  <p className="text-white text-xl font-bold">Wait...</p>
                </div>
              </>
            )}
          </div>
        );

      case "click":
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Click Now!</h3>
            <div
              className="reaction-target active w-64 h-64 bg-green-600 rounded-lg mx-auto flex items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <p className="text-white text-xl font-bold">CLICK!</p>
            </div>
          </div>
        );

      case "result":
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Result</h3>

            {reactionTime > 0 ? (
              <p className="text-2xl font-bold text-yellow-400 mb-2">
                {reactionTime} ms
              </p>
            ) : (
              <p className="text-xl font-bold text-red-400 mb-2">
                Too early! You clicked before the target turned green.
              </p>
            )}

            <p className="text-gray-300 mb-4">
              {attempts.length} of 5 attempts completed
            </p>

            <button
              onClick={handleNextAttempt}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {attempts.length >= 4 && reactionTime > 0 ? "See Results" : "Next Attempt"}
            </button>
          </div>
        );

      case "complete": {
        const validAttempts = attempts.filter(t => t > 0);
        const avgTime = validAttempts.reduce((sum, time) => sum + time, 0) / validAttempts.length;
        const success = avgTime < 500;

        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Game Complete!</h3>

            <p className="text-xl mb-2">
              Average reaction time: <span className="font-bold">{Math.round(avgTime)} ms</span>
            </p>

            <div className={`text-xl font-bold mb-4 ${success ? "text-green-400" : "text-red-400"}`}>
              {success
                ? "Congratulations! Content Unlocked!"
                : "Not fast enough. Try again!"}
            </div>

            <p className="text-gray-300 mb-6">
              {success
                ? "Your lightning-fast reflexes have earned you access to exclusive content."
                : "You need an average reaction time below 500ms to unlock the content."}
            </p>

            <button
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      {renderGameContent()}
    </div>
  );
}
