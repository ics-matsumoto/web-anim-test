import { uid } from "./uid.js";

export class StarModel {
  constructor (x = 0, y = 0) {
    this.uid = uid;
    this.created = Date.now();
    this.x = x;
    this.y = y;
  }
}
