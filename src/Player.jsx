import { RigidBody } from "@react-three/rapier";
import { usePlayer } from "./hooks/usePlayer";

export const Player = () => {
  const { body } = usePlayer();

  return (
    <RigidBody
      colliders="ball"
      restitution={0.2}
      friction={1}
      position={[0, 1, 0]}
      ref={body}
      linearDamping={0.5}
      angularDamping={0.5}
      canSleep={false}
      onSleep={(e) => e.preventDefault()}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};
