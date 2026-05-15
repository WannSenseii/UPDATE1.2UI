window.OSApps = window.OSApps || [];

window.OSApps.push({
id:"musicApp",
name:"Music",
icon:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/3840px-Spotify_logo_without_text.svg.png",

render(){
return `
<div class="origin-header liquid">
<button class="backBtn liquid" onclick="closeCurrentApp()">←</button>
<h2>Music</h2>
</div>

<div class="app-content">

<div class="music-card liquid">

<img
id="musicCover"
class="music-cover"
src="https://i.scdn.co/image/ab67616d0000b273e8b28a56f6f033c2e499b17d">

<h1 id="musicTitle" class="music-title">Night Drive</h1>
<p id="musicArtist" class="music-artist">Origin Music</p>

<div class="music-progress-wrap">
<div class="music-progress">
<div id="musicProgressFill"></div>
</div>

<div class="music-time-row">
<span id="musicCurrent">0:00</span>
<span id="musicDuration">0:00</span>
</div>
</div>

<div class="music-controls">

<button onclick="musicPrev()" class="music-control-btn">⏮</button>

<button onclick="musicToggle()" id="musicPlayBtn" class="music-main-btn">▶</button>

<button onclick="musicNext()" class="music-control-btn">⏭</button>

</div>

<div class="music-custom liquid">

<h3>Add YouTube Song</h3>

<input
id="customSongSrc"
placeholder="Paste YouTube URL">

<button onclick="musicAddCustomSong()">
Import from YouTube
</button>

</div>

<div class="music-list" id="musicList"></div>

<audio id="musicAudio"></audio>

<div id="youtubePlayerBox" class="youtube-player-box"></div>

</div>

</div>
`;
},

init(){
musicInit();
}
});

let originTracks = [
{
title:"Night Drive",
artist:"Origin Music",
cover:"https://i.scdn.co/image/ab67616d0000b273e8b28a56f6f033c2e499b17d",
src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
},
{
title:"Soft Waves",
artist:"Demo Track",
cover:"https://i.scdn.co/image/ab67616d0000b2735d2e0f1a60cbbd8f0f1e9c75",
src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
},
{
title:"Pixel Rain",
artist:"Virtual Audio",
cover:"https://i.scdn.co/image/ab67616d0000b273c6f7af36ecdc3f3ffbcdddc7",
src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
}
];

let originMusicIndex = 0;
let originMusicPlaying = false;

function loadCustomSongs(){

const saved =
JSON.parse(localStorage.getItem("originCustomSongs") || "[]");

originTracks =
originTracks.concat(saved);

}

function saveCustomSongs(){

const customOnly =
originTracks.slice(3);

localStorage.setItem(
"originCustomSongs",
JSON.stringify(customOnly)
);

}

function musicInit(){

loadCustomSongs();

const audio =
document.getElementById("musicAudio");

if(!audio) return;

musicRenderList();

musicLoad(originMusicIndex,false);

audio.ontimeupdate =
()=> updateMusicProgress();

audio.onended =
()=> musicNext();

}

function musicRenderList(){

const list =
document.getElementById("musicList");

if(!list) return;

list.innerHTML = "";

originTracks.forEach((track,index)=>{

const btn =
document.createElement("button");

btn.innerHTML =
`
<div>
<span>${track.title}</span>
<small>${track.artist}</small>
</div>

${index >= 3 ? `<b onclick="event.stopPropagation(); musicDeleteCustom(${index})">×</b>` : ``}
`;

btn.onclick =
()=> musicSelect(index);

list.appendChild(btn);

});

}

function musicLoad(index,autoplay = false){

originMusicIndex = index;

const track =
originTracks[originMusicIndex];

const audio =
document.getElementById("musicAudio");

const youtubeBox =
document.getElementById("youtubePlayerBox");

const cover =
document.getElementById("musicCover");

const title =
document.getElementById("musicTitle");

const artist =
document.getElementById("musicArtist");

if(!track) return;

if(cover) cover.src = track.cover;
if(title) title.innerText = track.title;
if(artist) artist.innerText = track.artist;

updateMiniPlayer(track);

if(youtubeBox){
youtubeBox.innerHTML = "";
}

if(audio){
audio.pause();
audio.src = "";
}

if(isYouTubeUrl(track.src)){

const embed =
getYouTubeEmbedUrl(track.src);

if(youtubeBox){

youtubeBox.innerHTML =
`
<iframe
src="${embed}"
title="YouTube player"
referrerpolicy="strict-origin-when-cross-origin"
allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen>
</iframe>
`;

}

originMusicPlaying = true;

updateMusicButton();

showMiniPlayer();
updateMiniPlayer(track);
updateIslandMusic(track);

showLiveNotif?.("Tap Play on YouTube");

return;

}

if(!audio) return;

audio.src = track.src;

if(autoplay){

audio.play();

originMusicPlaying = true;

updateMusicButton();

showMiniPlayer();

updateIslandMusic(track);

}

}

