import { useState, useEffect, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { GAME_RESOURCES } from "../data/games";
import { AdBlueMediaLockerDialog } from "../components/shared/AdBlueMediaLockerDialog";
import { getRedirectUrl } from "@/data/lockerConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWishlist } from "@/context/WishlistContext";
import {
  ArrowLeft,
  Download,
  Star,
  User,
  CheckCircle2,
  ExternalLink,
  Clock,
  Calendar,
  Tag,
  Layers,
  Trophy,
  Server,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  FileDown,
  Send,
  Sparkles,
  Heart,
  Gamepad2
} from "lucide-react";
import { VerificationDialog } from "@/components/shared/VerificationDialog";

// Fallback screenshots for games with missing screenshots
const DEFAULT_SCREENSHOTS = [
  "/images/games/screenshots/clash-royale-1.jpg",
  "/images/games/screenshots/pubg-mobile-1.jpg",
  "/images/games/screenshots/candy-crush-1.jpg"
];

// Related games suggestions based on category
const getRelatedGames = (currentGameId: string, category: string) => {
  return GAME_RESOURCES
    .filter(game => game.id !== currentGameId && game.category === category)
    .slice(0, 3);
};

// Get games similar to the current game based on multiple factors
const getSimilarGames = (currentGame: typeof GAME_RESOURCES[0]) => {
  // Games are considered similar if they:
  // 1. Share the same developer
  // 2. Have the same category
  // 3. Are in the same rating range (±0.5)
  // 4. Share similar platforms
  // Each factor adds to the similarity score

  return GAME_RESOURCES
    .filter(game => game.id !== currentGame.id)
    .map(game => {
      let similarityScore = 0;

      // Same developer is a strong indicator
      if (game.developer === currentGame.developer) {
        similarityScore += 3;
      }

      // Same category is also important
      if (game.category === currentGame.category) {
        similarityScore += 2;
      }

      // Similar rating (within 0.5 points)
      if (Math.abs(game.rating - currentGame.rating) <= 0.5) {
        similarityScore += 1;
      }

      // Shared platforms
      const sharedPlatforms = game.platforms.filter(platform =>
        currentGame.platforms.includes(platform)
      ).length;

      similarityScore += sharedPlatforms * 0.5;

      return { game, similarityScore };
    })
    .filter(item => item.similarityScore > 0) // Only return games with some similarity
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by highest similarity first
    .slice(0, 4) // Get top 4 similar games
    .map(item => item.game);
};

// Dummy reviews - in a real app these would come from a database
const REVIEWS = [
  {
    id: 1,
    user: "GamerPro123",
    rating: 5,
    comment: "Great gameplay and graphics! Runs smoothly on my device. Highly recommended for everyone.",
    date: "3 days ago"
  },
  {
    id: 2,
    user: "MobileGaming42",
    rating: 4,
    comment: "Very fun to play, took a bit longer to download than expected but everything works well.",
    date: "1 week ago"
  },
  {
    id: 3,
    user: "GameWizard",
    rating: 5,
    comment: "One of the best mobile games I've played this year. Amazing mechanics and responsive controls.",
    date: "2 weeks ago"
  }
];

// User review type
interface UserReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [showLocker, setShowLocker] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Find the game by ID
  const game = GAME_RESOURCES.find(game => game.id === gameId);

  // If game not found, redirect to 404
  useEffect(() => {
    if (!game && gameId) {
      navigate("/not-found");
    }
  }, [game, gameId, navigate]);

  // Load user reviews from localStorage
  useEffect(() => {
    if (gameId) {
      const savedReviews = localStorage.getItem(`reviews_${gameId}`);
      if (savedReviews) {
        setUserReviews(JSON.parse(savedReviews));
      }
    }
  }, [gameId]);

  // Handle screenshot navigation
  const nextScreenshot = () => {
    if (game?.screenshots && game.screenshots.length > 0) {
      setCurrentScreenshot((prev) =>
        prev === game.screenshots.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevScreenshot = () => {
    if (game?.screenshots && game.screenshots.length > 0) {
      setCurrentScreenshot((prev) =>
        prev === 0 ? game.screenshots.length - 1 : prev - 1
      );
    }
  };

  // If game doesn't exist yet (loading state) or wasn't found
  if (!game) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Get screenshots and handle cases with missing screenshots
  const screenshots = game.screenshots && game.screenshots.length > 0
    ? game.screenshots
    : DEFAULT_SCREENSHOTS;

  // Find related games (by category)
  const relatedGames = getRelatedGames(game.id, game.category);

  // Find games like this (based on multiple similarity factors)
  const similarGames = getSimilarGames(game);

  const isDownloaded = localStorage.getItem(`unlocked_${game.id}`) === 'true';
  const inWishlist = isInWishlist(game.id);

  // Toggle wishlist status
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(game.id);
    } else {
      addToWishlist(game.id);
    }
  };

  // Combine dummy reviews with user reviews
  const allReviews = [...REVIEWS, ...userReviews].sort((a, b) => {
    // This will sort with newest first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Handle review submission
  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!reviewName.trim() || !reviewComment.trim()) {
      return; // Don't submit empty reviews
    }

    const newReview: UserReview = {
      id: Date.now(),
      user: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: "Just now"
    };

    const updatedReviews = [...userReviews, newReview];
    setUserReviews(updatedReviews);

    // Save to localStorage
    if (gameId) {
      localStorage.setItem(`reviews_${gameId}`, JSON.stringify(updatedReviews));
    }

    // Reset form
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    setReviewSubmitted(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setReviewSubmitted(false);
    }, 3000);
  };

  // Helper to determine image orientation for styling
  const [imgOrientation, setImgOrientation] = useState<"portrait" | "landscape" | null>(null);

  useEffect(() => {
    // Reset orientation when screenshot changes
    setImgOrientation(null);
    const img = new window.Image();
    img.src = screenshots[currentScreenshot];
    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight) {
        setImgOrientation("landscape");
      } else {
        setImgOrientation("portrait");
      }
    };
    // eslint-disable-next-line
  }, [currentScreenshot, screenshots]);

  // Download button handler
  const handleDownloadClick = () => {
    if (isDownloaded) return;
    setVerifying(true);
  };

  // When verification completes, show locker and hide verifying
  const handleVerificationComplete = () => {
    setVerifying(false);
    setShowLocker(true);
  };

  return (
    <>
      <VerificationDialog
        isOpen={verifying}
        onComplete={handleVerificationComplete}
        onClose={() => setVerifying(false)}
      />
      <AdBlueMediaLockerDialog
        isOpen={showLocker}
        onClose={() => setShowLocker(false)}
        title={`Unlock ${game.title}`}
        description="Complete an offer to download this game and get immediate access."
        contentId={game.id}
        redirectUrl={getRedirectUrl(game.id)}
      />

      <div className="container-custom py-12">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-[#00f7ff] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Games
        </Link>

        {/* Game header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Game image */}
          <div className="lg:w-1/3">
            <div className="relative overflow-hidden rounded-lg shadow-[0_0_30px_rgba(0,247,255,0.2)] border border-[#00f7ff]/20">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
              {game.featured && game.new ? (
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <Badge className="bg-[#00f7ff] text-primary-foreground">
                    Featured
                  </Badge>
                  <Badge className="bg-pink-600 text-white">
                    New
                  </Badge>
                </div>
              ) : game.featured ? (
                <Badge className="absolute top-3 left-3 bg-[#00f7ff] text-primary-foreground">
                  Featured
                </Badge>
              ) : game.new ? (
                <Badge className="absolute top-3 left-3 bg-pink-600 text-white">
                  New
                </Badge>
              ) : null}
            </div>

            {/* Game info card */}
            <div className="mt-4 bg-card/70 backdrop-blur-sm rounded-lg border border-[#00f7ff]/20 p-4">
              <h3 className="text-lg font-semibold mb-3 text-[#00f7ff]">Game Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#00f7ff]" />
                    Category:
                  </span>
                  <span className="text-muted-foreground">{game.category.charAt(0).toUpperCase() + game.category.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#00f7ff]" />
                    Developer:
                  </span>
                  <span className="text-muted-foreground">{game.developer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#00f7ff]" />
                    Released:
                  </span>
                  <span className="text-muted-foreground">{game.publishYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#00f7ff]" />
                    Version:
                  </span>
                  <span className="text-muted-foreground">{game.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#00f7ff]" />
                    Size:
                  </span>
                  <span className="text-muted-foreground">{game.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#00f7ff]" />
                    Age Rating:
                  </span>
                  <span className="text-muted-foreground">{game.ageRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-[#00f7ff]" />
                    Platforms:
                  </span>
                  <span className="text-muted-foreground">Android</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game info */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{game.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline" className="border-[#00f7ff]/40 text-muted-foreground">
                {game.category.toUpperCase()}
              </Badge>
              <div className="flex items-center text-yellow-400">
                <Star className="fill-yellow-400 h-4 w-4 mr-1" />
                <span>{game.rating}/5</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Download className="h-4 w-4 mr-1" />
                <span>{game.unlocks.toLocaleString()} Downloads</span>
              </div>
            </div>

            <p className="text-lg mb-6">{game.description}</p>

            <h3 className="font-semibold text-lg mb-3">Key Features:</h3>
            <ul className="space-y-2 mb-6">
              {game.features.map((feature, index) => (
                <li key={`feature-${index}-${feature.substring(0, 10)}`} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-[#00f7ff] mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-lg mb-3">System Requirements:</h3>
            <p className="text-muted-foreground mb-6">{game.requirements}</p>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {!isDownloaded && (
                  <Button
                    size="lg"
                    className={`px-6 py-6 text-lg ${isDownloaded ? 'bg-green-600 hover:bg-green-700' : 'btn-primary shine-effect'}`}
                    onClick={handleDownloadClick}
                  >
                    <FileDown className="mr-2 h-5 w-5" />
                    {isDownloaded ? 'DOWNLOAD COMPLETE' : 'DOWNLOAD GAME'}
                  </Button>
                )}
                {isDownloaded && (
                  <Button
                    size="lg"
                    className="px-6 py-6 text-lg bg-green-600 hover:bg-green-700"
                    disabled
                  >
                    <FileDown className="mr-2 h-5 w-5" />
                    DOWNLOAD COMPLETE
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className={`px-6 py-6 text-lg border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 ${
                    inWishlist ? 'bg-[#00f7ff]/10' : ''
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-[#00f7ff] text-[#00f7ff]' : 'text-[#00f7ff]'}`}
                  />
                  {inWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                </Button>
              </div>

              {game.storeLink && (
                <a href={game.storeLink} target="_blank" rel="noopener noreferrer" className="md:self-start">
                  <Button variant="outline" size="lg" className="px-6 py-6 text-lg border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 w-full md:w-auto">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    VISIT OFFICIAL SITE
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for additional content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-muted">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              Screenshots
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="related"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              Related
            </TabsTrigger>
            <TabsTrigger
              value="similar"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              Similar
            </TabsTrigger>
          </TabsList>

          {/* Screenshots tab */}
          <TabsContent value="details" className="mt-6">
            <div
              className="screenshot-container max-w-4xl mx-auto mb-4 relative"
              style={{ height: "70vh" }}
            >
              {/* Main screenshot */}
              <img
                src={screenshots[currentScreenshot]}
                alt={`${game.title} screenshot ${currentScreenshot + 1}`}
                className={`w-full h-full transition-all duration-300 ${
                  imgOrientation === "portrait"
                    ? "portrait-img"
                    : imgOrientation === "landscape"
                    ? "landscape-img"
                    : ""
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = game.image;
                }}
              />

              {/* Previous/Next buttons */}
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={prevScreenshot}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextScreenshot}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Current/total indicator */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
                {currentScreenshot + 1} / {screenshots.length}
              </div>
            </div>

            {/* Thumbnail navigation */}
            {screenshots.length > 1 && (
              <div className="thumbnail-container flex gap-2 justify-center mt-2">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={`${game.id}-thumb-${index}`}
                    onClick={() => setCurrentScreenshot(index)}
                    className={`thumbnail w-16 h-16 rounded overflow-hidden border-2 ${
                      currentScreenshot === index
                        ? "border-[#00f7ff] shadow-[0_0_8px_#00f7ff80]"
                        : "border-transparent"
                    } transition-all`}
                    style={{ background: "#18181b" }}
                  >
                    <img
                      src={screenshot}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = game.image;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews tab */}
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Review form for downloaded games */}
              {isDownloaded && (
                <Card className="bg-card/70 backdrop-blur-sm border-[#00f7ff]/20 overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#00f7ff]">Leave Your Review</h3>

                    {reviewSubmitted ? (
                      <div className="bg-green-500/20 border border-green-500/30 text-green-500 rounded-md p-4 mb-4 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span>Thanks for your review! It has been added successfully.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <Input
                            placeholder="Your Name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="bg-background/50 border-[#00f7ff]/20 focus-visible:ring-[#00f7ff]"
                            required
                          />
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <span className="mr-2">Your Rating:</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-5 w-5 ${
                                      star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <Textarea
                            placeholder="Share your thoughts about this game..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="bg-background/50 border-[#00f7ff]/20 focus-visible:ring-[#00f7ff]"
                            rows={4}
                            required
                          />
                        </div>

                        <Button type="submit" className="btn-primary shine-effect">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Review
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Display reviews */}
              {allReviews.map(review => (
                <Card key={review.id} className="bg-card/70 backdrop-blur-sm border-[#00f7ff]/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{review.user}</p>
                        <div className="text-yellow-400 text-sm">
                          {"⭐".repeat(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}

              {/* If no reviews yet */}
              {allReviews.length === 0 && (
                <div className="text-center py-8 border border-dashed border-[#00f7ff]/20 rounded-lg">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {isDownloaded
                      ? "Be the first to review this game!"
                      : "Download this game to leave a review."}
                  </p>
                  {!isDownloaded && (
                    <Button
                      onClick={handleDownloadClick}
                      className="btn-primary shine-effect"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Game
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Related games tab */}
          <TabsContent value="related" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGames.map(relatedGame => (
                <Card key={relatedGame.id} className="bg-card/70 backdrop-blur-sm border-[#00f7ff]/20 overflow-hidden hover:shadow-[0_0_15px_rgba(0,247,255,0.2)] transition-all">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={relatedGame.image}
                      alt={relatedGame.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{relatedGame.title}</h3>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center">
                        <Star className="fill-yellow-400 h-3 w-3 mr-1" />
                        <span>{relatedGame.rating}/5</span>
                      </div>
                      <span className="text-muted-foreground">{relatedGame.unlocks.toLocaleString()} Downloads</span>
                    </div>
                    <Link to={`/games/${relatedGame.id}`}>
                      <Button className="w-full btn-primary" size="sm">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Similar games tab */}
          <TabsContent value="similar" className="mt-6">
            <div className="border-b border-[#00f7ff]/20 pb-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 text-[#00f7ff] mr-2" />
                Games Like {game.title}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (based on developer, category, and rating)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarGames.length > 0 ? (
                similarGames.map(similarGame => (
                  <Card key={similarGame.id} className="bg-card/70 backdrop-blur-sm border-[#00f7ff]/20 overflow-hidden hover:shadow-[0_0_15px_rgba(0,247,255,0.2)] transition-all">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={similarGame.image}
                        alt={similarGame.title}
                        className="w-full h-full object-cover"
                      />
                      {similarGame.developer === game.developer && (
                        <Badge className="absolute top-2 left-2 bg-purple-500 text-white">
                          Same Developer
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{similarGame.title}</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <Badge variant="outline" className="text-xs border-[#00f7ff]/20">
                          {similarGame.category.charAt(0).toUpperCase() + similarGame.category.slice(1)}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="fill-yellow-400 h-3 w-3 mr-1" />
                          <span>{similarGame.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                        {similarGame.description}
                      </p>
                      <Link to={`/games/${similarGame.id}`}>
                        <Button className="w-full btn-primary" size="sm">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-4 text-center py-12">
                  <p className="text-muted-foreground">No similar games found based on our criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
