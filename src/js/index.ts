function switchTheme() {
    const bodyClassList = document.getElementsByTagName('body')[0].classList;
    const next = document.getElementById("new-theme")!;
    
    if (bodyClassList.contains('light')) {
        bodyClassList.remove('light');
        next.innerText = "light";
    } else {
        bodyClassList.add('light');
        next.innerText = "dark";
    }
}

document.getElementById("switch-theme")!.onclick = switchTheme;
