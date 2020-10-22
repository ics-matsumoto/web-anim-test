import { createRect } from "./utils/DomUtil.js";

const CHAR_W = 60;
const CHARA_H = 120;
const baseSpeedMs = 1000;

export class Charactor {
  /**
   * @param {HTMLElement} parent 
   */
  constructor (parent) {
    const stageW = parent.offsetWidth;
    const stageH = parent.offsetHeight;
    this._x = stageW / 2;
    this._y = stageH - CHARA_H / 2
    this.charaElem = createRect(this._x, this._y, CHAR_W, CHARA_H);
    this.charaElem.style.backgroundImage = "url(src/assets/tama.svg)";
    this.charaElem.style.transformOrigin = "center bottom";
    parent.appendChild(this.charaElem);
  }

  async moveTo (x) {
    const chara = this.charaElem;
    const stageW = chara.parentNode.offsetWidth;
    const dX = x - this._x;

    const moveAmount = Math.abs(dX / stageW);
    const reqMs = baseSpeedMs * moveAmount;
    const subMoveX = dX * moveAmount * 0.2;
    const subRotate = subMoveX > 0 ? 15 : -15;

    const key1 = { transform: `translate(${this._x}px, ${this._y}px)` };
    const key2 = { transform: `translate(${this._x - subMoveX}px, ${this._y}px) rotate(${-subRotate}deg)` };
    const key3 = { transform: `translate(${x + subMoveX}px, ${this._y}px) rotate(${subRotate}deg)` };
    const key4 = { transform: `translate(${x}px, ${this._y}px)` };

    this._x = x;

    await chara.animate([key1, key2], {
      duration: 100,
      easing: "ease-out"
    }).finished;
    await chara.animate([key2, key3], {
      duration: reqMs,
      easing: "ease-out"
    }).finished;
    await chara.animate([key3, key4], {
      duration: 100,
      easing: "ease-out",
    }).finished;
    chara.style.transform = key4.transform;
  }
}
