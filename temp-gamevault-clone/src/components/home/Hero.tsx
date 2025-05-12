import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

// Custom Gamepad2 SVG component
const CustomGamepad2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="6" x2="10" y1="11" y2="11" />
    <line x1="8" x2="8" y1="9" y2="13" />
    <line x1="15" x2="15.01" y1="12" y2="12" />
    <line x1="18" x2="18.01" y1="10" y2="10" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
  </svg>
);

export function Hero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background with cyan glow effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{
          backgroundImage: "url('/assets/bg-gaming.jpg')",
          filter: "brightness(0.4)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

      {/* Moving Neon Glow Effect */}
      <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[size:20px_20px]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00f7ff]/20 blur-[100px] animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-[#00f7ff]/15 blur-[80px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-[#00f7ff]/10 blur-[80px] animate-blob animation-delay-4000" />

      {/* Mobile Background with Game Controller */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/assets/game-controller.jpg')",
          filter: "brightness(0.6) contrast(1.2)",
        }}
      />

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter animation-fade-in">
              Download Premium Mobile Games on{" "}
              <span className="text-[#00f7ff] relative inline-block glow-text">
                GameVault
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animation-slide-up">
              Your ultimate library for the best mobile gaming experience.
              Discover, download, and play without limits.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 animation-slide-up animation-delay-300">
              <Link to="/#games">
                <Button size="lg" className="btn-primary shine-effect w-full sm:w-auto">
                  <Download className="mr-2 h-5 w-5" />
                  Explore Games
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10 w-full sm:w-auto"
                >
                  View Categories
                </Button>
              </Link>
            </div>
            <div className="mt-10 text-sm text-muted-foreground animation-fade-in animation-delay-600">
              <p className="flex justify-center md:justify-start items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#00f7ff]" />
                <span>Featuring top-rated titles for Android & iOS devices</span>
                <span className="inline-block h-2 w-2 rounded-full bg-[#00f7ff]" />
              </p>
            </div>
          </div>

          {/* Gamepad2 SVG on the right side */}
          <div className="hidden md:block md:w-1/3 mt-12 md:mt-0">
            <div className="relative flex justify-center">
              {/* Glow effect behind the controller */}
              <div className="absolute inset-0 bg-[#00f7ff]/10 rounded-full blur-[50px] animate-pulse" />

              {/* Controller SVG */}
              <CustomGamepad2 className="w-64 h-64 text-[#00f7ff] relative z-10 animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
