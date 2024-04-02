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

    const { phase, restartGame, level, setLevel } =
        useGame(state => ({
            phase: state.phase,
            restartGame: state.restart,
            level: state.level,
            setLevel: state.setLevel,
        }))

    const handleClick = () => {
        localStorage.setItem("level", +level + 1);

        setLevel()

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
                className="level-display"
                style={{ right: "2rem", left: "unset", border: "none" }}
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
                    <div onClick={phase === "ended" ? restartGame : () => { }} className="event-items">Restart</div>
                    <div onClick={phase === "ended" ? handleClick : () => { }} className="event-items">{level == 15 ? "Start again" : "Next"}</div>
                </div>
            )}

            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward && "active"}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward && "active"}`}></div>
                    <div className={`key ${backward && "active"}`}></div>
                    <div className={`key ${rightward && "active"}`}></div>
                </div>
                <div className="raw">
                    <div className={`key large ${jump && "active"}`}></div>
                </div>
            </div>
        </div>
    )
}
