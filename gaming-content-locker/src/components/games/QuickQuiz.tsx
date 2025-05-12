import { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}

interface QuickQuizProps {
  onGameComplete: (success: boolean) => void;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which game franchise features a character named Master Chief?",
    options: ["Call of Duty", "Halo", "Destiny", "Gears of War"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "In which year was the first Super Mario Bros. game released?",
    options: ["1985", "1983", "1987", "1990"],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "Which company developed Fortnite?",
    options: ["Activision", "Blizzard", "Epic Games", "Electronic Arts"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "Which of these is NOT a Pokemon type?",
    options: ["Dragon", "Ghost", "Sound", "Steel"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is the name of the protagonist in The Legend of Zelda series?",
    options: ["Zelda", "Link", "Ganon", "Navi"],
    correctAnswer: 1,
  },
];

export default function QuickQuiz({ onGameComplete }: QuickQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Initialize game
  const startQuiz = () => {
    // Shuffle questions so the quiz is different each time
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setQuizComplete(false);
    setGameStarted(true);
  };

  // Handle answer selection
  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return; // Prevent selection after answer is shown

    setSelectedOption(optionIndex);
    setShowAnswer(true);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
    }
  };

  // Check for game completion
  useEffect(() => {
    if (quizComplete) {
      // Success if score is 4 or higher (out of 5)
      const success = score >= 4;
      onGameComplete(success);
    }
  }, [quizComplete, score, onGameComplete]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Gaming Quiz</h3>
        <p className="text-gray-300 mb-6">
          Test your gaming knowledge! Answer at least 4 out of 5 questions correctly to unlock content.
        </p>
        <button
          onClick={startQuiz}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Quiz Complete!</h3>

        <div className="text-center mb-6">
          <p className="text-xl mb-2">
            Your score: <span className="font-bold">{score}/{shuffledQuestions.length}</span>
          </p>

          <div className={`text-xl font-bold ${score >= 4 ? "text-green-400" : "text-red-400"}`}>
            {score >= 4 ? "Congratulations! Content Unlocked!" : "Not quite there yet. Try again!"}
          </div>

          <p className="text-gray-300 mt-2">
            {score >= 4
              ? "Your gaming knowledge has earned you access to exclusive content."
              : "You need to answer at least 4 questions correctly to unlock the content."}
          </p>
        </div>

        <button
          onClick={startQuiz}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">Gaming Quiz</h3>

      <div className="mb-2 text-sm text-gray-400">
        Question {currentQuestionIndex + 1}/{shuffledQuestions.length}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h4 className="text-xl text-gray-100 mb-4">{currentQuestion.question}</h4>

        <div className="space-y-2 mb-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`
                quiz-option p-3 border border-gray-700 rounded-lg cursor-pointer
                ${selectedOption === index ? "selected" : ""}
                ${showAnswer && index === currentQuestion.correctAnswer ? "correct" : ""}
                ${showAnswer && selectedOption === index && index !== currentQuestion.correctAnswer ? "incorrect" : ""}
              `}
            >
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-gray-600">
                  {String.fromCharCode(65 + index)}
                </div>
                <div>{option}</div>
              </div>
            </div>
          ))}
        </div>

        {showAnswer && (
          <div className="mb-4">
            <div className={`text-${selectedOption === currentQuestion.correctAnswer ? "green" : "red"}-400 font-semibold`}>
              {selectedOption === currentQuestion.correctAnswer
                ? "Correct! 🎮"
                : `Incorrect. The correct answer is ${currentQuestion.options[currentQuestion.correctAnswer]}.`}
            </div>
          </div>
        )}

        {showAnswer && (
          <button
            onClick={handleNextQuestion}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            {currentQuestionIndex < shuffledQuestions.length - 1 ? "Next Question" : "See Results"}
          </button>
        )}
      </div>

      <div className="text-sm text-gray-400">
        Current score: {score}/{currentQuestionIndex + (showAnswer ? 1 : 0)}
      </div>
    </div>
  );
}
