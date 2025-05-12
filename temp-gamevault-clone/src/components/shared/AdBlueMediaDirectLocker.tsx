import { useEffect, useRef, useState } from "react";
import { ADBLUE_CAMPAIGN_ID } from "@/data/lockerConfig";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

type AdBlueMediaDirectLockerProps = {
  contentId: string;
  redirectUrl: string;
  className?: string;
};

export function AdBlueMediaDirectLocker({
  contentId,
  redirectUrl,
  className = "",
}: AdBlueMediaDirectLockerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [iframeCreated, setIframeCreated] = useState(false);

  // Check if content is already unlocked in localStorage
  const contentUnlocked = localStorage.getItem(`unlocked_${contentId}`) === 'true';

  // Handler for messages from the iframe
  const handleMessage = (event: MessageEvent) => {
    // Check if the message is from AdBlueMedia and indicates completion
    if (event.data && typeof event.data === 'object' && event.data.status === 'completed') {
      console.log('Received completion message:', event.data);
      localStorage.setItem(`unlocked_${contentId}`, 'true');
      window.location.href = redirectUrl;
    }
  };

  // Clean up function for event listeners and timers
  const cleanupResources = () => {
    // Clear any timers
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Remove the message event listener if it exists
    if (messageHandlerRef.current) {
      window.removeEventListener('message', messageHandlerRef.current);
      messageHandlerRef.current = null;
    }

    // Remove the iframe cleanly if it exists
    if (iframeRef.current && containerRef.current && containerRef.current.contains(iframeRef.current)) {
      try {
        containerRef.current.removeChild(iframeRef.current);
      } catch (e) {
        console.warn("Error removing iframe:", e);
      }
      iframeRef.current = null;
    }

    setIframeCreated(false);
  };

  // Initialize the iframe
  useEffect(() => {
    // If already unlocked, don't show locker
    if (contentUnlocked) return;

    // Save handler reference to ensure we can remove the exact same function
    messageHandlerRef.current = handleMessage;

    // Add message event listener
    window.addEventListener('message', messageHandlerRef.current);

    // Create and load the iframe
    setIsLoading(true);
    setLoadError(null);

    // Set a delay before creating the iframe to ensure DOM is ready
    timerRef.current = window.setTimeout(() => {
      if (!containerRef.current) return;

      // Don't create a new iframe if one already exists
      if (iframeCreated) return;

      try {
        // Create a direct iframe to the AdBlueMedia locker
        const iframe = document.createElement('iframe');
        iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
        iframe.width = '100%';
        iframe.height = '450px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.allow = 'clipboard-write';

        // Save reference to iframe
        iframeRef.current = iframe;
        setIframeCreated(true);

        // Add load event handlers
        iframe.onload = () => {
          console.log('Iframe loaded successfully');
          setIsLoading(false);
        };

        iframe.onerror = () => {
          console.error('Failed to load iframe');
          setLoadError('Failed to load offers. Please try again later.');
          setIsLoading(false);
        };

        // Set a timeout to detect if the iframe is taking too long to load
        timerRef.current = window.setTimeout(() => {
          if (isLoading) {
            setLoadError('Offers are taking too long to load. Please try again later.');
            setIsLoading(false);
          }
        }, 15000); // 15 second timeout

        // Append the iframe to the container
        containerRef.current.appendChild(iframe);
      } catch (error) {
        console.error('Error creating iframe:', error);
        setLoadError('An error occurred while loading offers. Please try again later.');
        setIsLoading(false);
      }
    }, 300);

    // Cleanup function
    return cleanupResources;
  }, [contentUnlocked, contentId, redirectUrl]);

  // Handle retry
  const handleRetry = () => {
    cleanupResources();
    setIsLoading(true);
    setLoadError(null);

    // Set message handler again
    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', messageHandlerRef.current);

    // Create a direct iframe again
    if (containerRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
      iframe.width = '100%';
      iframe.height = '450px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.allow = 'clipboard-write';

      // Save reference to iframe
      iframeRef.current = iframe;
      setIframeCreated(true);

      // Add load event handlers
      iframe.onload = () => {
        console.log('Retry: Iframe loaded successfully');
        setIsLoading(false);
      };

      iframe.onerror = () => {
        console.error('Retry: Failed to load iframe');
        setLoadError('Failed to load offers even after retry. Please try again later.');
        setIsLoading(false);
      };

      // Append the iframe to the container
      containerRef.current.appendChild(iframe);
    }
  };

  // If the content is already unlocked, don't show the locker
  if (contentUnlocked) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full p-4 border-2 border-[#00f7ff]/20 rounded-lg bg-card/70 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Complete Offers to Unlock Download</h3>
          <p className="text-muted-foreground">Please complete one of the offers below to access your download.</p>
        </div>

        <div
          ref={containerRef}
          id="adblue-locker-container"
          className="w-full min-h-[450px] flex flex-col items-center justify-center"
        >
          {isLoading && !loadError && (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#00f7ff] mx-auto mb-2" />
              <p>Loading offers...</p>
              <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your offers...</p>
            </div>
          )}

          {loadError && (
            <div className="text-center p-4">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-500 font-semibold mb-2">Error</p>
              <p className="mb-4">{loadError}</p>
              <Button onClick={handleRetry} className="btn-primary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
