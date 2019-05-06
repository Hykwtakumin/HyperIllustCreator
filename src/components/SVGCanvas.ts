import { EditorMode, DrawMode } from "./EditorMode";
import {
  Points,
  getPoint,
  addPath,
  drawPath,
  setPointerEventsEnableToAllPath,
  setPointerEventsDisableToAllPath
} from "./PathDrawer";
import {
  addPoint,
  addPointWithpCircle,
  addPolyLine,
  addDot
} from "./PointDrawer";
import { addRect, drawRect } from "./RectDrawer";

export type pCircle = {
  point: {
    x: number;
    y: number;
  };
  r: number;
};

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
  pCircleList: pCircle[];

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
    this.pCircleList = [];
    this.lastCircle = null;
  }

  /*for canvas resize*/
  resizeCanvasSize = (width: number, height: number) => {
    this.canvas.style.width = width.toString();
    this.canvas.style.height = height.toString();
    this.canvas.setAttribute("viewBox", `0,0,${width},${height}`);
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

        this.lastCircle = pointElm;

        // const point = addPointWithpCircle(
        //   this.canvas,
        //   event,
        //   this.color,
        //   this.penWidth
        // );
        // this.pCircleList.push(point);
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

          if (this.lastCircle) {
            /*共通外接線を求めて表示する*/
            /* Common circumstances */
            const prevCircle = this.lastCircle;
            const prevR = parseFloat(prevCircle.getAttribute("r"));
            const prevCx = parseFloat(prevCircle.getAttribute("cx"));
            const prevCy = parseFloat(prevCircle.getAttribute("cy"));
            //console.log(`prevR : ${prevR}`);

            const nowR = parseFloat(pointElm.getAttribute("r"));
            const nowCx = parseFloat(pointElm.getAttribute("cx"));
            const nowCy = parseFloat(pointElm.getAttribute("cy"));

            //console.log(`nowR : ${nowR}`);
            //console.log(`nowCx : ${nowCx}`);
            //console.log(`nowCy : ${nowCy}`);

            const diffR = prevR - nowR;
            const powNowXY = nowCx ** 2 + nowCy ** 2;

            const ccx1 =
              prevR *
              ((nowCx * diffR + nowCy * Math.sqrt(powNowXY - diffR ** 2)) /
                powNowXY);

            const ccx2 =
              prevR *
              ((nowCx * diffR - nowCy * Math.sqrt(powNowXY - diffR ** 2)) /
                powNowXY);

            const ccy1 =
              prevR *
              ((nowCy * diffR - nowCx * Math.sqrt(powNowXY - diffR ** 2)) /
                powNowXY);
            const ccy2 =
              prevR *
              ((nowCy * diffR + nowCx * Math.sqrt(powNowXY - diffR ** 2)) /
                powNowXY);

            console.log(`ccx1 : ${ccx1}`);
            console.log(`ccy1 : ${ccy1}`);

            const point1: Points = {
              x: ccx1,
              y: ccy1
            };

            const point2: Points = {
              x: ccx2,
              y: ccy2
            };

            addDot(this.canvas, point1);
            addDot(this.canvas, point2);

            this.lastCircle = pointElm;
          } else {
            this.lastCircle = pointElm;
          }

          // const point = addPointWithpCircle(
          //   this.canvas,
          //   event,
          //   this.color,
          //   this.penWidth
          // );
          // this.pCircleList.push(point);
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
    } else if (
      this.editorMode === EditorMode.draw &&
      this.drawMode === DrawMode.point
    ) {
      this.lastCircle = null;
      //const polyLine = addPolyLine(this.canvas, this.color, this.pCircleList);
      //console.dir(polyLine);
      //this.pCircleList.length = 0;
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
