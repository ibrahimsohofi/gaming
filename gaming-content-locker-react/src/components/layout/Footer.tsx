import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Custom link component that handles scrolling to the top for hash links
function ScrollLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const isHashLink = to.includes('#');
    const isCurrentPage = to === '/' || (location.pathname === '/' && isHashLink);

    if (isCurrentPage) {
      // For hash links on the current page, scroll to the element
      const targetId = to.split('#')[1];
      const element = document.getElementById(targetId);

      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100, // Offset for header
          behavior: 'smooth'
        });
      } else {
        // If element not found, go to the page and then try to scroll
        navigate(to);
      }
    } else {
      // For navigation to different pages, use navigate and let the ScrollToTop handle it
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#00f7ff]/10 pt-16 pb-8 mt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Logo and about */}
          <div className="col-span-full sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Gamepad2 className="h-6 w-6 text-[#00f7ff] mr-2" />
              <div className="font-bold text-xl tracking-tight">
                <span className="text-[#00f7ff]">Game</span>Vault
              </div>
            </Link>
            <p className="text-muted-foreground mb-4">
              Your ultimate destination for mobile gaming. Discover top-rated games, stay updated with latest releases, and level up your mobile gaming experience.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/action" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Action Games
                </Link>
              </li>
              <li>
                <Link to="/categories/adventure" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Adventure Games
                </Link>
              </li>
              <li>
                <Link to="/categories/rpg" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  RPG Games
                </Link>
              </li>
              <li>
                <Link to="/categories/puzzle" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Puzzle Games
                </Link>
              </li>
              <li>
                <Link to="/categories/strategy" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Strategy Games
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  View All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Home
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/#games" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Games Library
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/#how-it-works" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  How It Works
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/#faq" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  FAQ
                </ScrollLink>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-[#00f7ff] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="col-span-full sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to get updates on new games and exclusive offers.
            </p>
            <div className="flex w-full">
              <Input
                placeholder="Your email"
                type="email"
                className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-[#00f7ff]/30 w-full"
              />
              <Button className="rounded-l-none btn-primary shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-[#00f7ff]/10 text-center text-muted-foreground text-sm">
          <p>© {currentYear} GameVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
