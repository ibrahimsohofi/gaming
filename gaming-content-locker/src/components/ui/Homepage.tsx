import React from 'react';

interface HomepageProps {
  onStartExperience: () => void;
  unlockedContentCount: number;
  totalContentCount: number;
}

const Homepage: React.FC<HomepageProps> = ({
  onStartExperience,
  unlockedContentCount,
  totalContentCount
}) => {
  return (
    <main className="container mx-auto p-6 flex flex-col items-center">
      <div className="max-w-3xl bg-gray-800 rounded-lg p-8 shadow-lg text-center mt-8 animate-fade-in">
        <h2 className="text-4xl font-bold mb-6 text-purple-400">Welcome to Gaming Content Locker</h2>

        <div className="relative mb-8">
          <div className="w-full h-64 bg-gradient-to-r from-purple-800 to-blue-900 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[url('https://placehold.co/1200x800/purple/dark')] bg-cover bg-center"></div>
            <div className="z-10 text-white text-2xl font-bold">Unlock Exclusive Gaming Content</div>
          </div>
        </div>

        <p className="text-lg mb-6">
          Get access to exclusive gaming wallpapers, strategy guides, and character skins by playing fun mini-games!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FeatureCard
            title="Memory Match"
            icon="🎮"
            description="Test your memory skills by matching pairs of cards"
          />
          <FeatureCard
            title="Gaming Quiz"
            icon="🎯"
            description="Answer gaming trivia questions to unlock content"
          />
          <FeatureCard
            title="Reaction Test"
            icon="⚡"
            description="Test your reaction speed to unlock exclusive skins"
          />
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-purple-300">Your Progress</h3>
          <p className="mb-2">You've unlocked {unlockedContentCount} out of {totalContentCount} items</p>
          <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
            <div
              className="bg-purple-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(unlockedContentCount / totalContentCount) * 100}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={onStartExperience}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-xl font-semibold transition-colors shadow-lg animate-pulse"
        >
          Start Gaming
        </button>
      </div>
    </main>
  );
};

// Helper component for feature cards
const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({
  title,
  description,
  icon
}) => (
  <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-purple-300">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default Homepage;
