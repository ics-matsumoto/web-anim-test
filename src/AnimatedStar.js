import { Point } from "./utils/Point.js";
import { randomWithin } from "./utils/Random.js";
import { createRect } from "./utils/DomUtil.js";

/**
 * ラインを放射するアニメーションを生成・表示します
 * @param {HTMLElement} parent ライン要素を挿入する親要素
 * @param {Number} angle ラインの角度
 */
const animateLine = async (parent, angle) => {
  const line = createRect(0, 0, 8, 8);
  parent.appendChild(line);
  line.style.backgroundColor = `hsl(${randomWithin(40, 50)}, 100%, ${randomWithin(50, 80)}%)`;
  line.style.transformOrigin = "left center";
  line.style.borderRadius = "4px";
  
  const destLength = randomWithin(50, 80);
  const destOffset = randomWithin(40, 60);
  const key1 = {
    transform: `rotate(${angle}deg) translateX(50px)`,
    width: "8px"
  };
  const key2 = {
    transform: `rotate(${angle + 120}deg) translateX(0)`,
    width: "8px"
  };
  const key3 = {
    transform: `rotate(${angle + 120}deg) translateX(${destOffset}px)`,
    width: `${destLength}px`
  };
  const key4 = {
    transform: `rotate(${angle + 120}deg) translateX(${destLength + destOffset + randomWithin(50, 100)}px)`,
    width: "0"
  };

  await line.animate([key1, key2], {
    duration: 300,
    easing: "ease",
    fill: "forwards"
  }).finished;
  await line.animate([key2, key3], {
    duration: 200,
    easing: "ease-out",
    fill: "forwards"
  }).finished;
  await line.animate([key3, key4], {
    duration: 150,
    easing: "cubic-bezier(0,.67,.39,1)",
    fill: "forwards"
  }).finished;

  line.parentNode.removeChild(line);
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
    this.linesElem = createRect(this.center.x + 5, this.center.y, 0, 0);
    this.parent.appendChild(this.linesElem);
    this.starElem = createRect(center.x, center.y, 50, 50, randomWithin(-30, 30), 0);
    this.starElem.style.backgroundImage = "url(src/assets/star.svg)";
    parent.appendChild(this.starElem);
  }

  /**
   * アニメーションとともに星を表示します
   */
  async show () {
    // ラインを放射するアニメーション

    const LINE_COUNT = 7;
    for (let index = 0; index < LINE_COUNT; index++) {
      animateLine(this.linesElem, (360 / LINE_COUNT) * index);
    }

    // 星が現れるアニメーション
    const star = this.starElem;
    const key1 = {
      transform: star.style.transform
    };
    const key2 = {
      transform: `translate(${this.center.x}px, ${this.center.y}px) scale(${1.5})`
    };
    const key3 = {
      transform: `translate(${this.center.x}px, ${this.center.y}px) scale(${0.8})`
    };
    const key4 = {
      transform: `translate(${this.center.x}px, ${this.center.y}px) scale(${randomWithin(0.85, 1.25)})`
    };

    await star.animate([key1, key2], {
      duration: 400,
      easing: "ease-out",
      fill: "forwards"
    }).finished;
    await star.animate([key2, key3], {
      duration: 200,
      easing: "ease-out",
      fill: "forwards"
    }).finished;
    await star.animate([key3, key4], {
      duration: 100,
      easing: "ease-out",
      fill: "forwards"
    }).finished;
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
