import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGame } from "../store/useGame";

const BlocksLeft = () => {
  const { positionZ, numOfBlocks } = useGame((state) => ({
    positionZ: state.zPosition,
    numOfBlocks: state.level * 5,
  }));

  return (
    <span style={{ fontSize: "1rem" }}>
      {Math.max(Math.ceil(positionZ / 4 + numOfBlocks), 0)} Blocks left
    </span>
  );
};

export const Timer = () => {
  const timeRef = useRef();

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime = (elapsedTime /= 1000).toFixed(2);

      elapsedTime = elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime;

      elapsedTime = elapsedTime.toString().replace(".", " : ");

      if (timeRef.current) timeRef.current.textContent = elapsedTime;
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);
  return (
    <div className="timer">
      <span ref={timeRef} style={{ borderBottom: "1px solid white" }}>
        00 : 00
      </span>

      <BlocksLeft />
    </div>
  );
};
