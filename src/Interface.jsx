import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

import { useGame } from "./store/useGame"

export const Interface = () => {
    const timeRef = useRef()

    const { forward, backward, leftward, rightward, jump } =
        useKeyboardControls((state) => ({
            forward: state.forward,
            backward: state.backward,
            leftward: state.leftward,
            rightward: state.rightward,
            jump: state.jump,
        }));

    const {
        phase,
        restartGame,
        level,
        setLevel,
        setActiveBtn,
        forwardBtn,
        backwardBtn,
        leftwardBtn,
        rightwardBtn,
        jumpBtn,
    } =
        useGame(state => ({
            phase: state.phase,
            restartGame: state.restart,
            level: state.level,
            setLevel: state.setLevel,
            setActiveBtn: state.setActiveBtn,
            forwardBtn: state.forwardBtn,
            backwardBtn: state.backwardBtn,
            leftwardBtn: state.leftwardBtn,
            rightwardBtn: state.rightwardBtn,
            jumpBtn: state.jumpBtn,
        }))

    const handleClick = () => {
        localStorage.setItem("level", +level + 1);

        setLevel()

        restartGame()
    }

    const handleRestart = () => {
        setActiveBtn("none")
        restartGame()
    }

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()

            let elapsedTime = 0;

            if (state.phase === "playing") {
                elapsedTime = Date.now() - state.startTime;
            } else if (state.phase === "ended") {
                elapsedTime = state.endTime - state.startTime
            }

            elapsedTime = (elapsedTime /= 1000).toFixed(2);

            elapsedTime = elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime;

            elapsedTime = elapsedTime.toString().replace(".", " : ")

            if (timeRef.current) timeRef.current.textContent = elapsedTime
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])


    return (
        <div className="interface">

            {/* Level */}
            <span className="level-display">Level: {level}</span>

            {/* Restart */}
            <span
                className="restart-btn"
                onClick={restartGame}
            >
                Restart
            </span>

            {/* Timer */}
            <div className="timer" ref={timeRef}>
                00 : 00
            </div>

            {/* Restart */}
            {phase === "ended" && (
                <div className="events">
                    <div onClick={phase === "ended" ? handleRestart : () => { }} className="event-items">Restart</div>
                    <div onClick={phase === "ended" ? handleClick : () => { }} className="event-items">{level == 15 ? "Start again" : "Next"}</div>
                </div>
            )}

            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div
                        onMouseOver={() => setActiveBtn("forwardActive")}
                        onMouseOut={() => setActiveBtn("forwardBreak")}
                        className={`key ${(forward || forwardBtn) && "active"}`}
                    />
                </div>
                <div className="raw">
                    <div
                        onMouseOver={() => setActiveBtn("leftwardActive")}
                        onMouseOut={() => setActiveBtn("leftwardBreak")}
                        className={`key ${(leftward || leftwardBtn) && "active"}`}
                    />
                    <div
                        onMouseOver={() => setActiveBtn("backwardActive")}
                        onMouseOut={() => setActiveBtn("backwardBreak")}
                        className={`key ${(backward || backwardBtn) && "active"}`}
                    />
                    <div
                        onMouseOver={() => setActiveBtn("rightwardActive")}
                        onMouseOut={() => setActiveBtn("rightwardBreak")}
                        className={`key ${(rightward || rightwardBtn) && "active"}`}
                    />
                </div>
                <div className="raw">
                    <div
                        onMouseOver={() => setActiveBtn("jumpActive")}
                        onMouseOut={() => setActiveBtn("jumpBreak")}
                        className={`key large ${(jump || jumpBtn) && "active"}`}
                    />
                </div>
            </div>
        </div>
    )
}
