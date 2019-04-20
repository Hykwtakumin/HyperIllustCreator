import "./style.css";

const svgCanvas = document.getElementById("svgCanvas");
svgCanvas.setAttribute("width", window.innerWidth.toString());
svgCanvas.setAttribute("height", (window.innerHeight * 0.8).toString());
svgCanvas.setAttribute("xmlns", "http://www.w3.org/2000/svg");
svgCanvas.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

const colorPicker = document.getElementById("color");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const clearButton = document.getElementById("clear");
const addLinkButton = document.getElementById("addLink");
const importButton = document.getElementById("import");
const dlButton = document.getElementById("download");

const dialog = document.getElementById("dialog") as HTMLDialogElement;
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");

svgCanvas.addEventListener("pointerdown", handlePointerDown);
svgCanvas.addEventListener("pointermove", handlePointerMove);
svgCanvas.addEventListener("pointerup", handlePointerUp);

colorPicker.addEventListener("change", handleColorChange);
undoButton.addEventListener("click", handleUndo);
redoButton.addEventListener("click", handleRedo);
clearButton.addEventListener("click", handleClear);
addLinkButton.addEventListener("click", handleAddLink);
importButton.addEventListener("click", handelImpotButton);
dlButton.addEventListener("click", handelDlButton);
document.addEventListener("keypress", handleKeyPress);

modalCancel.addEventListener("click", handleModalCancel);
modalConfirm.addEventListener("click", handleModalConfirm);

let isDragging: boolean = false;
let isSelecting: boolean = false;
let movetoX: number = 0;
let movetoY: number = 0;
let strokeColor: string = "#585858";
let linetoStr: string = "";
let drawType: string = "";
let lastPath: SVGElement;
let oldPath: SVGElement;
let selectedPath: SVGElement;
let prevElm: SVGElement;

let linetoX = [], //描画点の横座標の初期化
  linetoY = [], //描画点の縦座標の初期化
  cntMoveto: number = 0; //描画点のカウンターを初期化

function handlePointerDown(event: PointerEvent) {
  if (!isSelecting) {
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
    pathElm.setAttribute("stroke-width", (6 * event.pressure).toString());
    lastPath = pathElm;
    svgCanvas.appendChild(pathElm);
    (linetoX = []), //描画点の横座標の初期化
      (linetoY = []), //描画点の縦座標の初期化
      (cntMoveto = 0); //描画点のカウンターを初期化
    linetoStr = "M " + movetoX + " " + movetoY + " "; //d要素でpathの開始点を設定
  } else {
    /*パスを選択してリンクを追加*/
    console.dir(event.srcElement);
    selectedPath = event.srcElement as SVGElement;
    //selectedPath.classList.add("selectedPath");
    dialog.showModal();
    console.dir(dialog.returnValue);
    isSelecting = false;
  }
}

function handleModalCancel() {
  dialog.close();
  isSelecting = false;
}

function handleModalConfirm() {
  const link = document.getElementById("pathLink") as HTMLInputElement;
  const appendLink = link.value;
  console.log(`link : ${appendLink}`);
  const linkElm: SVGAElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "a"
  );
  linkElm.setAttribute("xlink:href", appendLink);
  linkElm.setAttribute("target", "_blank");
  selectedPath.appendChild(linkElm);
  selectedPath.parentNode.insertBefore(linkElm, selectedPath);
  const copyPath = svgCanvas.removeChild(selectedPath);
  linkElm.appendChild(copyPath);
  dialog.close();
}

function handlePointerMove(event: PointerEvent) {
  event.preventDefault();
  if (lastPath && isDragging) {
    linetoX[cntMoveto] = event.pageX - svgCanvas.clientLeft; //SVG上のマウス座標(横方向)の取得
    linetoY[cntMoveto] = event.pageY - svgCanvas.clientTop; //SVG上のマウス座標(縦方向)の取得
    linetoStr =
      linetoStr + " L " + linetoX[cntMoveto] + " " + linetoY[cntMoveto]; //動いた後の新たなマウス座標を描画点として追加

    lastPath.setAttribute("d", linetoStr);
    cntMoveto++;
  } else if (lastPath) {
    const srcElm = event.srcElement as SVGElement;
    if (srcElm.id !== "svgCanvas") {
      if (prevElm) {
        prevElm.classList.remove("select-overlay");
      }
      srcElm.classList.add("select-overlay");
      prevElm = srcElm;
    } else {
      if (prevElm) {
        prevElm.classList.remove("select-overlay");
        prevElm = null;
      }
    }
  }
}

function handlePointerUp(event: PointerEvent) {
  isDragging = false;
}

function handleColorChange(event) {
  strokeColor = event.target.value;
}

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

function handleAddLink() {
  isDragging = false;
  isSelecting = true;
}

function handelImpotButton() {}

function handelDlButton() {
  const fileName = "hyperillust.svg";

  const blobObject: Blob = new Blob(
    [new XMLSerializer().serializeToString(svgCanvas)],
    { type: "image/svg+xml;charset=utf-8" }
  );
  const dlUrl = window.URL.createObjectURL(blobObject);
  const dlLink = document.createElement("a");
  document.body.appendChild(dlLink);
  dlLink.setAttribute("href", dlUrl);
  dlLink.setAttribute("target", "_blank");
  dlLink.setAttribute("download", fileName);
  dlLink.click();
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
