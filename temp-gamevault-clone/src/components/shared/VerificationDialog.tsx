import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BadgeCheck, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VerificationDialogProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export function VerificationDialog({ isOpen, onComplete, onClose }: VerificationDialogProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400); // short delay for smoothness
          return 100;
        }
        return prev + 4;
      });
    }, 60); // ~1.5 seconds total
    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm text-center p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-xl font-bold mb-2">
            <BadgeCheck className="h-6 w-6 text-[#00f7ff] animate-pulse" /> Verifying...
          </DialogTitle>
          <DialogDescription>Verify you are human</DialogDescription>
        </DialogHeader>
        <div className="my-5 flex flex-col items-center">
          <Progress value={progress} className="h-6 w-full mb-2" />
          <div className="text-muted-foreground tracking-wide">
            {progress}%
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
