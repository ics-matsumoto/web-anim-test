import { ImgElement } from "./ImgElement.js";
import { ElemSettings } from "./ElemSettings.js";
import { LineElement } from "./LineElement.js";
import { LineSettings } from "./LineSettings.js";
import { Point } from "./Point.js";
import { randomWithin } from "./Random.js";

const elApp = document.getElementById("app");

const animateLine = async (center, angle) => {
  const line = new LineElement(
    elApp,
    new LineSettings(
      center, 8, 8, angle, `hsl(${randomWithin(40, 50)}, 100%, ${randomWithin(50, 80)}%)`, 50
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
}

const animateStar = async (center) => {
  const star = new ImgElement(
    elApp,
    new ElemSettings(
      "src/assets/star.svg", center, 50, 50, randomWithin(-30, 30), 0
    )
  );
  await star.anim(400);
  star.settings.scale = 1.5;
  await star.anim(200, "ease-out");
  star.settings.scale = randomWithin(0.8, 1.1);
  await star.anim(100);
  
  setTimeout(async () => {
    star.settings.scale = 1.3;
    await star.anim(300, "ease");
    star.settings.scale = 0;
    await star.anim(200, "cubic-bezier(0,.67,.39,1)");
    star.dispose();
  }, 2000);
}

const makeStar = async (center) => {
  const LINE_COUNT = 7;
  animateStar(center);
  for (let index = 0; index < LINE_COUNT; index++) {
    animateLine(center, 360 / LINE_COUNT * index);
  }

}

const initApp = () => {
  elApp.addEventListener("click", ev => {
    makeStar(new Point(ev.clientX, ev.clientY));
  })
};

initApp();
