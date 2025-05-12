import { Search, Download, Gamepad2 } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-card/10">
      <div className="container-custom">
        <h2 className="section-title mb-12">
          How <span className="highlight">GameVault</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-card/50 backdrop-blur-sm border border-[#00f7ff]/10 rounded-lg p-6 hover:shadow-[0_0_20px_rgba(0,247,255,0.2)] hover:border-[#00f7ff]/30 transition-all">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#00f7ff]/10 mb-6 mx-auto">
              <Search className="h-6 w-6 text-[#00f7ff]" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">1. Browse Games</h3>
            <p className="text-center text-muted-foreground">
              Explore our extensive library of premium mobile games. Filter by category, popularity or release date to find your next favorite game.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card/50 backdrop-blur-sm border border-[#00f7ff]/10 rounded-lg p-6 hover:shadow-[0_0_20px_rgba(0,247,255,0.2)] hover:border-[#00f7ff]/30 transition-all">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#00f7ff]/10 mb-6 mx-auto">
              <Download className="h-6 w-6 text-[#00f7ff]" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">2. Unlock Access</h3>
            <p className="text-center text-muted-foreground">
              Complete offers to unlock access to the game of your choice. GameVault provides seamless download experience with no waiting.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card/50 backdrop-blur-sm border border-[#00f7ff]/10 rounded-lg p-6 hover:shadow-[0_0_20px_rgba(0,247,255,0.2)] hover:border-[#00f7ff]/30 transition-all">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#00f7ff]/10 mb-6 mx-auto">
              <Gamepad2 className="h-6 w-6 text-[#00f7ff]" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">3. Play & Enjoy</h3>
            <p className="text-center text-muted-foreground">
              Install the game on your device and start playing immediately. Return to GameVault anytime to discover new releases and top-rated games.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="max-w-2xl mx-auto text-muted-foreground mb-1">
            GameVault provides a streamlined experience for mobile gamers to access premium content.
          </p>
          <p className="text-[#00f7ff]">No complex registration. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}
