
import { Point } from "./utils/Point.js";
import { AnimatedStar } from "./AnimatedStar.js";
import { StartButton } from "./StartButton.js";
import { createLines } from "./LineBg.js";
import { Charactor } from "./Caharactor.js";
import { ParticleEmitter } from "./ParticleEmitter.js";

const stage = document.getElementById("MainStage");

// 開始画面を表示する
const showStartScreen = () => {
  const pos = new Point(window.innerWidth / 2, 500);
  // Startボタンを表示し、クリックでメイン画面に遷移する
  const btn = new StartButton(document.getElementById("Overlay"), pos, () => {
    document.getElementById("Top").style.visibility = "hidden";
    drawBg();
    initStage();
  });
}

// 背景にランダムなラインを引く
const drawBg = (count = 20) => {
  createLines(document.getElementById("Background"), [
    "#131c38",
    "#201a33",
    "#23285e",
    "#1d1c47",
    "#2e1657"
  ], count);
}

// メイン画面（キャラクターやパーティクルを表示する）の初期化
const initStage = () => {
  const chara = new Charactor(stage);
  const emitter = new ParticleEmitter(stage, 24);
  let emitterStopTimer = null;

  stage.addEventListener("click", async (ev) => {
    const pos = new Point(ev.clientX, ev.clientY);
    await chara.moveTo(pos.x);
    const star = new AnimatedStar(stage, pos);
    await star.show();
  });

  // カーソル移動時にパーティクルの発生源を移動
  stage.addEventListener("pointermove", (ev) => {
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
