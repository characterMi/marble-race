import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useGame = create(
  subscribeWithSelector((setState) => ({
    level: 3,
    setLevel: () => setState({ level: localStorage.getItem("level") }),
    phase: "ready",
    startTime: 0,
    endTime: 0,
    start: () =>
      setState((state) => {
        if (state.phase === "ready") {
          return { phase: "playing", startTime: Date.now() };
        }

        return {}; // if we don't want to change anything in our store, we return an empty object
      }),
    restart: () =>
      setState((state) => {
        if (state.phase === "playing" || state.phase === "ended") {
          return { phase: "ready" };
        }

        return {};
      }),
    end: () =>
      setState((state) => {
        if (state.phase === "playing") {
          return { phase: "ended", endTime: Date.now() };
        }

        return {};
      }),
  }))
);
