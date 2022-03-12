import React, { useState, useEffect } from "react";

import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || 0
  );

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.value === dice[0].value);
    if (allHeld && allSameValue) {
      setTenzies(true);
      if (bestScore > score || bestScore === 0) {
        setBestScore(score);
        localStorage.setItem("bestScore", JSON.stringify(bestScore));
      }
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      })
    );
    setScore((prevScore) => prevScore + 1);
  }

  function newGame() {
    setTenzies(false);
    setDice(allNewDice());
    setScore(0);
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function resetBestScore() {
    localStorage.clear();
    setBestScore(0);
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">{tenzies ? "You won!" : "Tenzies"}</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls. <br />{" "}
        <em>Share your lowest score on discord!</em>
      </p>
      <div className="score-display">
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={tenzies ? newGame : rollDice}>
        {tenzies ? "Play again?" : "Roll"}
      </button>
      <p onClick={resetBestScore} className="reset-best-score">
        Want to reset your best score? Click me!
      </p>
    </main>
  );
}
