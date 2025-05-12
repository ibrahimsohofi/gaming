import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GAME_RESOURCES } from '@/data/games';
import type { GameResource } from '@/types/games';
import { FileDown, Menu, X, User, Gamepad, Gamepad2, Clock, Star, ChevronRight, Grid, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

// User review interface
interface UserReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  gameId?: string;
  gameTitle?: string;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [downloadedGames, setDownloadedGames] = useState<GameResource[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const { wishlistCount } = useWishlist();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Get user's downloaded games and reviews
  useEffect(() => {
    if (profileOpen) {
      // Find downloaded games
      const games = GAME_RESOURCES.filter(game =>
        localStorage.getItem(`unlocked_${game.id}`) === 'true'
      );
      setDownloadedGames(games);

      // Find all user reviews
      const allReviews: UserReview[] = [];

      // Use for...of instead of forEach
      for (const game of GAME_RESOURCES) {
        const savedReviews = localStorage.getItem(`reviews_${game.id}`);
        if (savedReviews) {
          const parsedReviews = JSON.parse(savedReviews) as UserReview[];
          for (const review of parsedReviews) {
            allReviews.push({
              ...review,
              gameId: game.id,
              gameTitle: game.title
            });
          }
        }
      }

      setUserReviews(allReviews);
    }
  }, [profileOpen]);

  // Calculate user level based on activity
  const userLevel = Math.floor(downloadedGames.length / 2) + Math.floor(userReviews.length / 3) + 1;
  const totalDownloads = downloadedGames.length;
  const totalReviews = userReviews.length;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/images/logos/logo-main.svg" alt="GameVault Logo" className="h-12 mr-2" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/#games" className="nav-link">Games</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/#how-it-works" className="nav-link">How It Works</Link>
          <Link to="/#faq" className="nav-link">FAQ</Link>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Wishlist Button */}
          <Link to="/wishlist">
            <Button
              variant="outline"
              size="sm"
              className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 hidden md:flex items-center relative"
            >
              <Heart className="h-4 w-4 mr-2 text-[#00f7ff]" />
              Wishlist
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#00f7ff] text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Profile Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 hidden md:flex items-center"
            onClick={() => setProfileOpen(true)}
          >
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Button>

          {/* Categories Button - visible only on mobile */}
          <Link to="/categories" className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10"
            >
              <Grid className="h-5 w-5" />
            </Button>
          </Link>

          {/* Wishlist Button - visible only on mobile */}
          <Link to="/wishlist" className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 relative"
            >
              <Heart className="h-5 w-5 text-[#00f7ff]" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#00f7ff] text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Download App button - primary CTA */}
          <Link to="/#games">
            <Button size="sm" className="hidden md:flex items-center btn-primary">
              <FileDown className="h-4 w-4 mr-2" />
              Download Games
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-[#00f7ff]/30 hover:bg-[#00f7ff]/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-[#00f7ff]/20" showCloseButton={true}>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <img src="/images/logos/logo-main.svg" alt="GameVault Logo" className="h-10" />
                </div>

                <nav className="flex flex-col space-y-4">
                  <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/#games" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Games
                  </Link>
                  <Link to="/categories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Categories
                  </Link>
                  <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Wishlist {wishlistCount > 0 && <Badge className="ml-2 bg-[#00f7ff] text-primary-foreground">{wishlistCount}</Badge>}
                  </Link>
                  <Link to="/#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    How It Works
                  </Link>
                  <Link to="/#faq" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    FAQ
                  </Link>
                </nav>

                <div className="mt-4 flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 flex justify-center"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileOpen(true);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Button>

                  <Link to="/#games" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-primary">
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Games
                    </Button>
                  </Link>
                </div>

                <div className="mt-auto pt-6 border-t border-[#00f7ff]/10 text-center text-xs text-muted-foreground">
                  © 2025 GameVault. All rights reserved.
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* User Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-[#00f7ff]" /> User Profile
            </DialogTitle>
            <DialogDescription>
              Your game activity and download history
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-8">
            {/* User stats */}
            <div className="bg-card/70 backdrop-blur-sm rounded-lg border border-[#00f7ff]/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-[#00f7ff]/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-[#00f7ff]" />
                </div>
                <div>
                  <h3 className="font-semibold">Guest User</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Badge className="bg-[#00f7ff]/20 text-[#00f7ff] hover:bg-[#00f7ff]/30">
                      Level {userLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="flex justify-center mb-1">
                    <img src="/images/logos/logo-main.svg" alt="GameVault Logo" className="h-5" />
                  </div>
                  <div className="text-xl font-semibold">{totalDownloads}</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="flex justify-center mb-1">
                    <Star className="h-4 w-4 text-[#00f7ff]" />
                  </div>
                  <div className="text-xl font-semibold">{totalReviews}</div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="flex justify-center mb-1">
                    <Heart className="h-4 w-4 text-[#00f7ff]" />
                  </div>
                  <div className="text-xl font-semibold">{wishlistCount}</div>
                  <div className="text-xs text-muted-foreground">Wishlist</div>
                </div>
              </div>
            </div>

            {/* Downloaded games */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <img src="/images/logos/logo-main.svg" alt="GameVault Logo" className="h-6 w-6 mr-2" />
                My Games
              </h3>

              {downloadedGames.length > 0 ? (
                <div className="space-y-2">
                  {downloadedGames.map(game => (
                    <Link to={`/games/${game.id}`} key={game.id}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/80 transition-colors">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={game.image}
                            alt={game.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{game.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                            {game.rating}/5
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-[#00f7ff]/20 rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    No games downloaded yet. Browse our library to find games you like.
                  </p>
                  <Link to="/#games">
                    <Button variant="outline" size="sm" className="mt-2 border-[#00f7ff]/30 hover:bg-[#00f7ff]/10">
                      Browse Games
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent activity */}
            {userReviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Clock className="h-5 w-5 text-[#00f7ff] mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {userReviews.slice(0, 3).map(review => (
                    <Link to={`/games/${review.gameId}`} key={review.id}>
                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-card/80 transition-colors">
                        <div className="mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            You reviewed <span className="font-medium">{review.gameTitle}</span>
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            "{review.comment}"
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
