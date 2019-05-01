import { EditorMode, DrawMode } from "./EditorMode";
import { getPoint, addPath, drawPath } from "./PathDrawer";
import { addPoint } from "./PointDrawer";
import { addRect, drawRect } from "./RectDrawer";

export class SVGCanvas {
  canvas: SVGElement;
  lastPath: SVGPathElement;
  lastRect: SVGRectElement;
  lastCircle: SVGCircleElement;
  prevEvent: PointerEvent;
  groupingList: SVGElement[];
  isDragging: boolean;
  isAllowTouch: boolean;
  editorMode: EditorMode;
  drawMode: DrawMode;
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
    this.drawMode = DrawMode.path;
    this.color = "#585858";
    /* other setting */
    this.groupingList = [];
  }

  /*for canvas resize*/
  resizeCanvasSize = (width: number, height: number) => {
    this.canvas.style.width = width.toString();
    this.canvas.style.height = height.toString();
  };

  handleDown = (event: PointerEvent) => {
    event.preventDefault();
    if (this.editorMode === EditorMode.draw) {
      this.isDragging = true;

      if (this.drawMode === DrawMode.path) {
        const path = addPath(this.canvas, getPoint(event));
        path.setAttribute("stroke", this.color);
        path.setAttribute("stroke-width", this.penWidth.toString());
        path.classList.add("current-path");
        this.lastPath = path;
      } else if (this.drawMode === DrawMode.point) {
        const pointElm = addPoint(
          this.canvas,
          event,
          this.color,
          this.penWidth
        );
      }
    } else if (this.editorMode === EditorMode.elase) {
      /* 消しゴムモード */
    } else if (this.editorMode === EditorMode.edit) {
      /* 編集モード */

      // if (this.lastRect) {
      //   this.canvas.removeChild(this.lastRect);
      // }

      if (this.groupingList.length > 0) {
        this.groupingList.length = 0;
      }

      if (this.lastRect) {
        this.lastRect.remove();
      }

      this.isDragging = true;
      const rect = addRect(this.canvas, getPoint(event));
      this.lastRect = rect;
    }
  };

  handleMove = (event: PointerEvent) => {
    if (this.isDragging) {
      event.preventDefault();
      if (this.editorMode === EditorMode.draw) {
        if (this.drawMode === DrawMode.path && this.lastPath) {
          if (!this.isAllowTouch) {
            if (event.pointerType !== "touch") {
              //pen or mouse only
              drawPath(this.lastPath, getPoint(event));
            }
          } else {
            drawPath(this.lastPath, getPoint(event));
          }
        } else if (this.drawMode === DrawMode.point) {
          const pointElm = addPoint(
            this.canvas,
            event,
            this.color,
            this.penWidth
          );
        }
      } else if (this.editorMode === EditorMode.elase) {
        /* 消しゴムモード */
      } else if (this.editorMode === EditorMode.edit && this.lastRect) {
        /* 編集モード */
        drawRect(this.lastRect, getPoint(event));
      }
    }
  };

  handleUp = (event: PointerEvent) => {
    event.preventDefault();
    this.isDragging = false;

    if (this.lastPath) {
      this.lastPath.classList.remove("current-path");
      this.lastPath = null;
    }

    if (this.editorMode === EditorMode.edit && this.lastRect) {
      /* 編集モード */
      const pathAllay = Array.from(document.querySelectorAll("path"));

      const rectX: number = parseFloat(this.lastRect.getAttribute("x"));
      const rectY: number = parseFloat(this.lastRect.getAttribute("y"));
      const rectWidth: number = parseFloat(this.lastRect.getAttribute("width"));
      const rectHeight: number = parseFloat(
        this.lastRect.getAttribute("height")
      );

      const rectCanvas = this.canvas as SVGSVGElement;
      const inRect = rectCanvas.createSVGRect();
      inRect.x = rectX;
      inRect.y = rectY;
      inRect.width = rectWidth;
      inRect.height = rectHeight;
      const list = Array.from(rectCanvas.getIntersectionList(inRect, null));
      const rected = list.pop();

      list.forEach((item: SVGElement) => {
        this.groupingList.push(item);
      });

      console.dir(this.groupingList);
    }
  };
  /* clear canvas */
  clearCanvas = () => {
    while (this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild);
    }
  };

  redoCanvas = () => {
    // if (this.lastPath) {
    //   this.canvas.removeChild(this.lastPath);
    // }
    if (this.canvas.lastChild) {
      this.canvas.removeChild(this.canvas.lastChild);
    }
  };

  /* change stroke color */
  changeColor = (color: string) => {
    this.color = color;
  };
}
