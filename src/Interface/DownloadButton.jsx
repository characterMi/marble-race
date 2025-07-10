import { useEffect, useState } from "react";

export const DownloadButton = () => {
  const [bipEvent, setBipEvent] = useState(null);

  const handleDownload = () => {
    if (bipEvent) {
      bipEvent.prompt();
    } else {
      alert(
        `To install the app look for "Add to Homescreen" or install in your browser's menu.`
      );
    }
  };
  useEffect(() => {
    const handleSetInstallPrompt = (event) => setBipEvent(event);

    window.addEventListener("beforeinstallprompt", handleSetInstallPrompt);

    return () =>
      window.removeEventListener("beforeinstallprompt", handleSetInstallPrompt);
  }, []);

  return (
    <button className="download-btn" onClick={handleDownload}>
      Download Game
    </button>
  );
};
