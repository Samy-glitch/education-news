import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

const PWAInstallButton: React.FC = () => {
  const [isInstallPromptVisible, setInstallPromptVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevents the default mini-infobar from appearing on mobile.
      setInstallPrompt(event); // Store the event for later use.
      setInstallPromptVisible(true); // Show the install button.
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      const promptEvent = installPrompt as any;
      promptEvent.prompt(); // Show the install prompt.
      const { outcome } = await promptEvent.userChoice; // Wait for the user's response.
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setInstallPromptVisible(false);
    }
  };

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstallPromptVisible(false);
    }
  }, []);

  return (
    <>
      {isInstallPromptVisible && (
        <Button
          onClick={handleInstallClick}
          variant="outline"
          className="flex items-center justify-start w-full h-[58px] p-4 space-x-2"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Install App</span>
        </Button>
      )}
    </>
  );
};

export default PWAInstallButton;
