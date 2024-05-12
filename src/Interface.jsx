import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import { useGame } from "./store/useGame";

export const Interface = () => {
    const timeRef = useRef();

    const [isHowToSectionActive, setIsHowToSectionActive] = useState(false);

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
            setActiveBtn: state.setActiveBtn,
            forwardBtn: state.forwardBtn,
            backwardBtn: state.backwardBtn,
            leftwardBtn: state.leftwardBtn,
            rightwardBtn: state.rightwardBtn,
            jumpBtn: state.jumpBtn,
        }))

    const handleClick = () => {
        localStorage.setItem("level", +level + 1);

        window.location.reload()
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
        });

        return () => {
            unsubscribeEffect();
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

            {/* How to play? */}
            <div className={`how-to__container ${isHowToSectionActive && "active"}`}>
                <div className="toggle-button" onClick={() => setIsHowToSectionActive(prev => !prev)}>?</div>
                <div>
                    Use the W, S, D, A or the control buttons down below to play. you can also use arrow keys to play.
                    if the ball doesn&apos;t move, simply restart the game. You can also download the game.

                    <button className="download-btn" onClick={() => alert(`To install the app look for "Add to Homescreen" or install in your browser's menu.`)}>Download Game</button>
                </div>
            </div>

            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div
                        onTouchStart={() => setActiveBtn("forwardActive")}
                        onTouchEnd={() => setActiveBtn("forwardBreak")}
                        className={`key ${(forward || forwardBtn) && "active"}`}
                    />
                </div>
                <div className="raw">
                    <div
                        onTouchStart={() => setActiveBtn("leftwardActive")}
                        onTouchEnd={() => setActiveBtn("leftwardBreak")}
                        className={`key ${(leftward || leftwardBtn) && "active"}`}
                    />
                    <div
                        onTouchStart={() => setActiveBtn("backwardActive")}
                        onTouchEnd={() => setActiveBtn("backwardBreak")}
                        className={`key ${(backward || backwardBtn) && "active"}`}
                    />
                    <div
                        onTouchStart={() => setActiveBtn("rightwardActive")}
                        onTouchEnd={() => setActiveBtn("rightwardBreak")}
                        className={`key ${(rightward || rightwardBtn) && "active"}`}
                    />
                </div>
                <div className="raw">
                    <div
                        onTouchStart={() => setActiveBtn("jumpActive")}
                        onTouchEnd={() => setActiveBtn("jumpBreak")}
                        className={`key large ${(jump || jumpBtn) && "active"}`}
                    />
                </div>
            </div>
        </div>
    )
}
