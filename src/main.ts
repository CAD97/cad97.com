
/// <reference path="../typings/index.d.ts" />

function makeHeader(el: HTMLElement) {
    el.className = "mdl-layout__header mdl-shadow--8dp";
    el.innerHTML =
    `   <div class="mdl-layout-icon"></div>
        <div class="mdl-layout__header-row">
            <span class="mdl-layout__title">CAD97</span>
            <div class="mdl-layout-spacer"></div>
            <nav></nav>
        </div>
    `;
    makeNavigation((el.children[1] as HTMLElement).children[2] as HTMLElement);
    componentHandler.upgradeElement(el);
}

function makeDrawer(el: HTMLElement) {
    el.className = "mdl-layout__drawer";
    el.innerHTML =
    `   <span class="mdl-layout__title">CAD97</span>
        <nav></nav>
    `;
    makeNavigation(el.children[1] as HTMLElement);
    componentHandler.upgradeElement(el);
}

function makeNavigation(el: HTMLElement) {
    el.className = "mdl-navigation";
    el.innerHTML = 
    `   <a class="mdl-navigation__link" href="#">Nav link 1</a>
        <a class="mdl-navigation__link" href="#">Nav link 2</a>
        <a class="mdl-navigation__link" href="#">Nav link 3</a>
    `;
    componentHandler.upgradeElement(el);
}

function makeFooter(el: HTMLElement) {
    el.className = "mdl-mini-footer";
    el.innerHTML =
    `
        <div class="mdl-mini-footer__left-section">
            <div class="mdl-logo">
                Mini-footer Heading
            </div>
            <ul class="mdl-mini-footer__link-list">
                <li><a href="">Link 1</a></li>
                <li><a href="">Link 2</a></li>
                <li><a href="">Link 3</a></li>
            </ul>
        </div>
        <div class="mdl-mini-footer__right-section">
            <button class="mdl-mini-footer__social-btn"></button>
            <button class="mdl-mini-footer__social-btn"></button>
            <button class="mdl-mini-footer__social-btn"></button>
        </div>
    `;
}

makeHeader(document.getElementById("header"));
makeDrawer(document.getElementById("drawer"));
makeFooter(document.getElementById("footer"));
