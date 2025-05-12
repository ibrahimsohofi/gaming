import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, Filter, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { GAME_RESOURCES } from "@/data/games";
import type { GameResource } from "@/types/games";

// Game categories with their counts
const GAME_CATEGORIES = [
  { id: "all", name: "All Games", count: GAME_RESOURCES.length },
  { id: "featured", name: "Featured", count: GAME_RESOURCES.filter((game: GameResource) => game.featured).length },
  { id: "new", name: "New Releases", count: GAME_RESOURCES.filter((game: GameResource) => game.new).length },
  { id: "action", name: "Action", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "action").length },
  { id: "adventure", name: "Adventure", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "adventure").length },
  { id: "puzzle", name: "Puzzle", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "puzzle").length },
  { id: "racing", name: "Racing", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "racing").length },
  { id: "rpg", name: "RPG", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "rpg").length },
  { id: "shooter", name: "Shooter", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "shooter").length },
  { id: "simulation", name: "Simulation", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "simulation").length },
  { id: "sports", name: "Sports", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "sports").length },
  { id: "strategy", name: "Strategy", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "strategy").length },
  { id: "sandbox", name: "Sandbox", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "sandbox").length },
  { id: "runner", name: "Runner", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "runner").length },
  { id: "social", name: "Social", count: GAME_RESOURCES.filter((game: GameResource) => game.category === "social").length },
];

// Platforms available in the dataset
const PLATFORMS = ["Android", "iOS", "PC", "PlayStation", "Xbox", "Switch", "Windows", "macOS"];

// For grid view icon
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

