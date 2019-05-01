export class BoundingBox {
  canvas: SVGElement;
  event: PointerEvent;
  boundigRect: SVGElement;
  constructor(canvas: SVGElement, event: PointerEvent) {
    /* canva setting */
    this.canvas = canvas;
    /* pen setting */
    this.boundigRect;
  }

  addBoundingBox() {}

  zoomIn() {}

  zoomOut() {}

  rotate() {}

  moveBox() {}
}
