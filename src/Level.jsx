import { Float, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BoxGeometry,
  ColorManagement,
  Euler,
  MeshStandardMaterial,
  Quaternion
} from "three";

ColorManagement.legacyMode = false;

const boxGeometry = new BoxGeometry(1, 1, 1);

const firstFloorMaterial = new MeshStandardMaterial({
  color: "#DDDDDD",
  roughness: 0,
  metalness: 0,
});
const secondFloorMaterial = new MeshStandardMaterial({
  color: "#575757",
  roughness: 0,
  metalness: 0,
});
const obstacleMaterial = new MeshStandardMaterial({
  color: "#FF0000",
  roughness: 1,
  metalness: 0,
});
const wallMaterial = new MeshStandardMaterial({
  color: "#887777",
  roughness: 0,
  metalness: 0,
});


/*
Blocks
////////////////////////////////////////////
*/
const FirstBlock = ({ position = [0, 0, 0] }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <group position={position}>

      <Float floatIntensity={0.5} rotationIntensity={0.5}>
        <Text
          scale={0.4}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={isMobile ? [0.5, 1, -2.1] : [0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          MARBLE RACE
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>

      <mesh
        geometry={boxGeometry}
        material={firstFloorMaterial}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};

const LastBlock = ({ position = [0, 0, 0] }) => {
  const trophy = useGLTF("/marble-race/trophy/scene.gltf");

  return (
    <group position={position}>

      <Text
        font="/marble-race/fonts/Nunito-ExtraLight.ttf"
        scale={0.8}
        lineHeight={0.75}
        position={[0, 2.45, 0]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>

      <mesh
        geometry={boxGeometry}
        material={firstFloorMaterial}
        position-y={0}
        scale={[4, 0.2, 4]}
        receiveShadow
        castShadow
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={trophy.scene} scale={0.03} />
      </RigidBody>
    </group>
  );
};


/*
Traps
////////////////////////////////////////////
*/
const FirstSpinnerTrap = ({ position }) => {
  const obstacle = useRef();

  const [speed] = useState(
    () => (Math.random() + 0.5) * (Math.random() < 0.3 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, time * speed, 0));

    obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={secondFloorMaterial}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
};

const SecondSpinnerTrap = ({ position }) => {
  const obstacle = useRef();

  const [speed] = useState(
    () => (Math.random() + 0.7) * (Math.random() < 0.3 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(1.8, time * speed, 0));

    obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={secondFloorMaterial}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 1.6, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[4, 0.3, 0.3]}
          receiveShadow
          castShadow
        />
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[4, 0.3, 0.3]}
          rotation={[0, 1.5, 0]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
};

const LimboTrap = ({ position }) => {
  const obstacle = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;

    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={secondFloorMaterial}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
};

const AxeTrap = ({ position }) => {
  const obstacle = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={secondFloorMaterial}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
};

/*
Walls
////////////////////////////////////////////
*/
const Bounds = ({ length }) => {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        position={[2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
      />
      <mesh
        position={[-2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[0, 0.75, -(length * 4) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, 0.3]}
        receiveShadow
      />

      {/* Physic */}
      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
};

export const Level = ({
  count = 5,
  trapTypes = [FirstSpinnerTrap, SecondSpinnerTrap, LimboTrap, AxeTrap],
}) => {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = trapTypes[Math.floor(Math.random() * trapTypes.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, trapTypes]);

  return (
    <>
      <FirstBlock position={[0, 0, 0]} />
      {blocks.map((Block, i) => (
        <Block key={i} position={[0, 0, -(i + 1) * 4]} />
      ))}
      <LastBlock position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};