function musicToggle(){

const track =
originTracks[originMusicIndex];

const audio =
document.getElementById("musicAudio");

const youtubeBox =
document.getElementById("youtubePlayerBox");

if(!track) return;

if(isYouTubeUrl(track.src)){

if(youtubeBox && youtubeBox.innerHTML.trim() !== ""){

youtubeBox.innerHTML = "";

originMusicPlaying = false;

hideMiniPlayer();
clearIslandMusic();

}else{

musicLoad(originMusicIndex,true);

originMusicPlaying = true;

}

updateMusicButton();

return;

}

if(!audio) return;

if(originMusicPlaying){

audio.pause();

originMusicPlaying = false;

hideMiniPlayer();

clearIslandMusic();

}else{

audio.play();

originMusicPlaying = true;

showMiniPlayer();

updateMiniPlayer(track);

updateIslandMusic(track);

}

updateMusicButton();

}

function musicNext(){

const next =
(originMusicIndex + 1) % originTracks.length;

musicLoad(next,true);

}

function musicPrev(){

const prev =
(originMusicIndex - 1 + originTracks.length) % originTracks.length;

musicLoad(prev,true);

}

function musicSelect(index){

musicLoad(index,true);

}

function updateMusicButton(){

const btn =
document.getElementById("musicPlayBtn");

if(!btn) return;

btn.innerText =
originMusicPlaying ? "⏸" : "▶";

}

function updateMusicProgress(){

const audio =
document.getElementById("musicAudio");

const fill =
document.getElementById("musicProgressFill");

const current =
document.getElementById("musicCurrent");

const duration =
document.getElementById("musicDuration");

if(!audio || !fill) return;

const percent =
audio.duration
? (audio.currentTime / audio.duration) * 100
: 0;

fill.style.width =
`${percent}%`;

if(current){
current.innerText = formatMusicTime(audio.currentTime);
}

if(duration){
duration.innerText = formatMusicTime(audio.duration || 0);
}

}

function formatMusicTime(seconds){

if(!seconds || Number.isNaN(seconds)) return "0:00";

const min =
Math.floor(seconds / 60);

const sec =
Math.floor(seconds % 60)
.toString()
.padStart(2,"0");

return `${min}:${sec}`;

}

function getYouTubeEmbedUrl(url){

const videoId =
getYouTubeVideoId(url);

if(!videoId) return "";

return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;

}

function isYouTubeUrl(url){

return (
url.includes("youtube.com") ||
url.includes("youtu.be")
);

}

function getYouTubeVideoId(url){

if(!url) return "";

if(url.includes("youtube.com/watch")){

try{

const params =
new URL(url).searchParams;

return params.get("v") || "";

}catch{
return "";
}

}

if(url.includes("youtu.be/")){

return url
.split("youtu.be/")[1]
?.split("?")[0]
?.split("&")[0] || "";

}

if(url.includes("youtube.com/embed/")){

return url
.split("youtube.com/embed/")[1]
?.split("?")[0]
?.split("&")[0] || "";

}

return "";

}

async function getYouTubeTitle(url){

try{

const res =
await fetch(
`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
);

const data =
await res.json();

return data.title || "YouTube Video";

}catch{

return "YouTube Video";

}

}

async function musicAddCustomSong(){

const src =
document.getElementById("customSongSrc")?.value.trim();

if(!src){

showLiveNotif?.("Paste YouTube URL");
return;

}

if(!isYouTubeUrl(src)){

showLiveNotif?.("YouTube URL only");
return;

}

const videoId =
getYouTubeVideoId(src);

if(!videoId){

showLiveNotif?.("Invalid YouTube URL");
return;

}

const title =
await getYouTubeTitle(src);

const cover =
`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

originTracks.push({
title,
artist:"YouTube",
cover,
src
});

saveCustomSongs();

musicRenderList();

document.getElementById("customSongSrc").value = "";

showLiveNotif?.("YouTube Song Added");

}

function musicDeleteCustom(index){

if(index < 3) return;

originTracks.splice(index,1);

saveCustomSongs();

if(originMusicIndex === index){
originMusicIndex = 0;
musicLoad(0,false);
}

musicRenderList();

showLiveNotif?.("Song Removed");

}

function updateMiniPlayer(track){

const miniTitle =
document.getElementById("miniTitle");

const miniThumb =
document.getElementById("miniThumb");

if(miniTitle) miniTitle.innerText = track.title;
if(miniThumb) miniThumb.src = track.cover;

}

function showMiniPlayer(){

const mini =
document.getElementById("miniPlayer");

if(!mini) return;

mini.style.display = "flex";

}

function hideMiniPlayer(){

const mini =
document.getElementById("miniPlayer");

if(!mini) return;

mini.style.display = "none";

}

function updateIslandMusic(track){

const islandSong =
document.getElementById("islandSong");

const islandTimer =
document.getElementById("islandTimer");

if(islandSong){
islandSong.innerText = `🎵 ${track.title}`;
}

if(islandTimer){
islandTimer.innerText = "Playing";
}

activateIsland?.();

}

function clearIslandMusic(){

const islandSong =
document.getElementById("islandSong");

const islandTimer =
document.getElementById("islandTimer");

if(islandSong){
islandSong.innerText = "";
}

if(islandTimer){
islandTimer.innerText = "";
}

}