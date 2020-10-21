
import { RectElement } from "./RectElement.js";
import { RectSettings } from "./RectSettings.js";
import { LineElement } from "./LineElement.js";
import { LineSettings } from "./LineSettings.js";
import { Point } from "./Point.js";
import { randomWithin } from "./Random.js";

/**
 * ラインを放射するアニメーションを生成・表示します
 * @param {HTMLElement} parent ライン要素を挿入する親要素
 * @param {Point} center アニメーションの中心
 * @param {Number} angle ラインの角度
 */
const animateLine = async (parent, center, angle) => {
  const line = new LineElement(
    parent,
    new LineSettings(
      center,
      8,
      8,
      angle,
      `hsl(${randomWithin(40, 50)}, 100%, ${randomWithin(50, 80)}%)`,
      50
    )
  );

  line.settings.angle += 120;
  line.settings.offset = 0;
  await line.anim(300);

  line.settings.length = randomWithin(50, 60);
  line.settings.offset = randomWithin(40, 60);
  await line.anim(300, "cubic-bezier(0,.67,.39,1)");

  line.settings.length = 0;
  line.settings.offset += randomWithin(100, 140);
  await line.anim(150);

  line.dispose();
};

/**
 * アニメーションする星のクラスです
 */
export class AnimatedStar {
  /**
   * アニメーションする星を生成します。
   * @param {HTMLElement} parent ライン要素を挿入する親要素
   * @param {Point} center アニメーションの中心
   */
  constructor (parent, center) {
    this.parent = parent;
    this.center = center;
    this.star = new RectElement(
      parent,
      new RectSettings(
        "src/assets/star.svg",
        "transparent",
        new Point(center.x, center.y + 5),
        50,
        50,
        randomWithin(-30, 30),
        0
      )
    );
  }

  /**
   * アニメーションとともに星を表示します
   */
  async show () {
    // ラインを放射するアニメーション
    const LINE_COUNT = 7;
    for (let index = 0; index < LINE_COUNT; index++) {
      animateLine(this.parent, this.center, (360 / LINE_COUNT) * index);
    }

    // 星が現れるアニメーション
    const star = this.star;
    if (!star) { return; }
    await star.anim(400);
    star.settings.scale = 1.5;
    await star.anim(200, "ease-out");
    star.settings.scale = randomWithin(0.8, 1.1);
    await star.anim(100);
  }

  /**
   * アニメーションとともに星を隠します
   */
  async hide () {
    const star = this.star;
    if (!star) { return; }
    star.settings.scale = 1.3;
    await star.anim(300, "ease");
    star.settings.scale = 0;
    await star.anim(200, "cubic-bezier(0,.67,.39,1)");
  }

  /**
   * 要素を破棄します。以後要素は表示・操作できません
   */
  dispose () {
    if (!this.star) { return; }
    this.star.dispose();
    this.star = null;
  }
}
