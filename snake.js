window.OSApps = window.OSApps || [];

window.OSApps.push({
id:"snakeApp",
name:"Snake",
icon:"https://cdn-icons-png.freepik.com/512/3292/3292337.png",

render(){
return `
<div class="origin-header liquid">
<button class="backBtn liquid" onclick="closeCurrentApp()">←</button>
<h2>Snake</h2>
</div>

<div class="app-content">

<div class="game-card liquid">

<div class="game-head">
<div>
<h1>Snake</h1>
<p>Eat, grow, survive</p>
</div>

<button onclick="snakeReset()">
Reset
</button>
</div>

<div class="game-score">
Score: <b id="snakeScore">0</b>
</div>

<canvas id="snakeCanvas" width="260" height="260"></canvas>

<div class="snake-controls">
<button onclick="snakeSetDir('up')">↑</button>
<div>
<button onclick="snakeSetDir('left')">←</button>
<button onclick="snakeSetDir('down')">↓</button>
<button onclick="snakeSetDir('right')">→</button>
</div>
</div>

<p class="game-hint">
Keyboard: Arrow keys. Mobile: buttons.
</p>

</div>

</div>
`;
},

init(){
snakeInit();
}
});

let snakeCanvas = null;
let snakeCtx = null;
let snake = [];
let snakeFood = {x:5,y:5};
let snakeDir = "right";
let snakeNextDir = "right";
let snakeScoreValue = 0;
let snakeTimer = null;
let snakeGrid = 13;

function snakeInit(){

snakeCanvas =
document.getElementById("snakeCanvas");

if(!snakeCanvas) return;

snakeCtx =
snakeCanvas.getContext("2d");

snakeReset();

document.addEventListener("keydown",snakeKeyHandler);

let snakeTouchStartX = 0;
let snakeTouchStartY = 0;

snakeCanvas.ontouchstart =
(e)=>{

snakeTouchStartX = e.touches[0].clientX;
snakeTouchStartY = e.touches[0].clientY;

};

snakeCanvas.ontouchend =
(e)=>{

const dx =
e.changedTouches[0].clientX - snakeTouchStartX;

const dy =
e.changedTouches[0].clientY - snakeTouchStartY;

if(Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

if(Math.abs(dx) > Math.abs(dy)){

snakeSetDir(dx > 0 ? "right" : "left");

}else{

snakeSetDir(dy > 0 ? "down" : "up");

}

};

}

function snakeReset(){

snake = [
{x:4,y:6},
{x:3,y:6},
{x:2,y:6}
];

snakeDir = "right";
snakeNextDir = "right";
snakeScoreValue = 0;

snakeFood =
snakeRandomFood();

if(snakeTimer){
clearInterval(snakeTimer);
}

snakeTimer =
setInterval(snakeStep,145);

snakeDraw();

}

function snakeRandomFood(){

return {
x:Math.floor(Math.random() * snakeGrid),
y:Math.floor(Math.random() * snakeGrid)
};

}

function snakeSetDir(dir){

if(dir === "up" && snakeDir !== "down") snakeNextDir = "up";
if(dir === "down" && snakeDir !== "up") snakeNextDir = "down";
if(dir === "left" && snakeDir !== "right") snakeNextDir = "left";
if(dir === "right" && snakeDir !== "left") snakeNextDir = "right";

}

function snakeKeyHandler(e){

const active =
document.querySelector(".os-app-window[style*='display: block']");

if(!active || !active.innerHTML.includes("Snake")) return;

const key =
e.key.toLowerCase();

if(e.key === "ArrowUp" || key === "w"){
e.preventDefault();
snakeSetDir("up");
}

if(e.key === "ArrowDown" || key === "s"){
e.preventDefault();
snakeSetDir("down");
}

if(e.key === "ArrowLeft" || key === "a"){
e.preventDefault();
snakeSetDir("left");
}

if(e.key === "ArrowRight" || key === "d"){
e.preventDefault();
snakeSetDir("right");
}

}

function snakeStep(){

snakeDir = snakeNextDir;

const head =
{...snake[0]};

if(snakeDir === "up") head.y--;
if(snakeDir === "down") head.y++;
if(snakeDir === "left") head.x--;
if(snakeDir === "right") head.x++;

const hitWall =
head.x < 0 ||
head.y < 0 ||
head.x >= snakeGrid ||
head.y >= snakeGrid;

const hitSelf =
snake.some(part=>part.x === head.x && part.y === head.y);

if(hitWall || hitSelf){

showLiveNotif?.("Game Over");
snakeReset();
return;

}

snake.unshift(head);

if(head.x === snakeFood.x && head.y === snakeFood.y){

snakeScoreValue++;

snakeFood =
snakeRandomFood();

}else{

snake.pop();

}

snakeDraw();

}

function snakeDraw(){

if(!snakeCtx || !snakeCanvas) return;

const score =
document.getElementById("snakeScore");

if(score) score.innerText = snakeScoreValue;

const size =
snakeCanvas.width / snakeGrid;

snakeCtx.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);

snakeCtx.fillStyle = "#f2f2f4";
snakeCtx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height);

snakeCtx.fillStyle = "#ff5a1f";
snakeCtx.beginPath();
snakeCtx.roundRect(
snakeFood.x * size + 3,
snakeFood.y * size + 3,
size - 6,
size - 6,
8
);
snakeCtx.fill();

snake.forEach((part,index)=>{

snakeCtx.fillStyle =
index === 0 ? "#12b85a" : "#1ed760";

snakeCtx.beginPath();
snakeCtx.roundRect(
part.x * size + 2,
part.y * size + 2,
size - 4,
size - 4,
7
);
snakeCtx.fill();

});

}