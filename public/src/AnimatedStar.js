import { ImgElement } from "./ImgElement.js";
import { ElemSettings } from "./ElemSettings.js";
import { LineElement } from "./LineElement.js";
import { LineSettings } from "./LineSettings.js";
import { Point } from "./Point.js";
import { randomWithin } from "./Random.js";

const createStarElem = (parent, center) => {
  return new ImgElement(
    parent,
    new ElemSettings(
      "src/assets/star.svg",
      new Point(center.x, center.y + 5),
      50,
      50,
      randomWithin(-30, 30),
      0
    )
  ); 
};

const animateLine = async (parent, center, angle) => {
  const line = new LineElement(
    parent,
    new LineSettings(
      center,
      8,
      8,
      angle,
      `hsl(${randomWithin(40, 50)}, 100%, ${randomWithin(50, 80)}%)`,
      50
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
};

const showStar = async (star) => {
  await star.anim(400);
  star.settings.scale = 1.5;
  await star.anim(200, "ease-out");
  star.settings.scale = randomWithin(0.8, 1.1);
  await star.anim(100);
};

const showStarWithLine = async (star, parent, center) => {
  const promises = [];
  promises.push(showStar(star));
  for (let index = 0; index < LINE_COUNT; index++) {
    promises.push(animateLine(parent, center, (360 / LINE_COUNT) * index));
  }
  await Promise.all(promises);
};

const hideStar = async (star) => {
  star.settings.scale = 1.3;
  await star.anim(300, "ease");
  star.settings.scale = 0;
  await star.anim(200, "cubic-bezier(0,.67,.39,1)");
};

const LINE_COUNT = 7;
export class AnimatedStar {
  constructor (parent, center) {
    this.parent = parent;
    this.center = center;
    this.star = createStarElem(parent, center); 
  }

  async show (hasLineAnimation = true) {
    if (hasLineAnimation) {
      await showStarWithLine(this.star, this.parent, this.center);
    } else {
      await showStar(this.star);
    }
  }

  async hide () {
    await hideStar(this.star);
  }

  dispose () {
    this.star.dispose();
  }
}

