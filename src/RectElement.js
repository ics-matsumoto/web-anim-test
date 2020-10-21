import { RectSettings } from "./RectSettings.js";

export class RectElement {
  /**
   * @param {HTMLElement} parent
   * @param {RectSettings} settings
   */
  constructor(parent, settings) {
    this._el = document.createElement("div");
    this.settings = settings;
    this._lastSettings = settings.clone();
    const style = this._el.style;
    style.position = "absolute";
    style.backgroundColor = settings.color;
    style.backgroundImage = `url(${settings.src})`;
    style.backgroundRepeat = "no-repeat";
    style.width = `${settings.width}px`;
    style.height = `${settings.height}px`;
    style.marginLeft = `${-settings.width / 2}px`;
    style.marginTop = `${-settings.height / 2}px`;
    style.transform = `
      translate(${settings.pos.x}px, ${settings.pos.y}px)
      scale(${settings.scale})
      rotate(${settings.angle}deg)
    `;
    parent.appendChild(this._el);
  }

  async anim(duration = 1000, easing = "linear") {
    if (!this._el) {
      return;
    }

    const fromSettings = this._lastSettings;
    const toSettings = this.settings;
    const fromFrame = {
      transform: `
        translate(${fromSettings.pos.x}px, ${fromSettings.pos.y}px)
        scale(${fromSettings.scale})
        rotate(${fromSettings.angle}deg)
      `,
    };
    const toFrame = {
      transform: `
        translate(${toSettings.pos.x}px, ${toSettings.pos.y}px)
        scale(${toSettings.scale})
        rotate(${toSettings.angle}deg)
      `,
    };
    const anim = this._el.animate([fromFrame, toFrame], {
      duration: duration,
      fill: "forwards",
      iterations: 1,
      easing: easing,
    });

    this._lastSettings = toSettings.clone();
    await anim.finished;
  }

  dispose() {
    if (!this._el) {
      return;
    }
    this._el.parentNode.removeChild(this._el);
    this._el = null;
  }
}
