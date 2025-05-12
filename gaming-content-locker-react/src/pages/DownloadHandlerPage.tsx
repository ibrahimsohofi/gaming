import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft, ShieldAlert } from "lucide-react";
import { getDownloadUrl } from "@/data/lockerConfig";

/**
 * This page acts as a download handler/redirector after a user completes the AdBlueMedia locker.
 * It extracts the gameId from the URL query parameters and redirects to the appropriate download URL.
 */
export function DownloadHandlerPage() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [redirected, setRedirected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the gameId from the URL - check both "gameId" and "game" parameters to support both formats
  // "gameId" is used in local development, "game" is used in the Vercel deployment
  const gameId = searchParams.get("gameId") || searchParams.get("game") || "";

  // Get the download URL for this game
  const downloadUrl = getDownloadUrl(gameId);

  // Track if this is a valid AdBlueMedia redirect
  const isValidRedirect = Boolean(gameId && downloadUrl);

  // Log this activity to help with debugging and tracking
  useEffect(() => {
    console.log(`Download handler accessed: GameID: ${gameId}, Valid: ${isValidRedirect}`);

    // For analytics or tracking purposes
    if (gameId) {
      // You could add analytics tracking here
      const unlocked = localStorage.getItem(`unlocked_${gameId}`) === 'true';
      console.log(`Game ${gameId} unlock status: ${unlocked ? 'Unlocked' : 'Not unlocked'}`);
    }
  }, [gameId, isValidRedirect]);

  useEffect(() => {
    // Only proceed if we have a valid download URL and haven't redirected yet
    if (downloadUrl && !redirected) {
      // Set up countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          // When countdown reaches 0, redirect
          if (prev <= 1) {
            clearInterval(timer);
            try {
              window.location.href = downloadUrl;
              setRedirected(true);
            } catch (err) {
              setError("Failed to redirect to download URL. Please use the manual download button below.");
              console.error("Redirect error:", err);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Clean up timer on unmount
      return () => {
        clearInterval(timer);
      };
    } else if (!downloadUrl && gameId) {
      // If we have a gameId but no download URL, something is wrong
      setError(`No download URL found for game: ${gameId}`);
    }
  }, [downloadUrl, redirected, gameId]);

  // If no valid game ID or download URL, show error page
  if (!isValidRedirect) {
    return (
      <div className="container-custom flex flex-col items-center justify-center py-20">
        <div className="bg-card/70 backdrop-blur-sm border border-[#00f7ff]/20 rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Invalid Download Request</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the game you're looking for. Please try downloading from the game details page.
          </p>
          <Link to="/">
            <Button className="btn-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom flex flex-col items-center justify-center py-20">
      <div className="bg-card/70 backdrop-blur-sm border border-[#00f7ff]/20 rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Download Starting Soon</h1>

        {error ? (
          <div className="bg-red-500/20 border border-red-500/30 text-red-500 rounded-md p-4 mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-[#00f7ff]/10 border border-[#00f7ff]/30 h-24 w-24 flex items-center justify-center text-3xl font-bold mx-auto mb-6">
              {countdown}
            </div>

            <p className="text-muted-foreground mb-6">
              Your download will begin automatically in {countdown} second{countdown !== 1 ? 's' : ''}.
              {countdown <= 3 && " Almost ready..."}
            </p>
          </>
        )}

        <div className="flex flex-col gap-4">
          <a href={downloadUrl} className="w-full">
            <Button className="w-full btn-primary">
              <FileDown className="mr-2 h-5 w-5" />
              {error ? "Try Manual Download" : "Download Now"}
            </Button>
          </a>

          <Link to={`/games/${gameId}`}>
            <Button variant="outline" className="w-full border-[#00f7ff]/30 hover:bg-[#00f7ff]/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Game Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
