import { useState, useEffect } from "react";
import "./App.css";
import MemoryMatch from "./components/games/MemoryMatch";
import QuickQuiz from "./components/games/QuickQuiz";
import ReactionTest from "./components/games/ReactionTest";
import GameModal from "./components/ui/GameModal";
import ContentDisplay from "./components/content/ContentDisplay";
import Homepage from "./components/ui/Homepage";

// Content definitions
export interface ContentDefinition {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
}

const CONTENT_ITEMS: ContentDefinition[] = [
  {
    id: "premium-wallpapers",
    name: "Premium Wallpapers",
    description: "High-quality gaming wallpapers for your desktop",
    previewImage: "wallpaper-preview.jpg"
  },
  {
    id: "exclusive-guides",
    name: "Exclusive Strategy Guides",
    description: "In-depth guides for popular games",
    previewImage: "guide-preview.jpg"
  },
  {
    id: "character-skins",
    name: "Character Skins",
    description: "Exclusive character appearances and customizations",
    previewImage: "skin-preview.jpg"
  }
];

function App() {
  // State for showing homepage or main content
  const [showHomepage, setShowHomepage] = useState(true);

  // State for managing unlocked content
  const [unlockedContent, setUnlockedContent] = useState<string[]>([]);

  // State for active game modal
  const [activeGame, setActiveGame] = useState<{
    type: "memory" | "quiz" | "reaction";
    contentToUnlock: string;
  } | null>(null);

  // State for content display modal
  const [viewingContent, setViewingContent] = useState<string | null>(null);

  // Load unlocked content from localStorage on initial render
  useEffect(() => {
    const savedContent = localStorage.getItem('unlockedContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        if (Array.isArray(parsedContent)) {
          setUnlockedContent(parsedContent);
        }
      } catch (e) {
        console.error('Error parsing saved content:', e);
      }
    }
  }, []);

  // Save unlocked content to localStorage when it changes
  useEffect(() => {
    if (unlockedContent.length > 0) {
      localStorage.setItem('unlockedContent', JSON.stringify(unlockedContent));
    }
  }, [unlockedContent]);

  // Handle unlocking content when a game is completed successfully
  const handleGameComplete = (success: boolean) => {
    if (success && activeGame) {
      if (!unlockedContent.includes(activeGame.contentToUnlock)) {
        setUnlockedContent([...unlockedContent, activeGame.contentToUnlock]);
      }
      // Don't close the modal immediately to allow the user to see the success message
      setTimeout(() => {
        setActiveGame(null);
      }, 3000);
    } else if (!success) {
      // Keep modal open for retry if failed
    }
  };

  // Render the active game
  const renderGame = () => {
    if (!activeGame) return null;

    switch (activeGame.type) {
      case "memory":
        return <MemoryMatch onGameComplete={handleGameComplete} />;
      case "quiz":
        return <QuickQuiz onGameComplete={handleGameComplete} />;
      case "reaction":
        return <ReactionTest onGameComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  // Get game name for modal title
  const getGameTitle = () => {
    if (!activeGame) return "";

    switch (activeGame.type) {
      case "memory":
        return "Memory Match Challenge";
      case "quiz":
        return "Gaming Knowledge Quiz";
      case "reaction":
        return "Reaction Speed Test";
      default:
        return "";
    }
  };

  if (showHomepage) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 py-4 px-6 shadow-lg">
          <h1 className="text-3xl font-bold text-purple-500">Gaming Content Locker</h1>
        </header>

        <Homepage
          onStartExperience={() => setShowHomepage(false)}
          unlockedContentCount={unlockedContent.length}
          totalContentCount={CONTENT_ITEMS.length}
        />

        <footer className="bg-gray-800 py-4 px-6 text-center text-gray-400">
          <p>© 2025 Gaming Content Locker - Unlock premium gaming content through gameplay</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 px-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-500">Gaming Content Locker</h1>
            <p className="text-gray-400">Play games to unlock exclusive content!</p>
          </div>
          <button
            onClick={() => setShowHomepage(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Home
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="grid md:grid-cols-2 gap-8">
          {/* Games Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Available Games</h2>
            <div className="grid grid-cols-1 gap-4">
              <GameCard
                title="Memory Match"
                description="Test your memory by matching pairs of cards."
                onPlay={() => setActiveGame({
                  type: "memory",
                  contentToUnlock: "premium-wallpapers"
                })}
                contentToUnlock="premium-wallpapers"
                isContentUnlocked={unlockedContent.includes("premium-wallpapers")}
              />
              <GameCard
                title="Quick Quiz"
                description="Answer gaming trivia questions correctly to unlock content."
                onPlay={() => setActiveGame({
                  type: "quiz",
                  contentToUnlock: "exclusive-guides"
                })}
                contentToUnlock="exclusive-guides"
                isContentUnlocked={unlockedContent.includes("exclusive-guides")}
              />
              <GameCard
                title="Reaction Test"
                description="Test your reaction speed to unlock exclusive content."
                onPlay={() => setActiveGame({
                  type: "reaction",
                  contentToUnlock: "character-skins"
                })}
                contentToUnlock="character-skins"
                isContentUnlocked={unlockedContent.includes("character-skins")}
              />
            </div>
          </div>

          {/* Content Vault Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Your Content Vault</h2>
            <ContentVault
              unlockedContent={unlockedContent}
              onViewContent={(contentId) => setViewingContent(contentId)}
            />
          </div>
        </section>

        {unlockedContent.length === CONTENT_ITEMS.length && (
          <div className="mt-8 p-6 bg-purple-900 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">🏆 Congratulations! 🏆</h2>
            <p className="text-white text-lg mb-4">You've unlocked all available content!</p>
            <p className="text-gray-300">
              You've proven your gaming skills across all our challenges.
              Feel free to play the games again for fun!
            </p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 py-4 px-6 text-center text-gray-400 mt-12">
        <p>© 2025 Gaming Content Locker - Unlock premium gaming content through gameplay</p>
      </footer>

      {/* Game Modal */}
      <GameModal
        isOpen={activeGame !== null}
        onClose={() => setActiveGame(null)}
        title={getGameTitle()}
      >
        {renderGame()}
      </GameModal>

      {/* Content Display Modal */}
      <GameModal
        isOpen={viewingContent !== null}
        onClose={() => setViewingContent(null)}
        title="Unlocked Content"
      >
        {viewingContent && (
          <ContentDisplay
            contentId={viewingContent}
            onClose={() => setViewingContent(null)}
          />
        )}
      </GameModal>
    </div>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  onPlay: () => void;
  contentToUnlock: string;
  isContentUnlocked: boolean;
}

function GameCard({ title, description, onPlay, contentToUnlock, isContentUnlocked }: GameCardProps) {
  // Find content name from the ID
  const contentName = CONTENT_ITEMS.find(item => item.id === contentToUnlock)?.name || contentToUnlock;

  return (
    <div className={`bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors ${isContentUnlocked ? "" : "game-card-highlight"}`}>
      <h3 className="text-xl font-bold text-purple-300">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Unlocks: <span className="text-yellow-400">{contentName}</span>
        </p>
        <div className="flex items-center">
          {isContentUnlocked && (
            <span className="text-green-400 mr-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Unlocked
            </span>
          )}
          <button
            onClick={onPlay}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            {isContentUnlocked ? "Play Again" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ContentVaultProps {
  unlockedContent: string[];
  onViewContent: (contentId: string) => void;
}

function ContentVault({ unlockedContent, onViewContent }: ContentVaultProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {CONTENT_ITEMS.map(content => (
        <div key={content.id} className="border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{content.name}</h3>
            <div className="flex items-center">
              {unlockedContent.includes(content.id) ? (
                <span className="text-green-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Unlocked
                </span>
              ) : (
                <span className="text-red-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Locked
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-400 my-2">{content.description}</p>
          {unlockedContent.includes(content.id) ? (
            <button
              onClick={() => onViewContent(content.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              View Content
            </button>
          ) : (
            <p className="text-yellow-500 text-sm">Play games to unlock this content!</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
