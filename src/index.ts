import "./style.css";

const svgCanvas = document.getElementById("svgCanvas");

const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const clearButton = document.getElementById("clear");

svgCanvas.addEventListener("pointerdown", handlePointerDown);
svgCanvas.addEventListener("pointermove", handlePointerMove);
svgCanvas.addEventListener("pointerup", handlePointerUp);

undoButton.addEventListener("click", handleUndo);
redoButton.addEventListener("click", handleRedo);
clearButton.addEventListener("click", handleClear);
document.addEventListener("keypress", handleKeyPress);

let isDragging: boolean = false;
let movetoX: number = 0;
let movetoY: number = 0;
let strokeColor: string = "#666666";
let linetoStr: string = "";
let drawType: string = "";
let lastPath: SVGElement;
let oldPath: SVGElement;

let linetoX = [], //描画点の横座標の初期化
  linetoY = [], //描画点の縦座標の初期化
  cntMoveto: number = 0; //描画点のカウンターを初期化

function handlePointerDown(event: PointerEvent) {
  console.log("down");
  isDragging = true;

  movetoX = event.pageX - svgCanvas.clientLeft;
  movetoY = event.pageY - svgCanvas.clientTop;

  const pathElm: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  pathElm.setAttribute("d", "");
  pathElm.setAttribute("fill", "none");
  pathElm.setAttribute("stroke", strokeColor);
  pathElm.setAttribute("stroke-width", (5 * event.pressure).toString());
  lastPath = pathElm;
  svgCanvas.appendChild(pathElm);
  (linetoX = []), //描画点の横座標の初期化
    (linetoY = []), //描画点の縦座標の初期化
    (cntMoveto = 0); //描画点のカウンターを初期化
  linetoStr = "M " + movetoX + " " + movetoY + " "; //d要素でpathの開始点を設定
}

function handlePointerMove(event: PointerEvent) {
  event.preventDefault();
  if (isDragging && lastPath) {
    linetoX[cntMoveto] = event.pageX - svgCanvas.clientLeft; //SVG上のマウス座標(横方向)の取得
    linetoY[cntMoveto] = event.pageY - svgCanvas.clientTop; //SVG上のマウス座標(縦方向)の取得
    linetoStr =
      linetoStr + " L " + linetoX[cntMoveto] + " " + linetoY[cntMoveto]; //動いた後の新たなマウス座標を描画点として追加

    lastPath.setAttribute("d", linetoStr);
    cntMoveto++;
  }
}

function handlePointerUp(event: PointerEvent) {
  isDragging = false;
}

function handleColorChange(event) {}

function handleUndo() {
  if (svgCanvas.lastChild) {
    oldPath = svgCanvas.removeChild(svgCanvas.lastChild) as SVGElement;
  }
}

function handleRedo() {
  if (oldPath) {
    svgCanvas.appendChild(oldPath);
    oldPath = null;
  }
}

function handleClear() {
  while (svgCanvas.firstChild) {
    svgCanvas.removeChild(svgCanvas.firstChild);
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === "z") {
    /*Undo HotKey*/
    handleUndo();
  } else if (event.key === "z" && event.shiftKey) {
    /*Redo HotKey*/
    handleRedo();
  }
}

function handleExport() {}
