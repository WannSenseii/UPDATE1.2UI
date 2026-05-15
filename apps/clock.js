window.OSApps = window.OSApps || [];

window.OSApps.push({
id:"clockApp",
name:"Clock",
icon:"https://www.macworld.com/wp-content/uploads/2025/02/mac911-alarm-clock-icon.png",

render(){
return `
<div class="origin-header liquid">
<button class="backBtn liquid" onclick="closeCurrentApp()">←</button>
<h2>Clock</h2>
</div>

<div class="app-content">

<div class="clock-app-card liquid">

<div class="clock-tabs">
<button class="active" onclick="clockShowTab('world', this)">World</button>
<button onclick="clockShowTab('stopwatch', this)">Stopwatch</button>
<button onclick="clockShowTab('timer', this)">Timer</button>
</div>

<div id="clockWorldTab" class="clock-tab-panel">

<h1 id="clockLocalTime" class="clock-big-time">00:00</h1>
<p class="clock-subtitle">Local Time</p>

<div class="world-list">
<div class="world-row">
<span>Jakarta</span>
<b id="worldJakarta">00:00</b>
</div>

<div class="world-row">
<span>Tokyo</span>
<b id="worldTokyo">00:00</b>
</div>

<div class="world-row">
<span>New York</span>
<b id="worldNewYork">00:00</b>
</div>

<div class="world-row">
<span>London</span>
<b id="worldLondon">00:00</b>
</div>
</div>

</div>

<div id="clockStopwatchTab" class="clock-tab-panel" style="display:none;">

<h1 id="stopwatchDisplay" class="clock-big-time">00:00.00</h1>
<p class="clock-subtitle">Stopwatch</p>

<div class="clock-actions">
<button onclick="startStopwatch()">Start</button>
<button onclick="pauseStopwatch()">Pause</button>
<button onclick="resetStopwatch()">Reset</button>
</div>

</div>

<div id="clockTimerTab" class="clock-tab-panel" style="display:none;">

<h1 id="timerDisplay" class="clock-big-time">00:00</h1>
<p class="clock-subtitle">Timer</p>

<div class="timer-inputs">
<input id="timerMinutes" type="number" placeholder="Minutes" min="0">
<input id="timerSeconds" type="number" placeholder="Seconds" min="0" max="59">
</div>

<div class="clock-actions">
<button onclick="startClockTimer()">Start</button>
<button onclick="pauseClockTimer()">Pause</button>
<button onclick="resetClockTimer()">Reset</button>
</div>

</div>

</div>

</div>
`;
},

init(){
clockAppInit();
}
});

/* =========================
   CLOCK APP LOGIC
========================= */

let clockInterval = null;

function clockAppInit(){

updateWorldClock();

if(clockInterval){
clearInterval(clockInterval);
}

clockInterval =
setInterval(updateWorldClock,1000);

updateStopwatchDisplay();
updateTimerDisplay();

}

function clockShowTab(tab,btn){

document
.querySelectorAll(".clock-tab-panel")
.forEach(panel=>panel.style.display = "none");

document
.querySelectorAll(".clock-tabs button")
.forEach(button=>button.classList.remove("active"));

if(btn){
btn.classList.add("active");
}

const target =
document.getElementById(
tab === "world"
? "clockWorldTab"
: tab === "stopwatch"
? "clockStopwatchTab"
: "clockTimerTab"
);

if(target){
target.style.display = "block";
}

}

function formatClockTime(date,timeZone){

return new Intl.DateTimeFormat("en-GB",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:false,
timeZone
}).format(date);

}

function updateWorldClock(){

const now =
new Date();

const local =
document.getElementById("clockLocalTime");

if(local){
local.innerText =
now.toLocaleTimeString("id-ID",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
});
}

const jakarta =
document.getElementById("worldJakarta");

const tokyo =
document.getElementById("worldTokyo");

const newYork =
document.getElementById("worldNewYork");

const london =
document.getElementById("worldLondon");

