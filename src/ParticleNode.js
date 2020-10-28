import { randomFrom, randomWithin } from "./utils/Random.js";
import { createRect } from "./utils/DomUtil.js";

const ASSET_COUNT = 18;
const ASSETS = new Array(ASSET_COUNT)
  .fill(0)
  .map((_, index) => "src/assets/particles/star" + (index + 1).toString().padStart(2, "0") + ".svg");

export class ParticleNode {
  constructor (parent, scale = 1) {
    const nodeWrapper = createRect();
    const nodeInner = createRect(0, 0, 20, 20);
    nodeWrapper.style.visibility = "hidden";
    nodeWrapper.style.willChange = "transform";
    nodeInner.style.backgroundImage = `url(${randomFrom(ASSETS)})`;
    nodeInner.style.willChange = "transform";
    parent.appendChild(nodeWrapper);
    nodeWrapper.appendChild(nodeInner);
    this._inner = nodeInner;
    this._wrapper = nodeWrapper;
    this.scale = scale;
  }

  async emit (pos) {
    if (!this._wrapper) { return; }

    const nodeInner = this._inner;
    const nodeWrapper = this._wrapper;
    const moveX = randomWithin(-80, 80);
    const moveY = -600;
    const rotate = randomWithin(-720, 720);
    const scale = this.scale * Math.pow(randomWithin(1, 1.4), 2);
    const gravity = 1000;

    nodeWrapper.style.visibility = "visible";
    nodeWrapper.animate([
      { transform: `translate(${pos.x}px, ${pos.y}px)` },
      { transform: `translate(${pos.x}px, ${pos.y + gravity}px)` }
    ], {
      duration: 2000,
      easing: "cubic-bezier(.37,.01,.96,.58)"
    });

    await nodeInner.animate([
      {
        transform: `translate(0, 0) scale(${scale})`
      },
      {
        transform: `translate(${moveX}px, ${moveY}px) scale(0) rotate(${rotate}deg)`
      }
    ], {
      duration: 2000
    }).finished;

    nodeWrapper.style.visibility = "hidden";

  }

  dispose () {
    if (!this._wrapper) { return; }
    this._wrapper.parentNode.removeChild(this._wrapper);
    this._wrapper = null;
    this._inner = null;
  }
}
