import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useGame = create(
  subscribeWithSelector((setState) => ({
    level: 1,
    setLevel: (newLevel) => setState({ level: newLevel }),
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

    zPosition: 0,
    setZPosition: (z) => setState({ zPosition: z }),

    /**
     * Responsiveness
     */
    forwardBtn: false,
    backwardBtn: false,
    leftwardBtn: false,
    rightwardBtn: false,
    jumpBtn: false,

    setActiveBtn: (key) => {
      switch (key) {
        case "forwardActive":
          setState({ forwardBtn: true });
          break;
        case "backwardActive":
          setState({ backwardBtn: true });
          break;
        case "leftwardActive":
          setState({ leftwardBtn: true });
          break;
        case "rightwardActive":
          setState({ rightwardBtn: true });
          break;
        case "jumpActive":
          setState({ jumpBtn: true });
          break;
        case "forwardBreak":
          setState({ forwardBtn: false });
          break;
        case "backwardBreak":
          setState({ backwardBtn: false });
          break;
        case "leftwardBreak":
          setState({ leftwardBtn: false });
          break;
        case "rightwardBreak":
          setState({ rightwardBtn: false });
          break;
        case "jumpBreak":
          setState({ jumpBtn: false });
          break;
        case "none":
          setState({
            forwardBtn: false,
            backwardBtn: false,
            leftwardBtn: false,
            rightwardBtn: false,
            jumpBtn: false,
          });
          break;
      }
    },
  }))
);
