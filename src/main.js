
import { Point } from "./utils/Point.js";
import { AnimatedStar } from "./AnimatedStar.js";
import { StartButton } from "./StartButton.js";
import { createLines } from "./LineBg.js";
import { Charactor } from "./Caharactor.js";
import { ParticleEmitter } from "./ParticleEmitter.js";

const stage = document.getElementById("MainStage");

const showStartScreen = () => {
  const pos = new Point(window.innerWidth / 2, 500);
  const btn = new StartButton(document.getElementById("Overlay"), pos, () => {
    document.getElementById("Top").style.visibility = "hidden";
    drawBg();
    initStage();
  });
}

const drawBg = (count = 20) => {
  createLines(document.getElementById("Background"), [
    "#131c38",
    "#201a33",
    "#23285e",
    "#1d1c47",
    "#2e1657"
  ], count);
}

const initStage = () => {
  const chara = new Charactor(stage);
  const emitter = new ParticleEmitter(stage);

  stage.addEventListener("click", async (ev) => {
    const pos = new Point(ev.clientX, ev.clientY);
    await chara.moveTo(pos.x);
    const star = new AnimatedStar(stage, pos);
    await star.show();
  });

  // カーソル移動時にパーティクルの発生源を移動
  const MAX_PARTICLE = 16;
  let particleAmount = 0;
  stage.addEventListener("pointermove", (ev) => {
    emitter.pos = new Point(ev.clientX, ev.clientY);
    if (particleAmount < MAX_PARTICLE) {
      particleAmount = MAX_PARTICLE;
      emitter.setAmount(particleAmount);
    }
  });

  // カーソルが動かない場合にパーティクルを減衰・停止する
  setInterval(() => {
    if (!emitter.isRunning) { return; }
    particleAmount -= 4;
    emitter.setAmount(particleAmount);
  }, 2000);
};

const initApp = () => {
  drawBg(6);
  showStartScreen();
}

initApp();
