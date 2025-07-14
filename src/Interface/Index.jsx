import { useGame } from "../store/useGame";
import { Controls } from "./Controls";
import { Sidebar } from "./Sidebar";
import { Timer } from "./Timer";

export const Interface = () => {
  const { phase, restartGame, level, setActiveBtn, setLevel } = useGame(
    (state) => ({
      phase: state.phase,
      restartGame: state.restart,
      level: state.level,
      setActiveBtn: state.setActiveBtn,
      setLevel: state.setLevel,
    })
  );

  const handleNextLevel = () => {
    const newLevel = level === 20 ? 1 : level + 1;

    localStorage.setItem("level", newLevel);
    setLevel(newLevel);
    restartGame();
  };

  const handleSelectLevel = (newLevel) => {
    localStorage.setItem("level", newLevel);
    setLevel(+newLevel);
    restartGame();
  };

  const handleRestart = () => {
    setActiveBtn("none");
    restartGame();
  };

  return (
    <div className="interface">
      {/* Level */}
      <select
        className="level-display"
        onChange={(e) => handleSelectLevel(e.target.value)}
      >
        {[...Array(20).keys()].map((index) => (
          <option
            value={index + 1}
            key={index + 1}
            selected={index + 1 === +level}
          >
            Level: {index + 1}
          </option>
        ))}
      </select>

      {/* Timer */}
      <Timer />

      {/* Restart */}
      <div
        onClick={handleRestart}
        className="restart-btn"
        onKeyDown={(e) => {
          const isActiveElement = document.activeElement === e.currentTarget;
          if (isActiveElement && e.key === "Enter") handleRestart();
        }}
        role="button"
        tabIndex={0}
      >
        Restart
      </div>

      {/* Restart */}
      {phase === "ended" && (
        <div className="events">
          <button onClick={handleRestart} className="event-items">
            Restart
          </button>
          <button onClick={handleNextLevel} className="event-items">
            {level == 20 ? "Start again" : "Next"}
          </button>
        </div>
      )}

      <Sidebar />

      {/* Controls */}
      <Controls setActiveBtn={setActiveBtn} />
    </div>
  );
};
