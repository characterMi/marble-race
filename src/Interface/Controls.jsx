import { useKeyboardControls } from "@react-three/drei";
import { useGame } from "../store/useGame";

export const Controls = ({ setActiveBtn }) => {
  const { forward, backward, leftward, rightward, jump } = useKeyboardControls(
    (state) => ({
      forward: state.forward,
      backward: state.backward,
      leftward: state.leftward,
      rightward: state.rightward,
      jump: state.jump,
    })
  );

  const { forwardBtn, backwardBtn, leftwardBtn, rightwardBtn, jumpBtn } =
    useGame((state) => ({
      forwardBtn: state.forwardBtn,
      backwardBtn: state.backwardBtn,
      leftwardBtn: state.leftwardBtn,
      rightwardBtn: state.rightwardBtn,
      jumpBtn: state.jumpBtn,
    }));

  return (
    <div className="controls">
      <div className="raw">
        <button
          onTouchStart={() => setActiveBtn("forwardActive")}
          onTouchEnd={() => setActiveBtn("forwardBreak")}
          className={`key ${(forward || forwardBtn) && "active"}`}
        />
      </div>
      <div className="raw">
        <button
          onTouchStart={() => setActiveBtn("leftwardActive")}
          onTouchEnd={() => setActiveBtn("leftwardBreak")}
          className={`key ${(leftward || leftwardBtn) && "active"}`}
        />
        <button
          onTouchStart={() => setActiveBtn("backwardActive")}
          onTouchEnd={() => setActiveBtn("backwardBreak")}
          className={`key ${(backward || backwardBtn) && "active"}`}
        />
        <button
          onTouchStart={() => setActiveBtn("rightwardActive")}
          onTouchEnd={() => setActiveBtn("rightwardBreak")}
          className={`key ${(rightward || rightwardBtn) && "active"}`}
        />
      </div>
      <div className="raw">
        <button
          onTouchStart={() => setActiveBtn("jumpActive")}
          onTouchEnd={() => setActiveBtn("jumpBreak")}
          className={`key large ${(jump || jumpBtn) && "active"}`}
        />
      </div>
    </div>
  );
};
