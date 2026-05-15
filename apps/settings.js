window.OSApps = window.OSApps || [];

window.OSApps.push({
id:"settingsApp",
name:"Settings",
icon:"https://upload.wikimedia.org/wikipedia/commons/e/ea/Settings_%28iOS%29.png",

render(){
return `
<div class="origin-header liquid">
<button class="backBtn liquid" onclick="closeCurrentApp()">←</button>
<h2>Settings</h2>
</div>

<div class="app-content">

<div id="settingsLogin" class="settings-card liquid">
<h1>Sign in</h1>
<p>Use any username and password.</p>

<input id="settingsUsername" placeholder="Username">
<input id="settingsPassword" placeholder="Password" type="password">

<button onclick="settingsFakeLogin()">
Login
</button>
</div>

<div id="settingsHome" class="settings-home" style="display:none;">

<div class="settings-profile liquid">
<img src="./LogoWannUI.jpeg" onerror="this.style.display='none'">
<div>
<h2>WannUI Settings</h2>
<p id="settingsUserLabel">Signed in</p>
</div>
</div>

<div class="settings-menu">

<button class="settings-menu-item liquid" onclick="openAboutPhone()">
<div>
<h3>About Phone</h3>
<p>Device identity and specs</p>
</div>
<span>›</span>
</button>

<button class="settings-menu-item liquid" onclick="openAboutDev()">
<div>
<h3>About Dev</h3>
<p>Developer information</p>
</div>
<span>›</span>
</button>

<button class="settings-menu-item liquid danger-setting" onclick="factoryResetPhone()">
<div>
<h3>Reset Phone</h3>
<p>Clear all saved data</p>
</div>
<span>›</span>
</button>

</div>

</div>

<div id="aboutPhonePage" class="settings-subpage" style="display:none;">

<button class="settings-back-small" onclick="backToSettingsHome()">← Settings</button>

<div class="about-phone-card liquid">

<img class="about-logo" src="./LogoWannUI.png" onerror="this.style.display='none'">

<h1 id="aboutPhoneTitle">WannUI Phone</h1>

<div id="aboutPhoneDisplay" class="about-phone-display"></div>

</div>

<div class="settings-card liquid">

<h2>Customize About Phone</h2>

<input id="phoneBrand" placeholder="Merek HP / Device name">
<input id="phoneChipset" placeholder="Chipset">
<input id="phoneRam" placeholder="RAM">
<input id="phoneBattery" placeholder="Battery">
<input id="phoneStorage" placeholder="Storage">

<button onclick="saveAboutPhone()">
Save About Phone
</button>

</div>

</div>

<div id="aboutDevPage" class="settings-subpage" style="display:none;">

<button class="settings-back-small" onclick="backToSettingsHome()">← Settings</button>

<div class="settings-card liquid">
<h1>About Dev</h1>
<p style="margin-top:10px;line-height:1.6;">
Newcomer to Proggamming World, Please Patience If Theres Something Doesnt Good.</b>.
</p>
</div>

</div>

</div>
`;
},

init(){
settingsInit();
}
});

function settingsInit(){

const logged =
localStorage.getItem("wannuiSettingsLogged") === "true";

if(logged){
showSettingsHome();
}

loadAboutPhoneInputs();
renderAboutPhone();

}

function settingsFakeLogin(){

const username =
document.getElementById("settingsUsername")?.value.trim() || "User";

localStorage.setItem("wannuiSettingsLogged","true");
localStorage.setItem("wannuiSettingsUsername",username);

showSettingsHome();

showLiveNotif?.("Logged in");

}

function showSettingsHome(){

const login =
document.getElementById("settingsLogin");

const home =
document.getElementById("settingsHome");

const username =
localStorage.getItem("wannuiSettingsUsername") || "User";

if(login) login.style.display = "none";
if(home) home.style.display = "block";

const label =
document.getElementById("settingsUserLabel");

if(label){
label.innerText = `Signed in as ${username}`;
}

}

function hideAllSettingsPages(){

const home =
document.getElementById("settingsHome");

const aboutPhone =
document.getElementById("aboutPhonePage");

const aboutDev =
document.getElementById("aboutDevPage");

if(home) home.style.display = "none";
if(aboutPhone) aboutPhone.style.display = "none";
if(aboutDev) aboutDev.style.display = "none";

}

function backToSettingsHome(){

hideAllSettingsPages();

const home =
document.getElementById("settingsHome");

if(home){
home.style.display = "block";

home.animate([
{
opacity:0,
transform:"translateX(-22px) scale(.98)",
filter:"blur(6px)"
},
{
opacity:1,
transform:"translateX(0) scale(1)",
filter:"blur(0)"
}
],{
duration:360,
easing:"cubic-bezier(.16,1,.3,1)"
});
}

}

function openAboutPhone(){

const home =
document.getElementById("settingsHome");

if(home){
home.classList.add("settings-leave");
}

setTimeout(()=>{

hideAllSettingsPages();

const page =
document.getElementById("aboutPhonePage");

if(page){
page.style.display = "block";
}

loadAboutPhoneInputs();
renderAboutPhone();

if(home){
home.classList.remove("settings-leave");
}

},180);

}
function openAboutDev(){

const home =
document.getElementById("settingsHome");

if(home){
home.classList.add("settings-leave");
}

setTimeout(()=>{

hideAllSettingsPages();

const page =
document.getElementById("aboutDevPage");

if(page){
page.style.display = "block";
}

if(home){
home.classList.remove("settings-leave");
}

},180);

}

function getAboutPhoneData(){

return JSON.parse(
localStorage.getItem("wannuiAboutPhone") || "{}"
);

}

function saveAboutPhone(){

const data = {
brand: document.getElementById("phoneBrand")?.value.trim() || "",
chipset: document.getElementById("phoneChipset")?.value.trim() || "",
ram: document.getElementById("phoneRam")?.value.trim() || "",
battery: document.getElementById("phoneBattery")?.value.trim() || "",
storage: document.getElementById("phoneStorage")?.value.trim() || ""
};

localStorage.setItem(
"wannuiAboutPhone",
JSON.stringify(data)
);

renderAboutPhone();

showLiveNotif?.("About Phone Saved");

}

function loadAboutPhoneInputs(){

const data =
getAboutPhoneData();

const brand =
document.getElementById("phoneBrand");

const chipset =
document.getElementById("phoneChipset");

const ram =
document.getElementById("phoneRam");

const battery =
document.getElementById("phoneBattery");

const storage =
document.getElementById("phoneStorage");

if(brand) brand.value = data.brand || "";
if(chipset) chipset.value = data.chipset || "";
if(ram) ram.value = data.ram || "";
if(battery) battery.value = data.battery || "";
if(storage) storage.value = data.storage || "";

}

function renderAboutPhone(){

const data =
getAboutPhoneData();

const title =
document.getElementById("aboutPhoneTitle");

const display =
document.getElementById("aboutPhoneDisplay");

if(title){
title.innerText = data.brand || "WannUI Phone";
}

if(!display) return;

const rows = [
["Brand", data.brand || "Not set"],
["Chipset", data.chipset || "Not set"],
["RAM", data.ram || "Not set"],
["Battery", data.battery || "Not set"],
["Storage", data.storage || "Not set"],
["System", "WannUI 1.4"],
["Browser", navigator.userAgentData?.platform || navigator.platform || "Unknown"]
];

display.innerHTML =
rows.map(row=>`
<div class="about-row">
<span>${row[0]}</span>
<b>${row[1]}</b>
</div>
`).join("");

}