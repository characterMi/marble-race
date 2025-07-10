import { useGame } from "../store/useGame";
import { Controls } from "./Controls";
import { Sidebar } from "./Sidebar";
import { Timer } from "./Timer";

export const Interface = () => {
  const { phase, restartGame, level, setActiveBtn } = useGame((state) => ({
    phase: state.phase,
    restartGame: state.restart,
    level: state.level,
    setActiveBtn: state.setActiveBtn,
  }));

  const handleNextLevel = () => {
    localStorage.setItem("level", +level + 1);

    window.location.reload();
  };

  const handleSelectLevel = (level) => {
    localStorage.setItem("level", level.toString());

    window.location.reload();
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
      <button className="restart-btn" onClick={restartGame}>
        Restart
      </button>

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
