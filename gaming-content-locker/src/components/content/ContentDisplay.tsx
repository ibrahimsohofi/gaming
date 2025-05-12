import { useState } from "react";

export interface ContentItem {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  contentType: "image" | "text" | "video" | "download";
  content: string;
}

interface ContentDisplayProps {
  contentId: string;
  onClose: () => void;
}

// Sample content data
const CONTENT_DATA: Record<string, ContentItem> = {
  "premium-wallpapers": {
    id: "premium-wallpapers",
    name: "Premium Gaming Wallpapers",
    description: "High-quality gaming wallpapers for your desktop",
    contentType: "image",
    content: `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Gaming Setup" class="rounded-lg w-full h-auto" />
        <p class="text-sm text-gray-400 mt-2">Epic Gaming Setup</p>
      </div>
      <div>
        <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Retro Gaming" class="rounded-lg w-full h-auto" />
        <p class="text-sm text-gray-400 mt-2">Retro Gaming Classic</p>
      </div>
      <div>
        <img src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Gaming Controller" class="rounded-lg w-full h-auto" />
        <p class="text-sm text-gray-400 mt-2">Controller Art</p>
      </div>
      <div>
        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Futuristic Gaming" class="rounded-lg w-full h-auto" />
        <p class="text-sm text-gray-400 mt-2">Futuristic Gaming Experience</p>
      </div>
    </div>`
  },
  "exclusive-guides": {
    id: "exclusive-guides",
    name: "Exclusive Strategy Guides",
    description: "In-depth guides for popular games",
    contentType: "text",
    content: `<div class="prose prose-invert max-w-none">
      <h2>Advanced Gaming Strategies</h2>
      <p>Welcome to our exclusive strategy guide for mastering competitive gaming! These tips and tricks are designed to help you improve your gameplay and rise through the ranks.</p>

      <h3>1. Master the Fundamentals</h3>
      <p>Before attempting advanced techniques, make sure you have a solid grasp of the basic mechanics:</p>
      <ul>
        <li>Learn the controls thoroughly</li>
        <li>Understand the game's objectives and scoring system</li>
        <li>Practice movement and positioning</li>
        <li>Develop muscle memory for common actions</li>
      </ul>

      <h3>2. Study the Meta</h3>
      <p>Every competitive game has a "meta" - the most effective tactics available at any given time:</p>
      <ul>
        <li>Follow professional players and tournaments</li>
        <li>Join community forums to stay updated on strategy developments</li>
        <li>Experiment with popular builds/loadouts/characters</li>
        <li>Understand counter-strategies for common approaches</li>
      </ul>

      <h3>3. Develop Game Sense</h3>
      <p>Game sense refers to your awareness and decision-making during gameplay:</p>
      <ul>
        <li>Track opponent positions and patterns</li>
        <li>Manage resources effectively</li>
        <li>Time your actions strategically</li>
        <li>Predict opponent moves based on the situation</li>
      </ul>

      <h3>4. Optimize Your Setup</h3>
      <p>Your hardware and settings can significantly impact your performance:</p>
      <ul>
        <li>Ensure stable internet connection</li>
        <li>Configure controls and sensitivity to your preference</li>
        <li>Optimize graphics settings for performance</li>
        <li>Use quality peripherals if possible</li>
      </ul>

      <h3>5. Mental Conditioning</h3>
      <p>The psychological aspect of gaming is often overlooked:</p>
      <ul>
        <li>Practice mindfulness to stay focused</li>
        <li>Develop resilience to setbacks</li>
        <li>Take breaks to prevent burnout</li>
        <li>Analyze your mistakes without getting frustrated</li>
      </ul>
    </div>`
  },
  "character-skins": {
    id: "character-skins",
    name: "Exclusive Character Skins",
    description: "Unique character appearances and customizations",
    contentType: "image",
    content: `<div class="space-y-6">
      <div>
        <h3 class="text-xl font-bold text-purple-400 mb-2">Legendary Warrior Skin</h3>
        <div class="bg-gray-700 rounded-lg p-4">
          <img src="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Warrior Skin" class="rounded-lg w-full h-auto mb-3" />
          <div class="flex justify-between items-center">
            <p class="text-gray-300">A legendary skin for warrior class characters, featuring enhanced armor and special effects.</p>
            <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">Download</button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-purple-400 mb-2">Stealth Assassin Skin</h3>
        <div class="bg-gray-700 rounded-lg p-4">
          <img src="https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Assassin Skin" class="rounded-lg w-full h-auto mb-3" />
          <div class="flex justify-between items-center">
            <p class="text-gray-300">A premium skin for assassin class characters with unique shadows and movement animations.</p>
            <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">Download</button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-purple-400 mb-2">Mystic Mage Skin</h3>
        <div class="bg-gray-700 rounded-lg p-4">
          <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Mage Skin" class="rounded-lg w-full h-auto mb-3" />
          <div class="flex justify-between items-center">
            <p class="text-gray-300">An exclusive skin for mage class characters with custom spell effects and animations.</p>
            <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">Download</button>
          </div>
        </div>
      </div>
    </div>`
  }
};

export default function ContentDisplay({ contentId, onClose }: ContentDisplayProps) {
  const contentItem = CONTENT_DATA[contentId];
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  if (!contentItem) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold text-red-400 mb-4">Content Not Found</h3>
        <p className="text-gray-300 mb-6">The content you're looking for doesn't exist or hasn't been created yet.</p>
        <button
          onClick={onClose}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">{contentItem.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div
          className="content-container"
          dangerouslySetInnerHTML={{ __html: contentItem.content }}
        />
      )}

      <div className="mt-6 flex justify-between">
        <span className="text-sm text-gray-400">
          Content ID: {contentItem.id}
        </span>

        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
