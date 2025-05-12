import type { GameResource } from "../types/games";

// Interface for locker configuration
export interface LockerConfig {
  // Instead of having multiple campaign IDs, we'll use a single campaign ID
  // and dynamically handle the redirect
  redirectUrl: string;
}

// Single AdBlueMedia campaign ID to use for all games
// IMPORTANT: Replace this with your actual campaign ID from AdBlueMedia dashboard
// This single ID will be used for all game lockers - you don't need separate campaigns!
export const ADBLUE_CAMPAIGN_ID = "cee9bbd";

// Map game IDs to their download URLs
// This allows us to use a single locker but have different download URLs per game
// In a production app, these URLs would point to your actual game files
export const DOWNLOAD_URLS: Record<string, string> = {
  "clash-of-clans": "https://dl.example.com/games/clash-of-clans.apk",
  "free-fire": "https://dl.example.com/games/free-fire.apk",
  "clash-royale": "https://dl.example.com/games/clash-royale.apk",
  "candy-crush": "https://dl.example.com/games/candy-crush.apk",
  "pubg-mobile": "https://dl.example.com/games/pubg-mobile.apk",
  "pokemon-go": "https://dl.example.com/games/pokemon-go.apk",
  "subway-surfers": "https://dl.example.com/games/subway-surfers.apk",
  "genshin-impact": "https://dl.example.com/games/genshin-impact.apk",
  "roblox": "https://dl.example.com/games/roblox.apk",
  "among-us": "https://dl.example.com/games/among-us.apk",
  "minecraft": "https://dl.example.com/games/minecraft.apk",
  "baseball-9": "https://dl.example.com/games/baseball-9.apk"
};

// Helper function to get the download URL for a specific game
export function getDownloadUrl(gameId: string): string {
  return DOWNLOAD_URLS[gameId] || "";
}

// Helper function to get the redirect URL for use with AdBlueMedia locker
// This creates a URL with 'gameId' as a query parameter so we can extract it
// in our redirect handler
export function getRedirectUrl(gameId: string): string {
  // Determine if we're in development or production
  const isProduction = window.location.hostname !== 'localhost';

  if (isProduction) {
    // For production (Vercel deployment)
    return `https://gamevault-six.vercel.app/?game=${encodeURIComponent(gameId)}`;
  } else {
    // For local development
    return `/download-handler?gameId=${encodeURIComponent(gameId)}`;
  }
}

// Helper function to get locker configuration for a game
export function getLockerConfigForGame(game: GameResource): LockerConfig {
  return {
    redirectUrl: getRedirectUrl(game.id)
  };
}

// To set up AdBlueMedia with your campaign:
// 1. Sign up with AdBlueMedia and create a campaign
// 2. Get your campaign ID and replace the ADBLUE_CAMPAIGN_ID above
// 3. Configure the campaign settings in AdBlueMedia dashboard:
//    - Set allowback to true to let users return to your site
//    - Set the callback URL to your domain to receive completion events
//    - Enable events for better tracking and user experience
