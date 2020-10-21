import { ElemSettings } from "./ElemSettings.js";
import { ImgElement } from "./ImgElement.js";
import { Point } from "./Point.js";
import { randomFrom, randomWithin } from "./Random.js";

const ASSET_COUNT = 18;
const ASSETS = new Array(ASSET_COUNT)
  .fill(0)
  .map((_, index) => "src/assets/particles/star" + (index + 1).toString().padStart(2, "0") + ".svg");

export class ParticleNode {
  constructor (parent, pos) {
    const img = randomFrom(ASSETS);
    const nodeWrapper = document.createElement("div");
    const style = nodeWrapper.style;
    style.position = "absolute";
    parent.appendChild(nodeWrapper);
    const nodeInner = new ImgElement(
      nodeWrapper,
      new ElemSettings(img, pos, 20, 20, 0, 0)
    );
    
    this._inner = nodeInner;
    this._wrapper = nodeWrapper;
  }

  async emit () {
    const nodeInner = this._inner;
    const nodeWrapper = this._wrapper;
    const moveX = randomWithin(-50, 50);
    const moveY = -800;

    nodeWrapper.animate([
      { transform: "translateY(0)" },
      { transform: "translateY(1000px)" }
    ], {
      duration: 2000,
      easing: "cubic-bezier(.37,.01,.96,.58)"
    });
    
    nodeInner.settings.scale = 1;
    await nodeInner.anim(200, "linear");

    nodeInner.settings.pos = new Point(
      nodeInner.settings.pos.x + moveX,
      nodeInner.settings.pos.y + moveY,
    );
    nodeInner.settings.scale = 0;
    nodeInner.settings.angle = randomWithin(-720, 720);
    await nodeInner.anim(2000, "linear");

  }

  dispose () {
    this._inner.dispose();
    this._wrapper.parentNode.removeChild(this._wrapper);
  }
}