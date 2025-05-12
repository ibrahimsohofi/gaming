import { useEffect, useRef, useState } from "react";
import { ADBLUE_CAMPAIGN_ID } from "@/data/lockerConfig";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw, Download } from "lucide-react";

type CustomLockerProps = {
  contentId: string;
  redirectUrl: string;
  className?: string;
  width?: string;        // Width of the locker (e.g., "700px")
  height?: string;       // Height of the locker (e.g., "300px")
  offerAreaWidth?: string; // Width of the offer area (e.g., "50%")
  backgroundImage?: string; // URL to background image
  borderRadius?: string; // Border radius (e.g., "10px")
  title?: string;        // Custom title
  description?: string;  // Custom description
};

export function CustomLocker({
  contentId,
  redirectUrl,
  className = "",
  width = "700px",
  height = "300px",
  offerAreaWidth = "50%",
  backgroundImage = "",
  borderRadius = "10px",
  title = "Complete Offers to Unlock Download",
  description = "Please complete one of the offers below to access your download."
}: CustomLockerProps) {
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
        iframe.height = '100%';
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
      iframe.height = '100%';
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

  // Create custom styles based on props
  const lockerStyle = {
    width: width,
    maxWidth: '100%',
    margin: '0 auto',
    borderRadius: borderRadius,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 247, 255, 0.2)'
  };

  const headerStyle = {
    position: 'relative' as const,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #0A0A12 0%, #131320 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    borderBottom: '1px solid rgba(0, 247, 255, 0.2)',
    color: '#fff',
    textAlign: 'center' as const
  };

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 18, 0.7)',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative' as const,
    zIndex: 2
  };

  const offerContainerStyle = {
    width: offerAreaWidth,
    margin: '0 auto',
    height: height,
    backgroundColor: '#0A0A12',
    border: '1px solid rgba(0, 247, 255, 0.2)',
    position: 'relative' as const
  };

  return (
    <div className={className} style={lockerStyle}>
      {/* Header with background image and overlay */}
      <div style={headerStyle}>
        {backgroundImage && <div style={overlayStyle}></div>}
        <div style={contentStyle}>
          <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>

      {/* Offer container */}
      <div style={offerContainerStyle}>
        <div
          ref={containerRef}
          id="adblue-locker-container"
          className="w-full h-full flex flex-col items-center justify-center"
        >
          {isLoading && !loadError && (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#00f7ff] mx-auto mb-2" />
              <p className="text-white">Loading offers...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait while we prepare your offers...</p>
            </div>
          )}

          {loadError && (
            <div className="text-center p-4">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-500 font-semibold mb-2">Error</p>
              <p className="mb-4 text-white">{loadError}</p>
              <Button onClick={handleRetry} className="bg-[#00f7ff] text-black hover:bg-[#00c4cc]">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer with info */}
      <div className="bg-[#0A0A12] p-4 border-t border-[#00f7ff]/20">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>Complete any offer to continue</div>
          <div className="flex items-center">
            <Download className="h-4 w-4 mr-1 text-[#00f7ff]" />
            <span>Secured content</span>
          </div>
        </div>
      </div>
    </div>
  );
}
