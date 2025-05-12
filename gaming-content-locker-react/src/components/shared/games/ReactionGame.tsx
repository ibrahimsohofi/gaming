import { useState, useEffect, useRef } from "react";

interface ReactionGameProps {
  onGameComplete: (success: boolean) => void;
}

export default function ReactionGame({ onGameComplete }: ReactionGameProps) {
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
      // Success if average reaction time is less than 400ms
      onGameComplete(avgTime < 400);
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
            <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Reaction Test</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test your reaction speed! Click the target as soon as it turns green. Complete 5 attempts
              with an average time under 400ms to unlock content.
            </p>
            <button
              onClick={startGame}
              className="px-4 py-2 rounded-md bg-[#00f7ff] text-white font-medium hover:bg-[#00f7ff]/80 transition-colors"
            >
              Start Game
            </button>
          </div>
        );

      case "waiting":
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Get Ready!</h3>
            {countdown > 0 ? (
              <p className="text-2xl font-bold text-yellow-400 mb-6">{countdown}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">Wait for the target to turn green...</p>
                <div
                  className="w-48 h-48 bg-red-500 rounded-lg mx-auto flex items-center justify-center cursor-pointer transition-colors"
                  onClick={handleEarlyClick}
                >
                  <p className="text-white text-lg font-semibold">Wait...</p>
                </div>
              </>
            )}
          </div>
        );

      case "click":
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Click Now!</h3>
            <div
              className="w-48 h-48 bg-green-500 rounded-lg mx-auto flex items-center justify-center cursor-pointer transition-colors"
              onClick={handleClick}
            >
              <p className="text-white text-lg font-semibold">CLICK!</p>
            </div>
          </div>
        );

      case "result":
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Result</h3>

            {reactionTime > 0 ? (
              <p className="text-xl font-bold text-yellow-400 mb-2">
                {reactionTime} ms
              </p>
            ) : (
              <p className="text-base font-bold text-red-400 mb-2">
                Too early! You clicked before the target turned green.
              </p>
            )}

            <p className="text-sm text-muted-foreground mb-4">
              {attempts.length + (reactionTime > 0 ? 1 : 0)} of 5 attempts completed
            </p>

            <button
              onClick={handleNextAttempt}
              className="px-4 py-2 rounded-md bg-[#00f7ff] text-white font-medium hover:bg-[#00f7ff]/80 transition-colors"
            >
              {attempts.length >= 4 && reactionTime > 0 ? "See Results" : "Next Attempt"}
            </button>
          </div>
        );

      case "complete": {
        const validAttempts = attempts.filter(t => t > 0);
        const avgTime = validAttempts.reduce((sum, time) => sum + time, 0) / validAttempts.length;
        const success = avgTime < 400;

        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Test Complete!</h3>

            <p className="text-lg mb-2">
              Average reaction time: <span className="font-semibold">{Math.round(avgTime)} ms</span>
            </p>

            <div className={`text-lg font-semibold mb-2 ${success ? "text-green-500" : "text-red-500"}`}>
              {success
                ? "Great job! Content unlocked!"
                : "Not fast enough. Try again!"}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {success
                ? "Your lightning-fast reflexes have earned you access to exclusive content!"
                : "You need an average reaction time below 400ms to unlock the content."}
            </p>

            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-md bg-[#00f7ff] text-white font-medium hover:bg-[#00f7ff]/80 transition-colors"
            >
              Play Again
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      {renderGameContent()}
    </div>
  );
}
