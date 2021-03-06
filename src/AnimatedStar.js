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
    transform: `rotate(${90}deg) translateX(0px)`,
    width: "8px"
  };
  const key2 = {
    transform: `rotate(${angle}deg) translateX(150px)`,
    width: "8px"
  };
  const key3 = {
    transform: `rotate(${angle + 360}deg) translateX(0)`,
    width: "8px"
  };
  const key4 = {
    transform: `rotate(${angle + 360}deg) translateX(${destOffset}px)`,
    width: `${destLength}px`
  };
  const key5 = {
    transform: `rotate(${angle + 360}deg) translateX(${destLength + destOffset + randomWithin(50, 100)}px)`,
    width: "0"
  };

  await line.animate([key1, key2], {
    duration: 300,
    easing: "ease-out",
    fill: "forwards"
  }).finished;
  await line.animate([key2, key3], {
    duration: 500,
    easing: "ease-in",
    fill: "forwards"
  }).finished;  await line.animate([key3, key4], {
    duration: 400,
    easing: "ease-out",
    delay: randomWithin(100, 400),
    fill: "forwards"
  }).finished;
  await line.animate([key4, key5], {
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
    this.rootElem = createRect(this.center.x + 5, this.center.y, 0, 0);
    this.starElem = createRect(0, 0, 50, 50, 0, 0);
    this.linesElem = createRect();
    this.starElem.style.backgroundImage = "url(src/assets/star.svg)";
 
    this.rootElem.appendChild(this.linesElem);
    this.rootElem.appendChild(this.starElem);
    parent.appendChild(this.rootElem);
  }

  /**
   * アニメーションとともに星を表示します
   */
  async show () {
    const root = this.rootElem;
    if (!root) { return; }


    // ラインを放射するアニメーション（非同期=awaitしない）
    const LINE_COUNT = 7;
    for (let index = 0; index < LINE_COUNT; index++) {
      animateLine(this.linesElem, (360 / LINE_COUNT) * index);
    }

    // 星とライン全体を画面下から打ち上げるアニメーション
    const height = window.innerHeight;
    await root.animate([
      { transform: `translate(${this.center.x}px, ${height - 80}px)` },
      { transform: `translate(${this.center.x}px, ${this.center.y}px)` },
    ], {
      duration: 600,
      easing: "ease-out",
      fill: "forwards"
    }).finished;

    // 星が現れるアニメーション
    const starAngle = randomWithin(-30, 30);
    const star = this.starElem;

    const starAnim = star.animate([
      { transform: star.style.transform, easing: "ease-out" },
      { transform: `scale(${1.5}) rotate(${starAngle}deg)`, offset: 0.6, easing: "ease-out" },
      { transform: `scale(${0.8}) rotate(${starAngle}deg)`, offset: 0.9, easing: "ease-out" },
      { transform: `scale(${randomWithin(0.85, 1.25)}) rotate(${starAngle}deg)` }
    ], {
      duration: 700,
      fill: "forwards"
    })
    await starAnim.finished;
    starAnim.commitStyles();
    starAnim.cancel();
    this.startSwing();
  }

  startSwing () {
    const root = this.rootElem;
    if (!root) { return; }

    root.animate([
      { transform: `translate(${this.center.x - 5}px, ${this.center.y}px) rotate(-15deg)` },
      { transform: `translate(${this.center.x + 5}px, ${this.center.y}px) rotate(15deg)` }
    ], {
      duration: 3000,
      easing: "ease-in-out",
      iterations: Infinity, // ループ再生
      direction: "alternate", // 最後まで再生したら巻き戻す
      iterationStart: 0.5 // 中間点（回転角=0）から始める
    });
  }

  /**
   * アニメーションとともに星を隠します
   */
  async hide () {
    const star = this.starElem;
    if (!star) { return; }

    // 星が消えるアニメーション
    await star.animate([
      { transform: star.style.transform },
      { transform: `scale(${1.4})`, offset: 0.4, easeing: "ease" },
      { transform: `scale(${0})`, easeing: "ease-out" }
    ], {
      duration: 700,
      fill: "forwards"
    }).finished;
  }

  /**
   * 要素を破棄します。以後要素は表示・操作できません
   */
  dispose () {
    if (!this.rootElem) { return; }
    this.rootElem.parentNode.removeChild(this.rootElem);
    this.rootElem = null;
    this.starElem = null;
    this.linesElem = null;
  }
}
