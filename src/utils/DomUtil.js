export const createRect = (x = 0, y = 0, w = 0, h = 0, angle = 0, scale = 1) => {
  const elem = document.createElement("div");
  elem.style.position = "absolute";
  elem.style.width = `${w}px`
  elem.style.height = `${h}px`;
  elem.style.marginLeft = `${-w / 2}px`;
  elem.style.marginTop = `${-h / 2}px`;
  elem.style.backgroundRepeat = "no-repeat";

  const translateProp = (x || y) ? `translate(${x}px, ${y}px)` : "";
  const scaleProp = scale !== 1 ? `scale(${scale})` : "";
  const rotateProp = angle ? `rotate(${angle}deg)` : "";

  elem.style.transform = [translateProp, scaleProp, rotateProp].filter(prop => prop).join(" ");
  return elem;
};
