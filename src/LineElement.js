import { LineSettings } from "./LineSettings.js";

export class LineElement {
  /**
   * @param {HTMLElement} parent
   * @param {LineSettings} settings 
   */
  constructor (parent, settings) {
    this._elLine = document.createElement("div");
    this.settings = settings;
    this._lastSettings = settings.clone();
    const styleLine = this._elLine.style;
    styleLine.position = "absolute";
    styleLine.backgroundColor = settings.color;
    styleLine.width = `${settings.length}px`;
    styleLine.height = `${settings.thickness}px`;
    styleLine.borderRadius = `${settings.thickness}px`;
    styleLine.transformOrigin = "left center";
    styleLine.transform = `
      translate(${settings.pos.x}px, ${settings.pos.y}px)
      rotate(${settings.angle}deg)
      translateX(${settings.offset}px)
    `;
    parent.appendChild(this._elLine);
  }

  async anim (duration = 1000, easing = "linear") {
    if (!this._elLine) { return; }

    const fromSettings = this._lastSettings;
    const toSettings = this.settings;
    const fromFrame = {
      width: `${fromSettings.length}px`,
      height: `${fromSettings.thickness}px`,
      borderRadius: `${fromSettings.thickness}px`,
      backgroundColor: fromSettings.color,
      transform: `
        translate(${fromSettings.pos.x}px, ${fromSettings.pos.y}px)
        rotate(${fromSettings.angle}deg)
        translateX(${fromSettings.offset}px)
      `
    };
    const toFrame = {
      width: `${toSettings.length}px`,
      height: `${toSettings.thickness}px`,
      borderRadius: `${toSettings.thickness}px`,
      backgroundColor: toSettings.color,
      transform: `
        translate(${toSettings.pos.x}px, ${toSettings.pos.y}px)
        rotate(${toSettings.angle}deg)
        translateX(${toSettings.offset}px)
      `
    };
    console.log([fromFrame, toFrame]);
    const anim = this._elLine.animate([fromFrame, toFrame], {
      duration: duration,
      fill: "forwards",
      iterations: 1,
      easing: easing
    });

    this._lastSettings = toSettings.clone();
    await anim.finished;

  }

  dispose () {
    if (!this._elLine) { return; }
    this._elLine.parentNode.removeChild(this._elLine);
    this._elLine = null;
  }

}
