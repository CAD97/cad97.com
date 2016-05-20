
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
    `   <a class="mdl-navigation__link" href="#">Anden's Mountain</a>
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
                <li><a href="#">Social Medias</a></li>
            </ul>
        </div>
        <div class="mdl-mini-footer__right-section">
            <ul class="mdl-mini-footer__link-list">
            <li><button class="mdl-mini-footer__social-btn">GitHub</button></li>
            <li><button class="mdl-mini-footer__social-btn">YouTube</button></li>
            <li><button class="mdl-mini-footer__social-btn">Twitter</button></li>
            <li><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
            </a></li>
            </ul>
        </div>
    `;
}

makeHeader(document.getElementById("header"));
makeDrawer(document.getElementById("drawer"));
makeFooter(document.getElementById("footer"));
