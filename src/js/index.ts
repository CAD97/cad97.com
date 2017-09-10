(function themeControls() {

let isLightTheme = localStorage.getItem("isLightTheme") === "true";

function setTheme() {
    if (isLightTheme) {
        document.body.classList.add("light");
        document.getElementById("switch-theme")!.innerText = "Switch to dark theme";
    } else {
        document.body.classList.remove("light");
        document.getElementById("switch-theme")!.innerText = "Switch to light theme";
    }
}

setTheme();

document.getElementById("switch-theme")!.onclick = function switchTheme() {
    isLightTheme = !isLightTheme;
    localStorage.setItem("isLightTheme", isLightTheme.toString());
    setTheme();
};

})();