// For list view icon
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export function GameCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterView, setFilterView] = useState("grid"); // grid, list
  const [showFilters, setShowFilters] = useState(false);
  const [filteredGames, setFilteredGames] = useState<GameResource[]>(GAME_RESOURCES);
  const [sortBy, setSortBy] = useState("popular"); // popular, rating, newest, name

  // Advanced filters
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Apply filtering when filters change
  useEffect(() => {
    let result = [...GAME_RESOURCES];

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "featured") {
        result = result.filter((game: GameResource) => game.featured);
      } else if (selectedCategory === "new") {
        result = result.filter((game: GameResource) => game.new);
      } else {
        result = result.filter((game: GameResource) => game.category === selectedCategory);
      }
    }

    // Filter by featured/new checkboxes (these can be applied on top of category filters)
    if (showFeaturedOnly) {
      result = result.filter((game: GameResource) => game.featured);
    }

    if (showNewOnly) {
      result = result.filter((game: GameResource) => game.new);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game: GameResource) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.category.toLowerCase().includes(query) ||
          game.developer.toLowerCase().includes(query)
      );
    }

    // Filter by rating range
    result = result.filter(
      (game: GameResource) => game.rating >= ratingRange[0] && game.rating <= ratingRange[1]
    );

    // Filter by platforms
    if (selectedPlatforms.length > 0) {
      result = result.filter(
        (game: GameResource) => game.platforms.some((platform: string) => selectedPlatforms.includes(platform))
      );
    }

    // Sort results
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.unlocks - a.unlocks);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredGames(result);
  }, [
    selectedCategory,
    searchQuery,
    ratingRange,
    selectedPlatforms,
    sortBy,
    showFeaturedOnly,
    showNewOnly
  ]);

  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setRatingRange([0, 5]);
    setSelectedPlatforms([]);
    setSortBy("popular");
    setShowFeaturedOnly(false);
    setShowNewOnly(false);
  };

  return (
    <div className="py-20">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-2">Game Categories</h1>
        <p className="text-muted-foreground mb-8">Browse games by category, platform, rating and more</p>

        {/* Top Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          {/* Search Input */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search games by title, developer, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#00f7ff]/30 focus-visible:ring-[#00f7ff]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden md:flex items-center mr-4">
              <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-[#00f7ff]/30 bg-transparent text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]/50"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters {showFilters ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
            </Button>

            <div className="hidden md:flex border border-[#00f7ff]/30 rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 rounded-none ${filterView === 'grid' ? 'bg-[#00f7ff]/10' : ''}`}
                onClick={() => setFilterView("grid")}
              >
                <GridIcon />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 rounded-none ${filterView === 'list' ? 'bg-[#00f7ff]/10' : ''}`}
                onClick={() => setFilterView("list")}
              >
                <ListIcon />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 border border-[#00f7ff]/20 rounded-lg bg-card/70 backdrop-blur-sm animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center text-[#00f7ff]">
                <Filter className="mr-2 h-5 w-5" />
                Advanced Filters
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs border-[#00f7ff]/30 hover:bg-[#00f7ff]/10"
              >
                Reset All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating Range Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3">Rating</h4>
                <div className="px-2">
                  <Slider
                    value={ratingRange}
                    min={0}
                    max={5}
                    step={0.1}
                    onValueChange={setRatingRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{ratingRange[0].toFixed(1)}</span>
                    <span>to</span>
                    <span>{ratingRange[1].toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.ceil(ratingRange[1]) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3">Platforms</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map(platform => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${platform}`}
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={() => togglePlatform(platform)}
                      />
                      <Label htmlFor={`platform-${platform}`} className="text-sm cursor-pointer">
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <h4 className="text-sm font-medium mb-3">Game Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={showFeaturedOnly}
                      onCheckedChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
                    />
                    <Label htmlFor="featured" className="cursor-pointer flex items-center">
                      <span className="text-sm mr-2">Featured Games</span>
                      <Badge className="bg-[#00f7ff] text-primary-foreground">
                        {GAME_RESOURCES.filter((game: GameResource) => game.featured).length}
                      </Badge>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new"
                      checked={showNewOnly}
                      onCheckedChange={() => setShowNewOnly(!showNewOnly)}
                    />
                    <Label htmlFor="new" className="cursor-pointer flex items-center">
                      <span className="text-sm mr-2">New Releases</span>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {GAME_RESOURCES.filter((game: GameResource) => game.new).length}
                      </Badge>
                    </Label>
                  </div>

                  <div className="md:hidden mt-4">
                    <h4 className="text-sm font-medium mb-2">Sort By</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-md border border-[#00f7ff]/30 bg-transparent text-sm py-2 px-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]/50"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rating</option>
                      <option value="newest">Newest First</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <div className="mb-4 md:mb-6 overflow-x-auto pb-2">
            <TabsList className="h-auto p-1 bg-muted inline-flex min-w-max">
              {GAME_CATEGORIES.map(category => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground px-4 py-2"
                >
                  {category.name} <span className="ml-1 text-xs opacity-70">({category.count})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredGames.length}</span> games
            {selectedCategory !== "all" && (
              <span> in <span className="text-[#00f7ff]">{GAME_CATEGORIES.find(c => c.id === selectedCategory)?.name}</span></span>
            )}
            {searchQuery && (
              <span> matching "<span className="text-[#00f7ff]">{searchQuery}</span>"</span>
            )}
          </div>
        </div>

        {/* Games Grid or List */}
        {filteredGames.length > 0 ? (
          <div className={filterView === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredGames.map(game => (
              filterView === "grid" ? (
                <GameCard key={game.id} game={game} />
              ) : (
                <GameListItem key={game.id} game={game} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#00f7ff]/20 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold">No games found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <Button
              onClick={resetFilters}
              className="mt-4 btn-primary"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Game Card Component for Grid View
function GameCard({ game }: { game: GameResource }) {
  const isUnlocked = localStorage.getItem(`unlocked_${game.id}`) === 'true';

  return (
    <Card className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm card-hover group transition-all duration-300 h-full flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {game.featured && (
          <Badge className="absolute top-2 left-2 bg-[#00f7ff] text-primary-foreground">
            Featured
          </Badge>
        )}
        {game.new && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
            New
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-2 left-2 flex items-center">
          <Badge variant="outline" className="bg-black/50 text-white border-none text-xs">
            {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold group-hover:text-[#00f7ff] transition-colors line-clamp-1">{game.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{game.description}</p>

        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground mt-auto">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{game.rating}/5</span>
          </div>
          <span className="text-xs">By {game.developer}</span>
        </div>

        <Link to={`/games/${game.id}`} className="w-full">
          <Button className={`w-full ${isUnlocked ? 'bg-green-600 hover:bg-green-700' : 'btn-primary'}`}>
            {isUnlocked ? 'Play Now' : 'View Game'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Game List Item Component for List View
function GameListItem({ game }: { game: GameResource }) {
  const isUnlocked = localStorage.getItem(`unlocked_${game.id}`) === 'true';

  return (
    <Card className="border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative h-24 md:w-32 overflow-hidden rounded-md flex-shrink-0">
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            {game.featured && (
              <Badge className="absolute top-1 left-1 bg-[#00f7ff] text-primary-foreground text-xs">
                Featured
              </Badge>
            )}
            {game.new && (
              <Badge className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-xs">
                New
              </Badge>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">{game.title}</h3>
              <div className="flex items-center md:ml-auto">
                <Badge variant="outline" className="text-xs border-[#00f7ff]/20 mr-2">
                  {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                </Badge>
                <div className="flex items-center text-yellow-400">
                  <Star className="fill-yellow-400 h-3 w-3 mr-1" />
                  <span className="text-xs">{game.rating}/5</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{game.description}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="text-xs text-muted-foreground">
                <span className="inline-block mr-3">By {game.developer}</span>
                <span className="inline-block">{game.platforms.slice(0, 3).join(", ")}{game.platforms.length > 3 ? "..." : ""}</span>
              </div>

              <div className="flex gap-2 sm:ml-auto">
                <Link to={`/games/${game.id}`} className="flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto border-[#00f7ff]/30 hover:bg-[#00f7ff]/10"
                  >
                    Details
                  </Button>
                </Link>
                <Link to={`/games/${game.id}`} className="flex-1 sm:flex-none">
                  <Button
                    size="sm"
                    className={`w-full sm:w-auto ${isUnlocked ? 'bg-green-600 hover:bg-green-700' : 'btn-primary'}`}
                  >
                    {isUnlocked ? 'Play' : 'Download'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
