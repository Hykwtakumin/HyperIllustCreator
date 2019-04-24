import { EditorMode } from "./EditorMode";
import { getPoint, addPath, drawPath } from "./PathDrawer";

export class SVGCanvas {
  canvas: SVGElement;
  lastPath: SVGPathElement;
  prevEvent: PointerEvent;
  isDragging: boolean;
  isAllowTouch: boolean;
  editorMode: EditorMode;
  color: string;
  penWidth: number;
  constructor(canvas: SVGElement) {
    /* canva setting */
    this.canvas = canvas;
    this.canvas.addEventListener("pointerdown", this.handleDown);
    this.canvas.addEventListener("pointermove", this.handleMove);
    this.canvas.addEventListener("pointerup", this.handleUp);
    /* pen setting */
    this.editorMode = EditorMode.draw;
    this.isAllowTouch = false;
    this.penWidth = 6;
    this.color = "#585858";
  }

  /*for canvas resize*/
  resizeCanvasSize = (width: number, height: number) => {
    this.canvas.style.width = width.toString();
    this.canvas.style.height = height.toString();
  };

  handleDown = (event: PointerEvent) => {
    event.preventDefault();
    this.isDragging = true;

    const path = addPath(this.canvas, getPoint(event));
    path.setAttribute("stroke", this.color);
    path.setAttribute("stroke-width", this.penWidth.toString());
    this.lastPath = path;
  };
  handleMove = (event: PointerEvent) => {
    event.preventDefault();
    if (this.isDragging && this.lastPath) {
      if (!this.isAllowTouch) {
        if (event.pointerType !== "touch") {
          //pen or mouse only
          drawPath(this.lastPath, getPoint(event));
        }
      } else {
        drawPath(this.lastPath, getPoint(event));
      }
    }
  };

  handleUp = (event: PointerEvent) => {
    event.preventDefault();
    this.isDragging = false;
  };
}
