import { uid } from "./uid.js";

export class CursorModel {
  constructor (x = 0, y = 0) {
    this.uid = uid;
    this.modified = Date.now();
    this.x = x;
    this.y = y;
  }
}
