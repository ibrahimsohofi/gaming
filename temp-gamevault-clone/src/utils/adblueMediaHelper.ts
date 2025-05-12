/**
 * AdBlueMedia locker helper types and utilities
 */

// Types for AdBlueMedia locker integration
declare global {
  interface Window {
    cpaLocker?: {
      init: (options: {
        campaignId: string;
        container: string;
        callback?: (result: { status: string }) => void;
        callbackUrl?: string;
      }) => void;
    };
  }
}

/**
 * These configuration options match what AdBlueMedia expects
 */
export interface AdBlueMediaOptions {
  campaignId: string;
  container: string;
  callback?: (result: { status: string }) => void;
  callbackUrl?: string;
}

/**
 * Default configuration for AdBlueMedia locker
 * You can use this as a base and override specific properties
 */
export const DEFAULT_ADBLUE_OPTIONS: Partial<AdBlueMediaOptions> = {
  container: 'adblue-locker-container',
};

/**
 * Initialize AdBlueMedia integration
 * This should be called once when the app starts
 */
export function initAdBlueMediaIntegration() {
  // Log that initialization is complete
  console.log('AdBlueMedia integration initialized');
}

/**
 * Load the AdBlueMedia locker script dynamically
 * @returns Promise that resolves when the script is loaded
 */
export function loadAdBlueMediaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Clean up any existing script elements
    const existingScript = document.getElementById("adblue-script");
    if (existingScript) {
      existingScript.remove();
    }

    console.log("Starting to load AdBlueMedia script...");

    // Create script element for AdBlueMedia locker
    const script = document.createElement("script");
    script.id = "adblue-script";

    // Using the more reliable URL format from AdBlueMedia official integration
    script.src = "https://locked-content.com/launcher.js"; // Updated to launcher.js which is more commonly used
    script.async = true;
    script.crossOrigin = "anonymous"; // Add cross-origin attribute

    // Add event listener for when script is loaded
    script.onload = () => {
      console.log("AdBlueMedia script loaded successfully");
      // Check if cpaLocker is actually available
      if (window.cpaLocker) {
        console.log("cpaLocker object is available");
      } else {
        console.warn("cpaLocker object not found after script load");
      }
      resolve();
    };

    script.onerror = (error) => {
      console.error("Failed to load AdBlueMedia script:", error);
      reject(new Error("Failed to load AdBlueMedia locker script"));
    };

    document.head.appendChild(script);
    console.log("AdBlueMedia script added to document head");
  });
}
