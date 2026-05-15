window.OSApps = window.OSApps || [];

window.OSApps.push({
id:"game2048App",
name:"2+2 Block",
icon:"https://2048.gg/assets/img/2048-game.png",

render(){
return `
<div class="origin-header liquid">
<button class="backBtn liquid" onclick="closeCurrentApp()">←</button>
<h2>2+2 Block</h2>
</div>

<div class="app-content">

<div class="game-card liquid">

<div class="game-head">
<div>
<h1>2+2 Block</h1>
<p>Merge numbers to reach 2048</p>
</div>

<button onclick="game2048Reset()">
Reset
</button>
</div>

<div class="game-score">
Score: <b id="score2048">0</b>
</div>

<div id="board2048" class="board-2048"></div>

<p class="game-hint">
Keyboard: Arrow keys. Mobile: swipe.
</p>

</div>

</div>
`;
},

init(){
game2048Init();
}
});

let board2048 = [];
let score2048 = 0;
let touch2048StartX = 0;
let touch2048StartY = 0;

function game2048Init(){

board2048 =
Array(4).fill(null).map(()=>Array(4).fill(0));

score2048 = 0;

game2048AddTile();
game2048AddTile();

game2048Render();

document.addEventListener("keydown",game2048KeyHandler);

const board =
document.getElementById("board2048");

if(board){

board.ontouchstart =
(e)=>{

touch2048StartX = e.touches[0].clientX;
touch2048StartY = e.touches[0].clientY;

};

board.ontouchend =
(e)=>{

const dx =
e.changedTouches[0].clientX - touch2048StartX;

const dy =
e.changedTouches[0].clientY - touch2048StartY;

if(Math.abs(dx) > Math.abs(dy)){

game2048Move(dx > 0 ? "right" : "left");

}else{

game2048Move(dy > 0 ? "down" : "up");

}

};

}

}

function game2048Reset(){

game2048Init();

}

function game2048AddTile(){

const empty = [];

for(let r = 0; r < 4; r++){

for(let c = 0; c < 4; c++){

if(board2048[r][c] === 0){
empty.push([r,c]);
}

}

}

if(empty.length === 0) return;

const [r,c] =
empty[Math.floor(Math.random() * empty.length)];

board2048[r][c] =
Math.random() < .9 ? 2 : 4;

}

function game2048Render(){

const board =
document.getElementById("board2048");

const score =
document.getElementById("score2048");

if(!board) return;

if(score) score.innerText = score2048;

board.innerHTML = "";

for(let r = 0; r < 4; r++){

for(let c = 0; c < 4; c++){

const value =
board2048[r][c];

const cell =
document.createElement("div");

cell.className =
"tile-2048" + (value ? ` tile-${value}` : "");

cell.innerText =
value || "";

board.appendChild(cell);

}

}

}

function game2048KeyHandler(e){

const active =
document.querySelector(".os-app-window[style*='display: block']");

if(!active || !active.innerHTML.includes("2+2 Block")) return;

const key =
e.key.toLowerCase();

if(e.key === "ArrowUp" || key === "w"){
e.preventDefault();
game2048Move("up");
}

if(e.key === "ArrowDown" || key === "s"){
e.preventDefault();
game2048Move("down");
}

if(e.key === "ArrowLeft" || key === "a"){
e.preventDefault();
game2048Move("left");
}

if(e.key === "ArrowRight" || key === "d"){
e.preventDefault();
game2048Move("right");
}

}

function game2048Move(direction){

const before =
JSON.stringify(board2048);

if(direction === "left"){
board2048 = board2048.map(row=>game2048Slide(row));
}

if(direction === "right"){
board2048 = board2048.map(row=>game2048Slide(row.reverse()).reverse());
}

if(direction === "up"){
game2048Transpose();
board2048 = board2048.map(row=>game2048Slide(row));
game2048Transpose();
}

if(direction === "down"){
game2048Transpose();
board2048 = board2048.map(row=>game2048Slide(row.reverse()).reverse());
game2048Transpose();
}

const after =
JSON.stringify(board2048);

if(before !== after){

game2048AddTile();
game2048Render();

}

}

function game2048Slide(row){

let arr =
row.filter(v=>v);

for(let i = 0; i < arr.length - 1; i++){

if(arr[i] === arr[i + 1]){

arr[i] *= 2;
score2048 += arr[i];

arr[i + 1] = 0;

}

}

arr =
arr.filter(v=>v);

while(arr.length < 4){
arr.push(0);
}

return arr;

}

function game2048Transpose(){

board2048 =
board2048[0].map((_,c)=>
board2048.map(row=>row[c])
);

}

function stop2048Game(){

document.removeEventListener("keydown", game2048KeyHandler);

}
