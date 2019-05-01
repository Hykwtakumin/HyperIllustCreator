import { Points, getPoint } from "./PathDrawer";

const addPath = (canvas: SVGElement, point: Points): SVGPathElement => {
  const pathElm: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  const initialPoint = `M ${point.x} ${point.y} `;
  pathElm.setAttribute("d", initialPoint);
  pathElm.setAttribute("fill", "none");
  canvas.appendChild(pathElm);
  return pathElm;
};

export const addPoint = (
  canvas: SVGElement,
  event: PointerEvent,
  color: string,
  width: number
) => {
  /*drawMode*/
  const circleElm: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  const points = getPoint(event);

  circleElm.setAttribute("cx", `${points.x}`);
  circleElm.setAttribute("cy", `${points.y}`);
  circleElm.setAttribute("r", `${width * event.pressure}`);
  circleElm.setAttribute("fill", color);

  canvas.appendChild(circleElm);
  return circleElm;
};
