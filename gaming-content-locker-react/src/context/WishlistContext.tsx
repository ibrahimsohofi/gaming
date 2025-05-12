import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { GAME_RESOURCES } from '@/data/games';
import type { GameResource } from '@/types/games';

// Define the context type
interface WishlistContextType {
  wishlistItems: GameResource[];
  addToWishlist: (gameId: string) => void;
  removeFromWishlist: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;
  wishlistCount: number;
}

// Create the context with default values
const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistCount: 0,
});

// Create a provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<GameResource[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist) as string[];
      const items = GAME_RESOURCES.filter(game => wishlistIds.includes(game.id));
      setWishlistItems(items);
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    const wishlistIds = wishlistItems.map(item => item.id);
    localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
  }, [wishlistItems]);

  // Add a game to the wishlist
  const addToWishlist = (gameId: string) => {
    const gameToAdd = GAME_RESOURCES.find(game => game.id === gameId);
    if (gameToAdd && !isInWishlist(gameId)) {
      setWishlistItems(prev => [...prev, gameToAdd]);
    }
  };

  // Remove a game from the wishlist
  const removeFromWishlist = (gameId: string) => {
    setWishlistItems(prev => prev.filter(game => game.id !== gameId));
  };

  // Check if a game is in the wishlist
  const isInWishlist = (gameId: string) => {
    return wishlistItems.some(game => game.id === gameId);
  };

  // Context value
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use the wishlist context
export function useWishlist() {
  return useContext(WishlistContext);
}
