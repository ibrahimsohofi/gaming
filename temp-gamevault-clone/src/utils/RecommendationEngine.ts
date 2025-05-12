import { GAME_RESOURCES } from "@/data/games";
import type { GameResource } from "@/types/games";

// Calculate similarity score between two games
export function getGameSimilarity(game1: GameResource, game2: GameResource): number {
  let score = 0;

  // Same category is a strong indicator (3 points)
  if (game1.category === game2.category) {
    score += 3;
  }

  // Similar rating (within 0.5 points) (1 point)
  if (Math.abs(game1.rating - game2.rating) <= 0.5) {
    score += 1;
  }

  // Same developer (2 points)
  if (game1.developer === game2.developer) {
    score += 2;
  }

  // Shared platforms (0.5 points per shared platform)
  const sharedPlatforms = game1.platforms.filter(platform =>
    game2.platforms.includes(platform)
  ).length;
  score += sharedPlatforms * 0.5;

  return score;
}

// Get recommendations based on a single game
export function getRecommendationsForGame(gameId: string, limit = 4): GameResource[] {
  const game = GAME_RESOURCES.find(g => g.id === gameId);

  if (!game) return [];

  return GAME_RESOURCES
    .filter(g => g.id !== gameId)
    .map(g => ({
      game: g,
      score: getGameSimilarity(game, g)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.game);
}

// Get personalized recommendations based on user's wishlist and downloads
export function getPersonalizedRecommendations(
  limit = 8,
  excludeIds: string[] = []
): GameResource[] {
  // Step 1: Get user's wishlist and downloaded games
  const wishlistIds: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const downloadedGameIds: string[] = GAME_RESOURCES
    .filter(game => localStorage.getItem(`unlocked_${game.id}`) === 'true')
    .map(game => game.id);

  // Combine wishlist and downloads for preference analysis
  const userPreferenceIds = [...new Set([...wishlistIds, ...downloadedGameIds])];

  // If user has no preferences yet, return popular games
  if (userPreferenceIds.length === 0) {
    return GAME_RESOURCES
      .filter(game => !excludeIds.includes(game.id))
      .sort((a, b) => b.unlocks - a.unlocks)
      .slice(0, limit);
  }

  // Step 2: Get user's preference games
  const preferenceGames = GAME_RESOURCES.filter(game =>
    userPreferenceIds.includes(game.id)
  );

  // Step 3: Score all other games against user preferences
  const recommendations = GAME_RESOURCES
    .filter(game =>
      !userPreferenceIds.includes(game.id) &&
      !excludeIds.includes(game.id)
    )
    .map(game => {
      // Calculate a similarity score based on all preference games
      let totalScore = 0;

      preferenceGames.forEach(preferenceGame => {
        totalScore += getGameSimilarity(game, preferenceGame);
      });

      // Average score based on number of preferences
      const averageScore = totalScore / preferenceGames.length;

      return {
        game,
        score: averageScore
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.game);

  // If not enough recommendations from similarity, fill with popular games
  if (recommendations.length < limit) {
    const existingIds = recommendations.map(game => game.id);
    const remainingPopular = GAME_RESOURCES
      .filter(game =>
        !userPreferenceIds.includes(game.id) &&
        !existingIds.includes(game.id) &&
        !excludeIds.includes(game.id)
      )
      .sort((a, b) => b.unlocks - a.unlocks)
      .slice(0, limit - recommendations.length);

    return [...recommendations, ...remainingPopular];
  }

  return recommendations;
}

// Get recommendations by category
export function getRecommendationsByCategory(
  category: string,
  limit = 4,
  excludeIds: string[] = []
): GameResource[] {
  return GAME_RESOURCES
    .filter(game =>
      game.category === category &&
      !excludeIds.includes(game.id)
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Get trending games (high unlock rate)
export function getTrendingGames(
  limit = 4,
  excludeIds: string[] = []
): GameResource[] {
  return GAME_RESOURCES
    .filter(game => !excludeIds.includes(game.id))
    .sort((a, b) => b.unlocks - a.unlocks)
    .slice(0, limit);
}

// Get new releases
export function getNewReleases(
  limit = 4,
  excludeIds: string[] = []
): GameResource[] {
  return GAME_RESOURCES
    .filter(game =>
      game.new === true &&
      !excludeIds.includes(game.id)
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Get recommendations for a specific user action (e.g. after downloading a game)
export function getActionBasedRecommendations(
  actionType: 'download' | 'wishlist',
  gameId: string,
  limit = 4
): GameResource[] {
  const game = GAME_RESOURCES.find(g => g.id === gameId);

  if (!game) return [];

  // If user downloaded a game, recommend similar games
  if (actionType === 'download') {
    return getRecommendationsForGame(gameId, limit);
  }

  // If user wishlisted a game, recommend games from same category
  if (actionType === 'wishlist') {
    return GAME_RESOURCES
      .filter(g =>
        g.id !== gameId &&
        g.category === game.category
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  return [];
}
