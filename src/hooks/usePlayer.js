import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

import { useGame } from "../store/useGame";

export const usePlayer = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef(null);
  const { rapier, world } = useRapier();
  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  const {
    phase,
    startGame,
    endGame,
    restartGame,
    blocksCount,
    forwardBtn,
    backwardBtn,
    leftwardBtn,
    rightwardBtn,
    setActiveBtn,
    setZPosition,
  } = useGame((state) => ({
    phase: state.phase,
    startGame: state.start,
    endGame: state.end,
    restartGame: state.restart,
    blocksCount:
      state.level *
      5 /* we already know that for each level we add 5 blocks. so to get blocks count, we multiply the level to 5 */,
    forwardBtn: state.forwardBtn,
    backwardBtn: state.backwardBtn,
    leftwardBtn: state.leftwardBtn,
    rightwardBtn: state.rightwardBtn,
    setActiveBtn: state.setActiveBtn,
    setZPosition: state.setZPosition,
  }));

  const resetGame = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  const jumpHandler = () => {
    if (phase === "ended") return;

    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.toi < 0.15) body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") resetGame();
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (jump) => {
        if (jump) jumpHandler();
      }
    );

    const unsubscribeJumpBtn = useGame.subscribe(
      (state) => state.jumpBtn,
      (jump) => {
        if (jump) {
          jumpHandler();
          startGame();
        }
      }
    );

    const unsubscribeAny = subscribeKeys(() => startGame());

    const unsubscribeAnyBtn = useGame.subscribe(
      (state) =>
        state.forwardBtn ||
        state.backwardBtn ||
        state.leftwardBtn ||
        state.rightwardBtn,
      (btn) => btn && startGame()
    );

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeJumpBtn();
      unsubscribeAny();
      unsubscribeAnyBtn();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Controls
     */
    if (phase !== "ended") {
      const { forward, backward, leftward, rightward } = getKeys();

      const impulse = { x: 0, y: 0, z: 0 };
      const torque = { x: 0, y: 0, z: 0 };

      const impulseStrength = 0.6 * delta;
      const torqueStrength = 0.2 * delta;

      if (forward || forwardBtn) {
        impulse.z -= impulseStrength;
        torque.x -= torqueStrength;
      }

      if (rightward || rightwardBtn) {
        impulse.x += impulseStrength;
        torque.z -= torqueStrength;
      }

      if (backward || backwardBtn) {
        impulse.z += impulseStrength;
        torque.x += torqueStrength;
      }

      if (leftward || leftwardBtn) {
        impulse.x -= impulseStrength;
        torque.z += torqueStrength;
      }

      body.current.applyImpulse(impulse);
      body.current.applyTorqueImpulse(torque);
    }

    /**
     * Camera & ball position
     */
    const bodyPosition = body.current.translation();
    setZPosition(Math.ceil(bodyPosition.z));

    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);

    cameraPosition.z += 3.5;
    cameraPosition.y += 0.95;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);

    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, delta * 5);
    smoothedCameraTarget.lerp(cameraTarget, delta * 5);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    /**
     * Phases
     */

    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      setActiveBtn("none");

      endGame();
    }

    if (bodyPosition.y < -10) {
      setActiveBtn("none");
      restartGame();
    }
  });

  return { body };
};
