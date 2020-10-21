import { CursorModel } from "./CursorModel.js";
import { StarModel } from "./StarModel.js";
import { uid } from "./uid.js";

const STAR_LIMIT = 10;
const CURSOR_KEEP_ALIVE_SEC = 20;
const CURSOR_UPDATE_INTERVAL_MS = 500;
const db = firebase.database();

let cursorUpdateValue = null;
let lastcursorUpdated = 0;
let cursorUpdateTimer = null;

export const database = {
  async addStar (starModel) {
    await db.ref("stars").push({
      uid: starModel.uid,
      created: starModel.created,
      x: starModel.x,
      y: starModel.y
    });
  },

  updateCursor (cursorModel) {
    cursorUpdateValue = cursorModel;
    if (cursorUpdateTimer) { return; }
    const waitMs = Math.max(0, CURSOR_UPDATE_INTERVAL_MS - (Date.now() - lastcursorUpdated));
    cursorUpdateTimer = setTimeout(() => {
      db.ref(`cursors/${uid}`).update({
        uid: cursorModel.uid,
        modified: cursorModel.modified,
        x: cursorModel.x,
        y: cursorModel.y
      });
      lastcursorUpdated = Date.now();
      cursorUpdateTimer = null;
    }, waitMs);
  },

  watchStars (onAdded, onRemoved) {
    const starsRef = db.ref("stars");
    starsRef.orderByKey().limitToLast(STAR_LIMIT).on("child_added", (snap) => {
      const data = snap.val();
      if (!data) { return; }
      if (!data.uid || data.uid === uid) { return; }
      const star = new StarModel();
      star.x = data.x;
      star.y = data.y;
      star.uid = data.uid;
      star.created = data.created;
      onAdded(star);
    });
  },

  watchCursors (onMove) {
    const cursorsRef = db.ref("cursors");
    cursorsRef
      .orderByChild("modified")
      .startAt(Date.now() - CURSOR_KEEP_ALIVE_SEC * 1000)
      .on("child_changed", async (snap) => {
        const data = await snap.val();
        if (!data.uid || data.uid === uid) { return; }
        const cursor = new CursorModel();
        cursor.modified = data.modified;
        cursor.uid = data.uid;
        cursor.x = data.x;
        cursor.y = data.y;
        onMove(cursor);
      });
  },

  cleanup () {
    const starsRef = db.ref("stars");
    starsRef.orderByKey().once("value", snap => {
      const keys = [];
      snap.forEach(data => {
        keys.push(data.key);
      })
      if (keys.length <= STAR_LIMIT) { return; }
      keys.length -= STAR_LIMIT;
      keys.forEach(key => db.ref(`stars/${key}`).remove());  
    });

    const cursorsRef = db.ref("cursors");
    cursorsRef
      .orderByChild("modified")
      .startAt(Date.now() - CURSOR_KEEP_ALIVE_SEC * 1000)
      .once("value", async (snap) => {
        db.ref(`cursors/${snap.key}`).remove();
      });
  }
};
