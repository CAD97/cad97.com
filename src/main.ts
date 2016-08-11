/// <reference path="../typings/globals/material-design-lite/index.d.ts" />

function makeCellCard(el: HTMLElement, width: number, shadow?: number) {
    el.classList.remove(`cell-${width}`);
    el.classList.add("mdl-cell", "mdl-card", `mdl-cell--${width}-col`, "mdl-cell--8-col-tablet");
    if (shadow) el.classList.add(`mdl-shadow--${shadow}dp`);

    const title = el.children[0] as HTMLElement;
    const body = el.children[1] as HTMLElement;

    title.classList.add("mdl-card__title");
    title.children[0].classList.add("mdl-card__title-text");
    if (title.childElementCount > 1) title.children[1].classList.add("mdl-layout-spacer");
    body.classList.add("mdl-card__supporting-text");

    componentHandler.upgradeElement(el);
}

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(i => {
    const list = document.getElementsByClassName(`cell-${i}`);
    while (list.length) makeCellCard(list[0] as HTMLElement, i, 4);
});
