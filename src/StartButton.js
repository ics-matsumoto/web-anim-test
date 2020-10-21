import { randomWithin } from "./Random.js";

const BTN_WIDTH = 120;
const BTN_HEIGHT = 30;

const createRect = (x = 0, y = 0, w = 0, h = 0) => {
  const elem = document.createElement("div");
  elem.style.position = "absolute";
  elem.style.width = `${w}px`
  elem.style.height = `${h}px`;
  elem.style.marginLeft = `${-w / 2}px`;
  elem.style.marginTop = `${-h / 2}px`;
  elem.style.transform = `translate(${x}px, ${y}px)`;
  return elem;
}

export class StartButton {
  constructor (parent, pos) {
    const root = createRect();
    const elem = createRect(pos.x, pos.y, BTN_WIDTH, BTN_HEIGHT)
    this.root = root;
    this.elem = elem;
    parent.appendChild(root);
    root.appendChild(elem);
    elem.style.backgroundColor = "gold";

    elem.addEventListener("click", () => {
      this.disappear();
    })
  }

  async disappear () {
    const elem = this.elem;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const scaleY = screenW / elem.offsetHeight;
    const scaleX = screenH / elem.offsetWidth;
    await elem.animate([
      {
        transform: elem.style.transform,
        backgroundColor: elem.style.backgroundColor
      },
      {
        transform: `translate(${screenW / 2}px, ${screenH / 2}px) rotate(90deg) scale(${scaleX}, ${scaleY})`,
        backgroundColor: "orange"
      }
    ], {
      duration: 800,
      easing: "ease-out"
    }).finished;
    elem.style.visibility = "hidden";

    const RECT_SIZE = 100;
    const xCount = Math.ceil(screenW / RECT_SIZE);
    const yCount = Math.ceil(screenH / RECT_SIZE);
    const rects = new Array(xCount * yCount).fill(0).map((_, index) => {
      const x = index % xCount;
      const y = (index - x) / xCount;
      const rect = createRect(x * RECT_SIZE, y * RECT_SIZE, RECT_SIZE, RECT_SIZE);
      rect.style.backgroundColor = "orange";
      this.root.appendChild(rect);
      return rect;
    });

    rects.forEach(rect => {
      rect.animate([
        { transform: rect.style.transform },
        { transform: rect.style.transform + " scale(0)" }
      ], {
        duration: 500,
        delay: randomWithin(500, 1500),
        easing: "ease-in-out",
        fill: "forwards"
      });
    })
  }
}
