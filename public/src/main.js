import { updateCursor } from "./AnimatedCursor.js";
import { AnimatedStar } from "./AnimatedStar.js";
import { Emitter } from "./Emitter.js";
import { CursorModel } from "./firebase/CursorModel.js";
import { database } from "./firebase/database.js";
import { StarModel } from "./firebase/StarModel.js";
import { LimittedList } from "./LimittedList.js";
import { createLines } from "./LineBg.js";
import { Point } from "./Point.js";

const elApp = document.getElementById("app");

const initApp = () => {
  createLines(elApp, [
    "#131c38",
    "#201a33",
    "#23285e",
    "#1d1c47",
    "#2e1657"
  ], 20);

  const appStartTime = Date.now();
  const starList = new LimittedList(20, async (star) => {
    await star.hide();
    star.dispose();
  })

  elApp.addEventListener("click", (ev) => {
    const pos = new Point(ev.clientX, ev.clientY);
    const star = new AnimatedStar(elApp, pos);
    star.show();
    database.addStar(new StarModel(pos.x, pos.y));
    starList.push(star);
  });

  const emitter = new Emitter(elApp);
  emitter.nps = 10;

  elApp.addEventListener("pointermove", ev => {
    const cursor = new CursorModel(ev.clientX, ev.clientY);
    database.updateCursor(cursor);
    const pos = new Point(ev.clientX, ev.clientY);
    emitter.pos = pos
    emitter.start();
    setTimeout(() => {
      if (emitter.pos.sub(pos).length < 5) {
        emitter.stop();
      }
    }, 500);
  })

  database.watchStars((starModel) => {
    const isNewStar = starModel.created > appStartTime;
    const pos = new Point(starModel.x, starModel.y);
    const star = new AnimatedStar(elApp, pos);
    star.show(isNewStar);
    starList.push(star);
  });

  database.watchCursors((cursorModel) => {
    updateCursor(elApp, cursorModel.id, new Point(cursorModel.x, cursorModel.y));
  });

  database.cleanup();
  
};

initApp();
