import "./style.css";
import { SVGCanvas } from "./components/SVGCanvas";

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

let strokeColor: string = "#585858";
let drawType: string = "";
let lastPath: SVGElement;
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
