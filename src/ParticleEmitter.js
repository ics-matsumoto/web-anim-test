import { ParticleNode } from "./ParticleNode.js";
import { Point } from "./utils/Point.js";

// 生成したインスタンスを再利用するための保管プール
const nodePool = [];

// パーティクルを射出するためのクラス
export class ParticleEmitter {
  constructor (parent, nodePerSec) {
    this._timer = null;
    this.parent = parent;
    this.pos = new Point(),
    this.vec = new Point(100, 100),
    this.duration = 3000;
    this.nodePerSec = nodePerSec;
  }

  get isRunning () {
    return !!this._timer;
  }

  start () {
    if (this.isRunning) { return; }
    const emmit = async () => {
      // プールからインスタンスを取得。なければ新規に生成
      const node = nodePool.pop() || new ParticleNode(this.parent);
      await node.emit(this.pos);
      // アニメーション完了後は再利用するためプールに戻す
      nodePool.push(node);
    }

    const onTick = () => {
      if (this.nodePerSec <= 0) {
        this.stop();
        return;
      }
      emmit()
      this._timer = setTimeout(onTick, 1000 / this.nodePerSec);
    }
    
    onTick();
  }

  stop () {
    clearTimeout(this._timer);
    this._timer = null;
  }
}
