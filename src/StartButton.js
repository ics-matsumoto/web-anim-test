import { createRect } from "./utils/DomUtil.js";
import { randomWithin } from "./utils/Random.js";
import { wait } from "./utils/wait.js";

const BTN_WIDTH = 120;
const BTN_HEIGHT = 40;

export class StartButton {
  constructor (parent, pos, onclick) {
    const root = createRect();
    const elem = createRect(pos.x, pos.y, BTN_WIDTH, BTN_HEIGHT);
    const text = createRect(pos.x, pos.y, BTN_WIDTH, BTN_HEIGHT);
    this.root = root;
    this.elem = elem;
    this.text = text;
    parent.appendChild(root);
    root.appendChild(elem);
    root.appendChild(text);
    elem.style.borderRadius = "2px";
    elem.style.backgroundColor = "#f7c920";
    text.style.textAlign = "center";
    text.style.lineHeight = BTN_HEIGHT + "px";
    text.innerText = "START";
    text.style.pointerEvents = "none";
    text.style.color = "#211136";

    elem.addEventListener("click", async () => {
      await this.disappear();
      onclick();
    }, {
      once: true
    })
  }

  async disappear () {
    const elem = this.elem;
    const text = this.text;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const scaleY = screenW / BTN_HEIGHT * 1.1;
    const scaleX = screenH / BTN_WIDTH * 1.1;
    await elem.animate([
      {
        transform: elem.style.transform
      },
      {
        transform: elem.style.transform + " scale(0.85)",
      }] ,{
        duration: 200,
        endDelay: 100,
        fill: "forwards",
        easing: "cubic-bezier(0,.67,.39,1)",
      }
    ).finished;
    this.text.textContent = "";
  
    await elem.animate([
      {
        transform: elem.style.transform
      },
      {
        transform: `translate(${screenW / 2}px, ${screenH / 2}px) rotate(90deg) scale(${scaleX}, ${scaleY})`,
      }], {
        duration: 800,
        easing: "cubic-bezier(0,.67,.39,1)",
        fill: "forwards"
      }
    ).finished;

    for (let proc = 0; proc <= 100; proc += 2) {
      this.text.textContent = `loading ... ${proc}%`;
      await wait(20);
    }
    this.text.textContent = "";
    elem.style.visibility = "hidden";
  
    const RECT_SIZE = 100;
    const xCount = Math.ceil(screenW / RECT_SIZE) + 1;
    const yCount = Math.ceil(screenH / RECT_SIZE) + 1;
    const rects = new Array(xCount * yCount).fill(0).map((_, index) => {
      const x = index % xCount;
      const y = (index - x) / xCount;
      const rect = createRect(x * RECT_SIZE, y * RECT_SIZE, RECT_SIZE, RECT_SIZE);
      rect.style.backgroundColor = "#f7c920";
      this.root.appendChild(rect);
      return rect;
    });

    rects.forEach((rect, index) => {
      const x = index % xCount;
      const y = (index - x) / xCount;
      rect.animate([
        { transform: rect.style.transform },
        { transform: rect.style.transform + " scale(0.01)" }
      ], {
        duration: 800,
        delay: randomWithin(y * 100, y * 100 + 200),
        easing: "cubic-bezier(0,.67,.39,1)",
        fill: "forwards"
      })
        .finished
        .then(() => {
          rect.parentNode.removeChild(rect);
        });
    });

  }
}
