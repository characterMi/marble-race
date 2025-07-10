import { useState } from "react";
import { DownloadButton } from "./DownloadButton";

export const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <aside className={`how-to__container ${isActive && "active"}`}>
      <button
        className="toggle-button"
        onClick={() => setIsActive((prev) => !prev)}
      >
        ?
      </button>

      <div>
        Use the W, S, D, A or the control buttons down below to play. you can
        also use arrow keys to play. if the ball doesn&apos;t move, simply
        restart the game. You can also download the game.
        <DownloadButton />
      </div>
    </aside>
  );
};
