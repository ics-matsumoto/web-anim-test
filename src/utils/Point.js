const a2r = (a) => (a / 180) * Math.PI;
const r2a = (r) => (r / Math.PI) * 180;

/**
 * 点の座標(x, y)を保持するスラスです。
 */
export class Point {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  get angle() {
    const rad = Math.atan2(this.x, this.y);
    return r2a(rad);
  }

  add (p) {
    return new Point(this.x + p.x, this.y + p.y);
  }

  sub (p) {
    return new Point(this.x - p.x, this.y - p.y);
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

/**
 * 極座標形式で点を作成します。座標は直交座標(x,y)に変換されます。
 * @param {Number} l 原点からの距離
 * @param {Number} a 角度
 */
export const pointByPolar = (l, a) => {
  const rad = a2r(a);
  const x = Math.cos(rad) * l;
  const y = Math.sin(rad) * l;
  return new Point(x, y);
};
