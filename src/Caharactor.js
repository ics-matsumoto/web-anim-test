import { createRect } from "./utils/DomUtil.js";
import { wait } from "./utils/wait.js";

const CHAR_W = 120;
const CHARA_H = 180;
const baseSpeedMs = 2200;

const DIRECTION = {
  RIGHT: "right",
  LEFT: "left"
};
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
    this.charaElem.style.backgroundImage = "url(src/assets/chara-opt.svg)";
    this.charaElem.style.transformOrigin = "center bottom";
    this.charaElem.style.backgroundSize = "contain";
    this.charaElem.style.willChange = "transform";
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

    // 現在の位置と移動先の位置から距離と向きを求める
    const dX = x - this._x;
    const direction = dX > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
    // スーテジの横幅を1とした時の移動量
    const moveAmount = Math.abs(dX / stageW);
    // 移動アニメーションの長さ（距離に応じてアニメーションも長くする）
    const duration = baseSpeedMs * moveAmount;
    // 予備動作（溜め）の距離と角度（移動量に応じて溜めの大きさも変える）
    const prepMoveX = dX * moveAmount * 0.1;
    const prepRotate = dX > 0 ? 15 : -15;
    // 開始時・終了時の向きからscaleXの値を求める
    // 右向き=1, 左向き=-1（左右反転）
    const startScaleX = this._faceDirection === DIRECTION.RIGHT ? 1 : -1;
    const endScaleX = direction === DIRECTION.RIGHT ? 1 : -1;

    // キーフレームを作成
    const keyFrames = [
      { 
        transform: `translate(${this._x}px, ${this._y}px) scaleX(${startScaleX})`, 
        offset: 0,
        easing: "ease-out"
      },
      {
        transform: `translate(${this._x - prepMoveX}px, ${this._y}px) rotate(${-prepRotate}deg) scaleX(${endScaleX})`,
        offset: 0.2,
        easing: "cubic-bezier(.23,.01,.31,1)"
      },
      { 
        transform: `translate(${x + prepMoveX}px, ${this._y}px) rotate(${prepRotate}deg) scaleX(${endScaleX})`,
        offset: 0.9,
        easing: "ease-out"
      },
      {
        transform: `translate(${x}px, ${this._y}px) scaleX(${endScaleX})`,
        offset: 1
      }
    ];

    // アニメーション開始前に移動先の位置と向きを記録
    this._x = x;
    this._faceDirection = direction;

    // 作成したキーフレームとアニメーション時間でアニメーションを実行
    await chara.animate(keyFrames, {
      duration,
      fill: "forwards"
    }).finished;

    unlock(); // ロックを解放
  }
}
