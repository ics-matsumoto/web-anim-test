import { ElemSettings } from "./ElemSettings.js";
import { Emitter } from "./Emitter.js";
import { ImgElement } from "./ImgElement.js";

const cursors = {};

class AnimatedCursor {
  constructor (parent, id, pos) {
    this.id = id;
    this.elem = new ImgElement(parent, new ElemSettings(
      "src/assets/cursor.svg",
      pos,
      40,
      40,
    ));
  }

  moveTo (pos) {
    this.elem.settings.pos = pos.clone();
    this.elem.anim(500, "ease-out");
  }
}

export const updateCursor = (parent, id, pos) => {
  if (!cursors[id]) {
    cursors[id] = new AnimatedCursor(parent, id, pos);
  } else {
    cursors[id].moveTo(pos);
  }
}
