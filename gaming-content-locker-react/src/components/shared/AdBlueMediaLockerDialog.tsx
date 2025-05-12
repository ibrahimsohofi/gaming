import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Check if content is already unlocked in localStorage
  const contentUnlocked = localStorage.getItem(`unlocked_${contentId}`) === 'true';

  // If content is already unlocked, redirect directly to the download URL
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
      window.location.href = redirectUrl;
    }
  }, [isOpen, contentUnlocked, redirectUrl, onClose]);

  // Clean up function for event listeners and timers
  const cleanupResources = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    window.removeEventListener('message', handleMessage);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  // Handler for messages from the iframe
  const handleMessage = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object' && event.data.status === 'completed') {
      localStorage.setItem(`unlocked_${contentId}`, 'true');
      window.location.href = redirectUrl;
    }
  };

  // Initialize the iframe when the dialog opens
  useEffect(() => {
    if (!isOpen || contentUnlocked) return;

    window.addEventListener('message', handleMessage);

    setIsLoading(true);

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    timerRef.current = window.setTimeout(() => {
      if (!containerRef.current) return;

      try {
        const iframe = document.createElement('iframe');
        iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
        iframe.width = '100%';
        iframe.height = '450px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.allow = 'clipboard-write';

        iframe.onload = () => {
          setIsLoading(false);
        };

        iframe.onerror = () => {
          setIsLoading(false);
        };

        timerRef.current = window.setTimeout(() => {
          setIsLoading(false);
        }, 15000);

        containerRef.current.appendChild(iframe);
      } catch (error) {
        setIsLoading(false);
      }
    }, 300);

    return cleanupResources;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, contentUnlocked, contentId, redirectUrl]);

  const handleClose = () => {
    cleanupResources();
    onClose();
  };

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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
