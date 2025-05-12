import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "Downloaded Clash Royale in seconds! GameVault is incredibly fast and the game runs perfectly with no issues. Definitely my go-to gaming site now.",
    author: "Alex K.",
    game: "Clash Royale",
    verified: true
  },
  {
    id: 2,
    rating: 5,
    text: "I've been looking for a reliable place to download Minecraft PE. GameVault delivered the full game instantly with no hassle!",
    author: "SarahGames92",
    game: "Minecraft",
    verified: true
  },
  {
    id: 3,
    rating: 5,
    text: "Downloaded Roblox from GameVault and it works flawlessly. The verification was quick and the game installed without any problems.",
    author: "GameMaster455",
    game: "Roblox",
    verified: true
  },
  {
    id: 4,
    rating: 5,
    text: "PUBG Mobile downloaded quickly and runs perfectly on my phone. GameVault's verification process was super easy too!",
    author: "FPSKing",
    game: "PUBG Mobile",
    verified: true
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-b from-background/50 to-background">
      <div className="container-custom">
        <h2 className="section-title">
          WHAT GAMERS ARE <span className="highlight">SAYING</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm card-hover">
              <CardContent className="p-6 space-y-4">
                <div className="text-yellow-400">
                  {"⭐".repeat(testimonial.rating)}
                </div>
                <p className="text-foreground italic">"{testimonial.text}"</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{testimonial.author}</span>
                    {testimonial.verified && (
                      <span className="text-[#00f7ff] flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Verified Player
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Downloaded: {testimonial.game}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
