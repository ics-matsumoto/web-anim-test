
import { Point } from "./Point.js";
import { AnimatedStar } from "./AnimatedStar.js";
import { StartButton } from "./StartButton.js";

const stage = document.getElementById("MainStage");

const showStartScreen = () => {
  const btn = new StartButton(stage, new Point(300, 500));
}

const initApp = () => {
  stage.addEventListener("click", async (ev) => {
    const center = new Point(ev.clientX, ev.clientY);
    const star = new AnimatedStar(stage, center);
    await star.show();
  });
};

showStartScreen();
// initApp();
