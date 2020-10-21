
import { Point } from "./Point.js";
import { AnimatedStar } from "./AnimatedStar.js";
import { StartButton } from "./StartButton.js";
import { createLines } from "./LineBg.js";

const stage = document.getElementById("MainStage");

const showStartScreen = () => {
  const pos = new Point(window.innerWidth / 2, 500);
  const btn = new StartButton(stage, pos, () => {
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
  stage.addEventListener("click", async (ev) => {
    const center = new Point(ev.clientX, ev.clientY);
    const star = new AnimatedStar(stage, center);
    await star.show();
  });
};

const initApp = () => {
  drawBg(6);
  showStartScreen();
}

initApp();
