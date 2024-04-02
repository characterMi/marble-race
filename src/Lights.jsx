import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const Lights = () => {
  const light_ref = useRef()

  useFrame((state) => {
    light_ref.current.position.z = state.camera.position.z + 1 - 4
    light_ref.current.target.position.z = state.camera.position.z - 4
    light_ref.current.target.updateMatrixWorld()
  })

  return (
    <>
      <directionalLight
        ref={light_ref}
        castShadow
        position={[4, 5, 1]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  );
};
