import { Point } from "./Point.js";

/**
 * 画像要素の設定を保持するクラスです
 */
export class RectSettings {
  constructor(
    src = null,
    color = "transparent",
    pos = null,
    width = 100,
    height = 100,
    angle = 0,
    scale = 1
  ) {
    this.src = src;
    this.color = color;
    this.pos = pos ? pos.clone() : new Point(0, 0);
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.scale = scale;
  }

  clone() {
    return new RectSettings(
      this.src,
      this.color,
      this.pos,
      this.width,
      this.height,
      this.angle,
      this.scale
    );
  }
}
