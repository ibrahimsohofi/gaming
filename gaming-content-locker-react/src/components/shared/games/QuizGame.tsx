import { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}

interface QuizGameProps {
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
  {
    id: 6,
    question: "Which game was the first major Battle Royale game?",
    options: ["Fortnite", "PUBG", "H1Z1", "Apex Legends"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question: "What gaming console has sold the most units worldwide?",
    options: ["PlayStation 2", "Nintendo Switch", "Xbox 360", "Nintendo Wii"],
    correctAnswer: 0,
  },
];

export default function QuizGame({ onGameComplete }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Initialize the quiz with 5 random questions
  useEffect(() => {
    // Shuffle questions and select 5 of them
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  // Handle answer selection
  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return; // Prevent selection after answer is shown

    setSelectedOption(optionIndex);
    setShowAnswer(true);

    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (optionIndex === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
      // Success if score is 4 or higher (out of 5)
      onGameComplete(score >= 4);
    }
  };

  // Reset the quiz
  const resetQuiz = () => {
    // Shuffle and get new questions
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));

    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowAnswer(false);
    setQuizComplete(false);
  };

  if (questions.length === 0) {
    return <div className="text-center py-4">Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (quizComplete) {
    return (
      <div className="flex flex-col items-center py-4">
        <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Quiz Complete!</h3>

        <div className="text-center mb-4">
          <p className="text-lg mb-2">
            Your score: <span className="font-semibold">{score}/{questions.length}</span>
          </p>

          <div className={`text-lg font-semibold mb-2 ${score >= 4 ? "text-green-500" : "text-red-500"}`}>
            {score >= 4 ? "Great job! Content unlocked!" : "Not enough correct answers. Try again!"}
          </div>

          <p className="text-sm text-muted-foreground">
            {score >= 4
              ? "Your gaming knowledge has earned you access to exclusive content!"
              : "You need to answer at least 4 questions correctly to unlock content."}
          </p>
        </div>

        <button
          onClick={resetQuiz}
          className="mt-4 px-4 py-2 rounded-md bg-[#00f7ff] text-white font-medium hover:bg-[#00f7ff]/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-4">
      <h3 className="text-lg font-semibold mb-2 text-[#00f7ff]">Gaming Quiz</h3>

      <div className="flex justify-between text-sm mb-4">
        <div>Question {currentQuestionIndex + 1}/{questions.length}</div>
        <div>Score: <span className="font-semibold">{score}</span></div>
      </div>

      <div className="bg-gray-800/60 p-4 rounded-lg mb-6">
        <h4 className="text-base font-medium mb-4">{currentQuestion.question}</h4>

        <div className="space-y-2">
          {currentQuestion.options.map((option, optionIndex) => (
            <div
              key={`${currentQuestion.id}-option-${optionIndex}`}
              onClick={() => handleOptionSelect(optionIndex)}
              className={`
                p-3 border rounded-lg cursor-pointer transition-colors
                ${selectedOption === optionIndex ? "border-[#00f7ff] bg-[#00f7ff]/10" : "border-gray-700 hover:border-gray-500"}
                ${showAnswer && optionIndex === currentQuestion.correctAnswer ? "border-green-500 bg-green-500/10" : ""}
                ${showAnswer && selectedOption === optionIndex && optionIndex !== currentQuestion.correctAnswer ? "border-red-500 bg-red-500/10" : ""}
              `}
            >
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-gray-600">
                  {String.fromCharCode(65 + optionIndex)}
                </div>
                <div>{option}</div>
              </div>
            </div>
          ))}
        </div>

        {showAnswer && (
          <div className="mt-4">
            <div className={`text-sm font-medium ${selectedOption === currentQuestion.correctAnswer ? "text-green-500" : "text-red-400"}`}>
              {selectedOption === currentQuestion.correctAnswer
                ? "Correct! 🎮"
                : `Incorrect. The correct answer is ${currentQuestion.options[currentQuestion.correctAnswer]}.`}
            </div>
          </div>
        )}
      </div>

      {showAnswer && (
        <button
          onClick={handleNextQuestion}
          className="px-4 py-2 rounded-md bg-[#00f7ff] text-white font-medium hover:bg-[#00f7ff]/80 transition-colors"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "View Results"}
        </button>
      )}
    </div>
  );
}
