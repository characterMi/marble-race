import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, useRapier } from "@react-three/rapier";

import { useGame } from "./store/useGame"

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef();
  const { rapier, world } = useRapier();
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const {
    startGame,
    endGame,
    restartGame,
    blocksCount,
    forwardBtn,
    backwardBtn,
    leftwardBtn,
    rightwardBtn,
    setActiveBtn,
  } = useGame(state => ({
    startGame: state.start,
    endGame: state.end,
    restartGame: state.restart,
    blocksCount: state.level * 5, /* we already know that for each level we add 5 blocks. so to get blocks count, we multiply the level to 5 */
    forwardBtn: state.forwardBtn,
    backwardBtn: state.backwardBtn,
    leftwardBtn: state.leftwardBtn,
    rightwardBtn: state.rightwardBtn,
    setActiveBtn: state.setActiveBtn,
  }))

  const resetGame = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  }

  const jumpHandler = () => {
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
        if (phase === "ready") resetGame()
      },
    )

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (jump) => jump && jumpHandler()
    );

    const unsubscribeJumpBtn = useGame.subscribe(
      (state) => state.jumpBtn,
      (jump) => jump && jumpHandler()
    );

    const unsubscribeAny = subscribeKeys(() => startGame())

    const unsubscribeAnyBtn = useGame.subscribe(
      (state) => ({
        f: state.forwardBtn,
        b: state.backwardBtn,
        l: state.leftwardBtn,
        r: state.rightwardBtn,
      }),
      ({ f, b, l, r }) => (f || b || l || r) && startGame(),
    )

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

    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward || forwardBtn) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    } else if (rightward || rightwardBtn) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    } else if (backward || backwardBtn) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    } else if (leftward || leftwardBtn) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */

    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);

    cameraPosition.z += 3.5;
    cameraPosition.y += 0.95;

    const cameraTarget = new THREE.Vector3();
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
      setActiveBtn("none")
      endGame()
    }

    if (bodyPosition.y < -10) {
      setActiveBtn("none")
      restartGame()
    }
  });

  return (
    <RigidBody
      colliders="ball"
      restitution={0.2}
      friction={1}
      position={[0, 1, 0]}
      ref={body}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};