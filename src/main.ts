
/// <reference path="../typings/index.d.ts" />

function makeHeader(el: HTMLElement) {
    el.classList.add("mdl-layout__header", "mdl-shadow--8dp");
    el.innerHTML =
    `   <div class="mdl-layout-icon"></div>
        <div class="mdl-layout__header-row">
            <span class="mdl-layout__title">CAD97</span>
            <div class="mdl-layout-spacer"></div>
            <nav class="mdl-layout--large-screen-only"></nav>
        </div>
    `;
    makeNavigation((el.children[1] as HTMLElement).children[2] as HTMLElement);
    componentHandler.upgradeElement(el);
}

function makeDrawer(el: HTMLElement) {
    el.classList.add("mdl-layout__drawer");
    el.innerHTML =
    `   <span class="mdl-layout__title">CAD97</span>
        <nav></nav>
    `;
    makeNavigation(el.children[1] as HTMLElement);
    componentHandler.upgradeElement(el);
}

function makeNavigation(el: HTMLElement) {
    el.classList.add("mdl-navigation");
    el.innerHTML = 
    `   <a class="mdl-navigation__link" href="/">Home</a>
        <a class="mdl-navigation__link" href="#">Anden's Mountain</a>
        <a class="mdl-navigation__link" href="#">The Tower of Babble</a>
        <a class="mdl-navigation__link" href="#">Blog</a>
    `;
    componentHandler.upgradeElement(el);
}

function makeFooter(el: HTMLElement) {
    el.classList.add("mdl-mini-footer");
    el.innerHTML =
    `   <div class="mdl-mini-footer__left-section">
            <div class="mdl-logo">
                Copyright &copy; 2015-2016
            </div>
            <ul class="mdl-mini-footer__link-list">
                <li><a href="#">Technologies</a></li>
                <li><a href="#">Contact Me</a></li>
                <li><a href="#">Social Media</a></li>
            </ul>
        </div>
        <div class="mdl-mini-footer__right-section">
            <ul class="mdl-mini-footer__link-list">
                <li><a href="https://github.com/CAD97/">
                    <img alt="GitHub" style="border-width:0" height="32" src="/brands/github-32x32.png" />
                </a></li>
                <li><a href="https://www.youtube.com/c/cad97">
                    <img alt="YouTube" style="border-width:0" height="32" src="/brands/youtube-45x32.png" />
                </a></li>
                <li><a href="https://twitter.com/CDurham97">
                    <img alt="Twitter" style="border-width:0" height="32" src="/brands/twitter-39x32.png" />
                </a></li>
                <li><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                    <img alt="Creative Commons License" style="border-width:0" height="31" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
                </a></li>
            </ul>
        </div>
    `;
}

makeHeader(document.getElementById("header"));
makeDrawer(document.getElementById("drawer"));
makeFooter(document.getElementById("footer"));

function makeCellCard(el: HTMLElement, width: number, shadow?: number) {
    el.classList.remove(`cell-${width}`);
    el.classList.add("mdl-cell", `mdl-cell--${width}-col`);
    if (shadow) el.classList.add(`mdl-shadow--${shadow}dp`);
    
    var title = el.children[0] as HTMLElement;
    var body = el.children[1] as HTMLElement;
    
    title.classList.add("mdl-card__title");
    title.children[0].classList.add("mdl-card__title-text");
    if (title.childElementCount > 1) title.children[1].classList.add("mdl-layout-spacer")
    body.classList.add("mdl-card__supporting-text");
}

[1,2,3,4,5,6,7,8,9,10,11,12].forEach(i=>
    Array.prototype.forEach.call(document.getElementsByClassName(`cell-${i}`),
                                 (el:HTMLElement) => makeCellCard(el, i, 4))
);
