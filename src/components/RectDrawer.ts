import { Points, getPoint } from "./PathDrawer";

export const addRect = (canvas: SVGElement, point: Points): SVGRectElement => {
  const rectElm: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rectElm.setAttribute("x", point.x.toString());
  rectElm.setAttribute("y", point.y.toString());
  rectElm.setAttribute("width", "0");
  rectElm.setAttribute("height", "0");
  rectElm.setAttribute("fill", "#01bc8c");
  rectElm.setAttribute("fill-opacity", "0.25");
  canvas.appendChild(rectElm);
  return rectElm;
};

export const drawRect = (rect: SVGRectElement, point: Points) => {
  const prevX = parseFloat(rect.getAttribute("x"));
  const prevY = parseFloat(rect.getAttribute("y"));

  const dx = point.x - prevX;
  const dy = point.y - prevY;
  rect.setAttribute("width", dx.toString());
  rect.setAttribute("height", dy.toString());
};
