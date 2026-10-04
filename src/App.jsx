import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mode, setMode] = useState("stopwatch");

  return (
    <div className="app">
      <div className="glass-card">
        <h1>⏱ Time Keeper</h1>

        <div className="mode-switch">
          <button
            className={mode === "stopwatch" ? "active" : ""}
            onClick={() => setMode("stopwatch")}
          >
            Stopwatch
          </button>

          <button
            className={mode === "timer" ? "active" : ""}
            onClick={() => setMode("timer")}
          >
            Timer
          </button>
        </div>

        {mode === "stopwatch" ? <Stopwatch /> : <Timer />}
      </div>
    </div>
  );
}

/* ---------------- STOPWATCH ---------------- */

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function addLap() {
    if (running) {
      setLaps((previousLaps) => [...previousLaps, time]);
    }
  }

  function reset() {
    setRunning(false);
    setTime(0);
    setLaps([]);
  }

  return (
    <div>
      <h2>Stopwatch</h2>

      <TimeDisplay
        time={formatTime(time)}
        running={running}
      />

      <div className="buttons">
        <button onClick={() => setRunning(true)}>Start</button>

        <button onClick={() => setRunning(false)}>
          Stop
        </button>

        <button onClick={addLap}>
          Lap
        </button>

        <button onClick={reset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps">
          <h3>Laps</h3>

          {laps.map((lap, index) => (
            <p key={index}>
              Lap {index + 1}: {formatTime(lap)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- TIMER ---------------- */
function Timer() {
  const [hours, setHours] = useState(""); 
  const [minutes, setMinutes] = useState(""); 
  const [secondsInput, setSecondsInput] = useState(""); 
  const [seconds, setSeconds] = useState(0); 
  const [running, setRunning] = useState(false); 
  const [timerName, setTimerName] = useState(""); 
  const [completed, setCompleted] = useState(false); 
  
  // Timer countdown 
  useEffect(() => { 
    let interval; 
    if (running && seconds > 0) { 
      interval = setInterval(() => { 
        setSeconds((previousSeconds) => previousSeconds - 1); 
      }, 1000); 
    } 
    
    return () => clearInterval(interval); 
  }, [running, seconds]); 
  
  // Timer completed
  useEffect(() => { 
    if (seconds === 0 && running) { 
      setRunning(false); setCompleted(true); 
    } }, [seconds, running]); 
    
  // Convert HH:MM:SS into total seconds 
  
  function createTimer() { 
    const h = Number(hours) || 0; 
    const m = Number(minutes) || 0; 
    const s = Number(secondsInput) || 0; 
    const totalSeconds = h * 3600 + m * 60 + s; 
    if (totalSeconds > 0) { 
      setSeconds(totalSeconds); 
      setRunning(false); 
      setCompleted(false); 
    } 
  } 
  
  function startTimer() { 
    if (seconds > 0) { 
      setRunning(true); 
      setCompleted(false); 
    } 
  } 
  
  function extendTimer() { 
    
    // Extend by 60 seconds 
    setSeconds((previousSeconds) => previousSeconds + 60); 
    setCompleted(false); 
  
  } 
  
  function resetTimer() { 
    setSeconds(0); 
    setRunning(false); 
    setCompleted(false); 
    setHours(""); 
    setMinutes(""); 
    setSecondsInput(""); 
    setTimerName(""); 
  } 
  
  // Convert total seconds back into HH:MM:SS 
  function formatTime(totalSeconds) { 
    const h = Math.floor(totalSeconds / 3600); 
    const m = Math.floor((totalSeconds % 3600) / 60); 
    const s = totalSeconds % 60; 
    
    return `${String(h).padStart(2, "0")}:${String(m).padStart( 2, "0" )}:${String(s).padStart(2, "0")}`; 
  
  } 
  
  return ( 
  <div> 
    <h2>Timer</h2> 

    {/* Timer name */} 
    <input className="input" type="text" placeholder="Timer name (e.g. Study)" value={timerName} onChange={(e) => setTimerName(e.target.value)} /> 
    
    {/* Show input only when timer is 0 */} 
    {seconds === 0 && !running && ( 
      <div className="time-inputs"> <input className="time-input" type="number" min="0" placeholder="HH" value={hours} onChange={(e) => setHours(e.target.value)} /> 
        <span>:</span> 
        <input className="time-input" type="number" min="0" max="59" placeholder="MM" value={minutes} onChange={(e) => setMinutes(e.target.value)} /> 
        <span>:</span> 
        <input className="time-input" type="number" min="0" max="59" placeholder="SS" value={secondsInput} onChange={(e) => setSecondsInput(e.target.value)} /> 
      </div> )} 
    {seconds === 0 && !running && ( <button onClick={createTimer}> Set Timer </button> )} 
    
    {/* Timer name */} 
    {timerName && ( <p className="timer-name"> {timerName} </p> )} 
    
    {/* Running timer */} 
    <TimeDisplay time={formatTime(seconds)} running={running} /> 
    <div className="buttons"> 
      <button onClick={startTimer} disabled={seconds === 0 || running} > Start </button> 
      <button onClick={() => setRunning(false)} disabled={!running} > Stop </button> 
      <button onClick={extendTimer}> +60 sec </button> 
      <button onClick={resetTimer}> Reset </button> 
    </div> 
      
      {/* Completion toast */} 
      {completed && ( <Toast name={timerName || "Timer"} onClose={() => setCompleted(false)} /> )}         
  </div> ); 
}


  /* ---------------- SHARED COMPONENT ---------------- */

  function TimeDisplay({ time, running }) {
    return (
      <div className={running ? "time running" : "time"}>
        {time}
      </div>
    );
  }

  /* ---------------- TOAST ---------------- */

  function Toast({ name, onClose }) {
    return (
      <div className="toast">
        <div>
          <p> <strong>Your timer has finished ✅</strong></p>
        </div>

        <button onClick={onClose}>×</button>
      </div>
    );
  }

export default App;