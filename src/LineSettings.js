import { Point } from "./Point.js";

/**
 * 直線の設定を保持するクラスです
 */
export class LineSettings {
  constructor (pos = null, thickness = 1, length = 10, angle = 0, color = "#000", offset = 0) {
    this.thickness = thickness;
    this.length = length;
    this.angle = angle;
    this.color = color;
    this.offset = offset;
    this.pos = pos ? pos.clone() : new Point(0, 0);
  };

  clone () {
    return new LineSettings(
      this.pos,
      this.thickness,
      this.length,
      this.angle,
      this.color,
      this.offset
    );
  }
}
