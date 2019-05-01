import "./style.css";
import { SVGCanvas } from "./components/SVGCanvas";
import { EditorMode, DrawMode } from "./components/EditorMode";

const colorPicker = document.getElementById("color");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const clearButton = document.getElementById("clear");
const addLinkButton = document.getElementById("addLink");
const importButton = document.getElementById("import");
const dlButton = document.getElementById("download");

const modeMenu = document.getElementById("editorMenu") as HTMLSelectElement;
const widthMenu = document.getElementById("widthMenu") as HTMLSelectElement;
const drawModeMenu = document.getElementById("drawMode") as HTMLSelectElement;

const dialog = document.getElementById("dialog") as HTMLDialogElement;
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");

modeMenu.addEventListener("change", handleModeChange);
widthMenu.addEventListener("change", handleWidthChange);
drawModeMenu.addEventListener("change", handelDrawModeChange);

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

let oldPath: SVGElement;
let selectedPath: SVGElement;
let prevElm: SVGElement;

const root = document.getElementById("svgRoot");
const svgCanvas = new SVGCanvas(root);
svgCanvas.resizeCanvasSize(window.innerWidth, window.innerHeight * 0.7);

/* onResize */
window.onresize = () => {
  svgCanvas.resizeCanvasSize(window.innerWidth, window.innerHeight * 0.7);
};

function handleWidthChange(event) {
  svgCanvas.penWidth = event.target.value;
}

function handleModeChange(event) {
  svgCanvas.editorMode = event.target.value as EditorMode;
  console.log(`mode: ${svgCanvas.editorMode}`);
  switch (event.target.value) {
    case `edit`:
      svgCanvas.editorMode = 0;
      break;
    case `draw`:
      svgCanvas.editorMode = 1;
      break;
    case `elase`:
      svgCanvas.editorMode = 2;
      break;
    default:
      svgCanvas.editorMode = 1;
  }
}

function handelDrawModeChange(event) {
  /*デフォルトは線による描画*/
  svgCanvas.drawMode = event.target.value as DrawMode;
  console.log(`mode: ${svgCanvas.drawMode}`);
  switch (event.target.value) {
    case `path`:
      svgCanvas.drawMode = 0;
      break;
    case `point`:
      svgCanvas.drawMode = 1;
      break;
    default:
      svgCanvas.drawMode = 0;
  }
}

function handleModalCancel() {
  dialog.close();
}

function handleModalConfirm() {
  const link = document.getElementById("pathLink") as HTMLInputElement;
  const appendLink = link.value;
  console.log(`link : ${appendLink}`);
  const linkElm: SVGAElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "a"
  );

  const groupingElm: SVGGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  /* 選択されているパス郡をグループ化する */
  svgCanvas.canvas.appendChild(groupingElm);
  svgCanvas.groupingList.forEach(path => {
    const copyPath = svgCanvas.canvas.removeChild(path);
    groupingElm.appendChild(path);
  });

  console.dir(groupingElm);

  /* グループをaタグ内に格納する */
  linkElm.setAttribute("xlink:href", appendLink);
  linkElm.setAttribute("target", "_blank");
  groupingElm.appendChild(linkElm);
  groupingElm.parentNode.insertBefore(linkElm, groupingElm);
  const copyGroup = svgCanvas.canvas.removeChild(groupingElm);
  linkElm.appendChild(copyGroup);

  /* inRectを削除 */
  if (svgCanvas.lastRect) {
    svgCanvas.canvas.removeChild(svgCanvas.lastRect);
  }
  dialog.close();
}

function handleColorChange(event) {
  svgCanvas.changeColor(event.target.value);
}

function handleUndo() {
  svgCanvas.redoCanvas();
}

function handleRedo() {
  if (oldPath) {
    svgCanvas.appendChild(oldPath);
    oldPath = null;
  }
}

function handleClear() {
  svgCanvas.clearCanvas();
}

function handleAddLink() {
  svgCanvas.isDragging = false;
  dialog.showModal();
}

function handelImpotButton() {}

function handelDlButton() {
  const fileName = "hyperillust.svg";

  const blobObject: Blob = new Blob(
    [new XMLSerializer().serializeToString(svgCanvas.canvas)],
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
