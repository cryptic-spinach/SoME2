import { axisConfig, canvasConfig, sliderConfig, trendlineConfig, debugConfig, stepperButtonConfig} from "./configs.js";
import { Point } from "./components.js"
import { part_1DoF } from "./animation.js"

export function toSeconds (milliseconds) {
    return (milliseconds / 1000).toFixed(2);
  }
  
export function formatTableAsJson (data) {
  let ret = {};

  for (let i = 0; i < data.getRowCount(); i++) {
    let rowKey = data.rows[i].arr[0].toString();
    let rowX = data.rows[i].arr[1].toString();
    let rowY = data.rows[i].arr[2].toString();
    ret[rowKey] = {x: rowX, y: rowY};
  }
  return ret;
}


export function sliderInit(myp5) {
  let ret;
  ret = myp5.createSlider(sliderConfig.min, sliderConfig.max, 0, 0.01);
  ret.position((myp5.windowWidth - canvasConfig.trimX)/2 + sliderConfig.x, (myp5.windowHeight - canvasConfig.trimY)/2 + sliderConfig.y);
  ret.style('width', '500px');
  return ret;
}

export function buttonsInit(myp5) {
  let ret = [];
  let cnv = document.querySelector(".part-1DoF")

  for (let i = 0; i < 5; i++) {
    let stepperButton = document.createElement("button");
    stepperButton.innerHTML = (i+1).toString();
    stepperButton.className = "stepper-buttons";
    positionButton(myp5, stepperButton, i)
    stepperButton.addEventListener("click", () => {
      part_1DoF.stepper = i + 1;
    })
    cnv.appendChild(stepperButton);
    ret.push(stepperButton);
  }

  
  return ret;
}

export function positionButton(myp5, button, index) {
  button.style.left = parseInt(stepperButtonConfig.x + (myp5.windowWidth  - canvasConfig.trimX)/2 + 90 * index).toString() + "px";
  button.style.top  = parseInt(stepperButtonConfig.y + (myp5.windowHeight - canvasConfig.trimY)/2             ).toString() + "px";
}


export function showValues(myp5, pairs) {
  for (let i = 0; i < pairs.length; i++) {
    showValue(myp5, pairs[i].key, pairs[i].value, i);
  }
}

export function showValue(myp5, key, value, position = 0) {
  let keyPoint = new Point(debugConfig.showValueX, debugConfig.showValueY + position * 50, key);
  let valuePoint = new Point(debugConfig.showValueX + debugConfig.showValueSpacer, debugConfig.showValueY + position * 50, value);  
  keyPoint.showLabel(myp5, "#ffffff");
  valuePoint.showLabel(myp5, "#ffffff");
}