import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { ADBLUE_CAMPAIGN_ID } from "@/data/lockerConfig";

type AdBlueMediaLockerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  contentId: string;
  redirectUrl: string; // URL for AdBlueMedia to redirect to after completion
};

export function AdBlueMediaLockerDialog({
  isOpen,
  onClose,
  title,
  description,
  contentId,
  redirectUrl,
}: AdBlueMediaLockerDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Check if content is already unlocked in localStorage
  const contentUnlocked = localStorage.getItem(`unlocked_${contentId}`) === 'true';

  // If content is already unlocked, redirect directly to the download URL
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      // Close the dialog and redirect to the download URL
      onClose();
      window.location.href = redirectUrl;
    }
  }, [isOpen, contentUnlocked, redirectUrl, onClose]);

  // Clean up function for event listeners and timers
  const cleanupResources = () => {
    // Clear any timers
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Remove the message event listener
    window.removeEventListener('message', handleMessage);

    // Clean the container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  // Handler for messages from the iframe
  const handleMessage = (event: MessageEvent) => {
    // Check if the message is from AdBlueMedia and indicates completion
    if (event.data && typeof event.data === 'object' && event.data.status === 'completed') {
      console.log('Received completion message:', event.data);
      localStorage.setItem(`unlocked_${contentId}`, 'true');
      window.location.href = redirectUrl;
    }
  };

  // Initialize the iframe when the dialog opens
  useEffect(() => {
    if (!isOpen || contentUnlocked) return;

    // Add message event listener
    window.addEventListener('message', handleMessage);

    // Create and load the iframe after a short delay
    setIsLoading(true);
    setLoadError(null);

    // Reset container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Set a delay before creating the iframe to ensure DOM is ready
    timerRef.current = window.setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Create a direct iframe to the AdBlueMedia locker
        const iframe = document.createElement('iframe');
        iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
        iframe.width = '100%';
        iframe.height = '450px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.allow = 'clipboard-write';

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
  }, [isOpen, contentUnlocked, contentId, redirectUrl]);

  // Handle manual retry
  const handleRetry = () => {
    cleanupResources();
    setIsLoading(true);
    setLoadError(null);

    // Reset container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';

      // Create a direct iframe again
      const iframe = document.createElement('iframe');
      iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
      iframe.width = '100%';
      iframe.height = '450px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.allow = 'clipboard-write';

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

  // Handle dialog close
  const handleClose = () => {
    cleanupResources();
    onClose();
  };

  // If content is already unlocked, don't show the dialog
  if (contentUnlocked) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] p-0 bg-transparent border-none shadow-none">
        <div
          ref={containerRef}
          id="adblue-locker-container"
          className="w-full flex flex-col items-center justify-center overflow-y-auto"
          style={{ maxHeight: '60vh' }}
        >
          {isLoading && (
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
              <Button onClick={handleRetry} className="btn-primary">Try Again</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
