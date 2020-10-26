import { ParticleNode } from "./ParticleNode.js";
import { Point } from "./utils/Point.js";

const nodePool = [];

export class ParticleEmitter {
  constructor (parent, nodePerSec) {
    this._timer = null;
    this._lastTime = 0;
    this.parent = parent;
    this.pos = new Point(),
    this.vec = new Point(100, 100),
    this.duration = 3000;
    this.setAmount(nodePerSec)
  }

  get isRunning () {
    return !!this._timer;
  }

  setAmount (nodePerSec) {
    if (!nodePerSec || nodePerSec <= 0) {
      this.stop();
      return;
    }
    clearInterval(this._timer); // 既に動いているものがあれば止める
    const interval = 1000 / nodePerSec;
    this._timer = setInterval(async () => {
      const node = nodePool.pop() || new ParticleNode(this.parent);
      await node.emit(this.pos);
      // node.dispose();
      nodePool.push(node);
      }, interval);
  }

  stop () {
    clearTimeout(this._timer);
    this._timer = null;
  }
}