if(jakarta) jakarta.innerText = formatClockTime(now,"Asia/Jakarta");
if(tokyo) tokyo.innerText = formatClockTime(now,"Asia/Tokyo");
if(newYork) newYork.innerText = formatClockTime(now,"America/New_York");
if(london) london.innerText = formatClockTime(now,"Europe/London");

}

/* =========================
   STOPWATCH
========================= */

let stopwatchRunning = false;
let stopwatchStart = 0;
let stopwatchElapsed = 0;
let stopwatchRAF = null;

function startStopwatch(){

if(stopwatchRunning) return;

stopwatchRunning = true;
stopwatchStart = Date.now() - stopwatchElapsed;

runStopwatch();

}

function runStopwatch(){

if(!stopwatchRunning) return;

stopwatchElapsed =
Date.now() - stopwatchStart;

updateStopwatchDisplay();

stopwatchRAF =
requestAnimationFrame(runStopwatch);

}

function pauseStopwatch(){

stopwatchRunning = false;

if(stopwatchRAF){
cancelAnimationFrame(stopwatchRAF);
stopwatchRAF = null;
}

}

function resetStopwatch(){

pauseStopwatch();

stopwatchElapsed = 0;

updateStopwatchDisplay();

}

function updateStopwatchDisplay(){

const display =
document.getElementById("stopwatchDisplay");

if(!display) return;

const totalMs =
stopwatchElapsed;

const minutes =
Math.floor(totalMs / 60000);

const seconds =
Math.floor((totalMs % 60000) / 1000);

const centiseconds =
Math.floor((totalMs % 1000) / 10);

display.innerText =
`${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${String(centiseconds).padStart(2,"0")}`;

}

/* =========================
   TIMER
========================= */

let timerRunning = false;
let timerRemaining = 0;
let timerInterval = null;

function startClockTimer(){

const minInput =
document.getElementById("timerMinutes");

const secInput =
document.getElementById("timerSeconds");

if(!timerRunning && timerRemaining <= 0){

const minutes =
Number(minInput?.value || 0);

const seconds =
Number(secInput?.value || 0);

timerRemaining =
Math.max(0,(minutes * 60) + seconds);

}

if(timerRemaining <= 0){

showLiveNotif?.("Set Timer");
return;

}

timerRunning = true;

if(timerInterval){
clearInterval(timerInterval);
}

timerInterval =
setInterval(()=>{

timerRemaining--;

updateTimerDisplay();
updateTimerIsland();

if(timerRemaining <= 0){

finishClockTimer();

}

},1000);

updateTimerDisplay();
updateTimerIsland();

}

function pauseClockTimer(){

timerRunning = false;

if(timerInterval){
clearInterval(timerInterval);
timerInterval = null;
}

clearTimerIsland();

}

function resetClockTimer(){

pauseClockTimer();

timerRemaining = 0;

updateTimerDisplay();

}

function finishClockTimer(){

pauseClockTimer();

timerRemaining = 0;

updateTimerDisplay();

showLiveNotif?.("Timer Done");

const islandSong =
document.getElementById("islandSong");

const islandTimer =
document.getElementById("islandTimer");

if(islandSong) islandSong.innerText = "⏰ Timer";
if(islandTimer) islandTimer.innerText = "Done";

activateIsland?.();

setTimeout(()=>{

clearTimerIsland();

},2200);

}

function updateTimerDisplay(){

const display =
document.getElementById("timerDisplay");

if(!display) return;

const minutes =
Math.floor(timerRemaining / 60);

const seconds =
timerRemaining % 60;

display.innerText =
`${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

function updateTimerIsland(){

const islandSong =
document.getElementById("islandSong");

const islandTimer =
document.getElementById("islandTimer");

if(islandSong) islandSong.innerText = "⏰ Timer";

if(islandTimer){

const minutes =
Math.floor(timerRemaining / 60);

const seconds =
timerRemaining % 60;

islandTimer.innerText =
`${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

activateIsland?.();

}

function clearTimerIsland(){

const islandSong =
document.getElementById("islandSong");

const islandTimer =
document.getElementById("islandTimer");

if(islandSong) islandSong.innerText = "";
if(islandTimer) islandTimer.innerText = "";

}