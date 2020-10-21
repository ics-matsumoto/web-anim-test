import { ParticleNode } from "./ParticleNode.js";
import { Point } from "./Point.js";


export class Emitter {
  constructor (parent) {
    this._timer = null;
    this._lastTime = 0;
    this.parent = parent;
    this.nps = 10;
    this.pos = new Point(),
    this.vec = new Point(100, 100),
    this.duration = 3000;
  }

  start () {
    if (this._timer) { return; }
    const interval = 1000 / this.nps;
    this._timer = setInterval(async () => {
      const node = new ParticleNode(this.parent, this.pos, this);
      await node.emit();
      node.dispose();
      }, interval);
  }

  stop () {
    clearTimeout(this._timer);
    this._timer = null;
  }
}