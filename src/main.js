
import { Point } from "./utils/Point.js";
import { AnimatedStar } from "./AnimatedStar.js";
import { StartButton } from "./StartButton.js";
import { createLines } from "./LineBg.js";
import { Charactor } from "./Caharactor.js";
import { ParticleEmitter } from "./ParticleEmitter.js";

const stageLayer = document.getElementById("MainStage");
const overlayLayer = document.getElementById("Overlay");
const toppageLayer = document.getElementById("Toppage");
const backgroundLayer = document.getElementById("Background");
const ParticleLayer = document.getElementById("Particles");

// 開始画面を表示する
const showStartScreen = () => {
  const pos = new Point(window.innerWidth / 2, 500);
  // Startボタンを表示し、クリックでメイン画面に遷移する
  const btn = new StartButton(overlayLayer, pos, () => {
    toppageLayer.style.visibility = "hidden";
    drawBg();
    initStage();
  });
}

// 背景にランダムなラインを引く
const drawBg = (count = 20) => {
  createLines(backgroundLayer, [
    "#131c38",
    "#201a33",
    "#23285e",
    "#1d1c47",
    "#2e1657"
  ], count);
}

// メイン画面（キャラクターやパーティクルを表示する）の初期化
const initStage = () => {
  const chara = new Charactor(stageLayer);
  const emitter = new ParticleEmitter(ParticleLayer, 20);
  let emitterStopTimer = null;

  stageLayer.addEventListener("click", async (ev) => {
    const pos = new Point(ev.clientX, ev.clientY);
    await chara.moveTo(pos.x);
    const star = new AnimatedStar(stageLayer, pos);
    await star.show();
    // しばらくしたら消えるアニメーションを表示してから要素を削除する
    setTimeout(async () => {
      await star.hide();
      star.dispose();
    }, 10 * 1000);
  });

  // カーソル移動時にパーティクルの発生源を移動
  stageLayer.addEventListener("pointermove", (ev) => {
    const pos = new Point(ev.clientX, ev.clientY);
    // 移動量が小さすぎる場合は無視
    if (emitter.pos.sub(pos).length < 3) { return; }
    emitter.pos = pos;
    if (!emitter.isRunning) {
      emitter.start();
    }
    // 一定時間カーソル移動がない場合は止める
    clearTimeout(emitterStopTimer);
    emitterStopTimer = setTimeout(() => {
      emitter.stop();
    }, 500);
  });
};

// アプリ起動時の初期化処理
const initApp = () => {
  drawBg(6);
  showStartScreen();
}

initApp();
