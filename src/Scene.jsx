import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, KeyboardControls, Stars, useProgress } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Lights } from "./Lights";
import { Level } from "./Level";
import { Player } from "./Player";
import { Interface } from "./Interface";

import { useGame } from "./store/useGame";

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html>
      <span>{progress.toFixed(2)}%</span>
    </Html>
  );
};

const Scene = () => {
  const level = useGame(state => state.level)
  const setLevel = useGame(state => state.setLevel)

  useEffect(() => {
    if (!localStorage.getItem('level')) {
      localStorage.setItem('level', 1)
    }

    if (!!localStorage.getItem("level") && localStorage.getItem("level") == 16) {
      localStorage.setItem("level", 1)
    }

    setLevel()
  }, [level, setLevel])

  return (
    <section className="canvas">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas shadows camera={{ position: [2.5, 4, 6], fov: 55 }}>
          <Suspense fallback={<Loader />}>

            <Stars speed={0.2} count={2000} />

            <Physics>
              <Lights />
              <Level count={level * 5 /* for each level, we add 5 more blocks */} />
              <Player />
            </Physics>
          </Suspense>
        </Canvas>

        <Interface />
      </KeyboardControls>
    </section>
  );
};

export default Scene;
