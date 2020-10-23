import { createRect } from "./utils/DomUtil.js";

const CHAR_W = 60;
const CHARA_H = 120;
const baseSpeedMs = 1000;

export class Charactor {
  /**
   * @param {HTMLElement} parent 
   */
  constructor (parent) {
    const stageW = parent.offsetWidth;
    const stageH = parent.offsetHeight;
    this._x = stageW / 2;
    this._y = stageH - CHARA_H / 2;
    this._latestAction = null; // 実行中または最後に予約された動作のPromise
    this.charaElem = createRect(this._x, this._y, CHAR_W, CHARA_H);
    this.charaElem.style.backgroundImage = "url(src/assets/tama.svg)";
    this.charaElem.style.transformOrigin = "center bottom";
    parent.appendChild(this.charaElem);
  }

  /**
   * 複数の動作が重ならないように順番に実行するための処理です。
   * このメソッド呼び出し時に既にアニメーションが実行中または予約済みの場合、それら全てが完了した後で呼び出し元に制御を戻します。
   * @returns {Function} ロック解除関数。呼び出し元で動作が完了したら、必ずこの関数をコールします。
   *  コール時点で後続の動作が実行されます
   */
  async _waitAndLock () {
    const latestAction = this._latestAction; // 一番最後に予約された処理のPromise
    let unlockFunc;
    // 新しいPromiseを作成し、「一番最後に予約された処理」にセット
    this._latestAction = new Promise((resolve, reject) => {
      unlockFunc = resolve;
    });
    await latestAction; // 最初に取得したPromiseのresolveを待つ
    return unlockFunc; // 新しく作ったPromiseのresolve関数を返す
  }

  /**
   * キャラクターを指定の座標までアニメーションを伴って動かします。
   * アニメーション完了前にこのメソッドを複数回呼び出した場合、呼び出した順番でひとつずつアニメーションを実行します。
   * @param {Number} x X座標
   */
  async moveTo (x) {
    // アニメーションが重ならないように、前の動作が終わるのを待ってロックを取得
    const unlock = await this._waitAndLock();

    const chara = this.charaElem;
    const stageW = chara.parentNode.offsetWidth;
    const dX = x - this._x;

    const moveAmount = Math.abs(dX / stageW);
    const reqMs = baseSpeedMs * moveAmount;
    const subMoveX = dX * moveAmount * 0.2;
    const subRotate = subMoveX > 0 ? 15 : -15;

    const key1 = { transform: `translate(${this._x}px, ${this._y}px)` };
    const key2 = { transform: `translate(${this._x - subMoveX}px, ${this._y}px) rotate(${-subRotate}deg)` };
    const key3 = { transform: `translate(${x + subMoveX}px, ${this._y}px) rotate(${subRotate}deg)` };
    const key4 = { transform: `translate(${x}px, ${this._y}px)` };

    this._x = x;

    await chara.animate([key1, key2], {
      duration: 100,
      easing: "ease-out"
    }).finished;
    await chara.animate([key2, key3], {
      duration: reqMs,
      easing: "ease-out"
    }).finished;
    await chara.animate([key3, key4], {
      duration: 100,
      easing: "ease-out",
    }).finished;
    chara.style.transform = key4.transform;

    unlock(); // ロックを解放
  }
}
