import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  HeartOff,
  Download,
  Gamepad2,
  ArrowLeft,
  SlidersHorizontal,
  Trash2
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

export function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [sortBy, setSortBy] = useState("newest"); // newest, rating, title

  // Handle sort logic
  const sortedWishlistItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "title":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        // Assume newer games have the 'new' flag
        if (a.new && !b.new) return -1;
        if (!a.new && b.new) return 1;
        return b.unlocks - a.unlocks; // Fall back to popularity if not new
    }
  });

  // Check if games are unlocked
  const isGameUnlocked = (gameId: string) => {
    return localStorage.getItem(`unlocked_${gameId}`) === 'true';
  };

  return (
    <div className="container-custom py-20">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-[#00f7ff] mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="mr-3 h-6 w-6 text-[#00f7ff]" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-1">Games you've saved for later</p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-[#00f7ff]/30 bg-transparent text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]/50"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rating</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedWishlistItems.map(game => (
            <Card key={game.id} className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(0,247,255,0.2)] transition-all duration-300 flex flex-col group">
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

                {/* Remove from wishlist button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWishlist(game.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{game.description}</p>

                <div className="flex justify-between items-center mt-auto mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{game.rating}/5</span>
                  </div>
                  <span className="text-xs text-muted-foreground">By {game.developer}</span>
                </div>

                <Link to={`/games/${game.id}`} className="w-full">
                  <Button
                    className={`w-full ${isGameUnlocked(game.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'btn-primary'}`
                    }
                  >
                    {isGameUnlocked(game.id) ? (
                      <>
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        Play Now
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-[#00f7ff]/20 rounded-lg">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mt-4 mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Save your favorite games to wishlist so you can download them later
          </p>
          <Link to="/categories">
            <Button className="btn-primary mt-2">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Browse Categories
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
