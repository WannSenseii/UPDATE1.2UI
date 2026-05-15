window.OSApps = window.OSApps || [];

window.OSApps.push({
id:"chromeApp",
name:"Chrome",
icon:"https://play-lh.googleusercontent.com/MGwlmZ9iUgnJQKGCWdstBDltLDJEgAJUB-2NKaoLJeCz_V1U2R22P8BFHsJjeJDasIw=w240-h480-rw",

render(){
return `
<div class="origin-header liquid">
<button class="backBtn liquid" onclick="closeCurrentApp()">←</button>
<h2>Chrome</h2>
</div>

<div class="app-content">

<div class="chrome-card liquid">

<img
class="chrome-logo-img"
src="https://play-lh.googleusercontent.com/MGwlmZ9iUgnJQKGCWdstBDltLDJEgAJUB-2NKaoLJeCz_V1U2R22P8BFHsJjeJDasIw=w240-h480-rw">
<h1 class="chrome-title">Google</h1>

<div class="chrome-search-box liquid">
<input
id="chromeSearchInput"
placeholder="Search Google or type URL"
onkeydown="if(event.key==='Enter') chromeSearch()">

<button onclick="chromeSearch()">
Search
</button>
</div>

<div class="chrome-shortcuts">
<button onclick="chromeQuick('youtube.com')">YouTube</button>
<button onclick="chromeQuick('github.com')">GitHub</button>
<button onclick="chromeQuick('chatgpt.com')">ChatGPT</button>
<button onclick="chromeQuick('google.com')">Google</button>
</div>

<div id="chromeResults" class="chrome-results"></div>

</div>

</div>
`;
}
});

function chromeSearch(){

const input =
document.getElementById("chromeSearchInput");

const results =
document.getElementById("chromeResults");

if(!input || !results) return;

const raw =
input.value.trim();

if(!raw) return;

let url = "";

if(raw.includes(".") && !raw.includes(" ")){

url =
raw.startsWith("http")
? raw
: `https://${raw}`;

results.innerHTML =
`
<div class="chrome-result-card liquid">
<h3>${raw}</h3>
<p>Open website in a new tab.</p>
<button onclick="window.open('${url}','_blank')">
Open Website
</button>
</div>
`;

}else{

url =
`https://www.google.com/search?q=${encodeURIComponent(raw)}`;

results.innerHTML =
`
<div class="chrome-search-label">
Search results for <b>${raw}</b>
</div>

<div class="chrome-result-card liquid">
<h3>Google Search</h3>
<p>View full Google results for "${raw}".</p>
<button onclick="window.open('${url}','_blank')">
Open Google Results
</button>
</div>

<div class="chrome-result-card liquid">
<h3>Images</h3>
<p>Search images related to "${raw}".</p>
<button onclick="window.open('https://www.google.com/search?tbm=isch&q=${encodeURIComponent(raw)}','_blank')">
Open Images
</button>
</div>

<div class="chrome-result-card liquid">
<h3>YouTube</h3>
<p>Search videos related to "${raw}".</p>
<button onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(raw)}','_blank')">
Open YouTube
</button>
</div>
`;

}

showLiveNotif?.("Search Complete");

}

function chromeQuick(site){

const input =
document.getElementById("chromeSearchInput");

if(input){
input.value = site;
}

chromeSearch();

}