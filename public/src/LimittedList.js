export class LimittedList {
  constructor (maxCount, onOverflow) {
    this.list = [];
    this.maxCount = maxCount;
    this.onOverflow = onOverflow;
  }

  push (...item) {
    this.list.push(...item);
    while (this.list.length > this.maxCount) {
      const delItem = this.list.shift();
      if (this.onOverflow) {
        this.onOverflow(delItem);
      }
    }
  }
}
