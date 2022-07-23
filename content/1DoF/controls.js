import { axisConfig, sliderConfig, palette, styles, trendlineConfig, projectionVecPalette, projectionVecStyles, stepperButtonConfig, sliderLabelConfig, trendlineLabelConfig, squaresConfig, curveConfig} from "./configs.js";

export function controlsInit() {
    let gui = new dat.GUI();
    gui.width = 300;

    // gui.addColor(palette, "backgroundFill").name("Background");
    // gui.add(trendlineConfig, "yIntInit", -axisConfig.h/2, axisConfig.h/2).name("fitting line y intercept");

    // opacityGUI(gui);
    // xyGUI(gui);
    // strokeAndFillGUI(gui);
    weightGUI(gui);
    // sizeGUI(gui);
}


export function opacityGUI(gui) {
    gui.add(projectionVecStyles, "opacity", 0, 255).name("distance opacity");
    gui.add(styles, "pointStrokeOpacity", 0, 255).name("point stroke opacity");
    gui.add(styles, "pointFillOpacity", 0, 255).name("point fill opacity")
    gui.add(styles, "segmentOpacity", 0, 255).name("segment opacity");
    gui.add(styles, "labelOpacity", 0, 255).name("label opacity");
    gui.add(axisConfig, "axisOpacity", 0, 255).name("axis opacity");
    gui.add(squaresConfig, "opacity", 0, 255).name("squares opacity");
}

export function xyGUI(gui) {
    gui.add(sliderConfig, "x", 0, 550).name("slider x");
    gui.add(sliderConfig, "y", -400, 400).name("slider y");
    gui.add(sliderLabelConfig, "x", 0, 700).name("label x");
    gui.add(sliderLabelConfig, "y", -500, 0).name("label y");
    gui.add(axisConfig, "x", -500, -100).name("axis x");
    gui.add(axisConfig, "y", -200, 100).name("axis y");
    gui.add(trendlineLabelConfig, "x", -500, 0).name("trendline label x");
    gui.add(trendlineLabelConfig, "y", 0, 500).name("trendline label y");
    gui.add(stepperButtonConfig, "x", -1000, 0).name("button x");
    gui.add(stepperButtonConfig, "y", -500, 0).name("button y");
    gui.add(curveConfig, "x", 0, 550).name("curve x");
    gui.add(curveConfig, "y", -400, 400).name("curve y");
    // gui.add(axisConfig, "horizontalLabelXOffset", -100, 100).name("horizontalLabelXOffset");
    // gui.add(axisConfig, "horizontalLabelYOffset", -100, 100).name("horizontalLabelYOffset");
    // gui.add(axisConfig, "verticalLabelXOffset", -100, 100).name("verticalLabelXOffset");
    // gui.add(axisConfig, "verticalLabelYOffset", -100, 100).name("verticalLabelYOffset");
}

export function strokeAndFillGUI(gui) {
    gui.addColor(projectionVecPalette, "distFill").name("dist fill");
    gui.addColor(palette, "pointStroke").name("point Stroke");
    gui.addColor(palette, "pointFill").name("point Fill");
}

export function weightGUI(gui) {
    gui.add(styles, "pointStrokeWeight").name("point weight");
} 

export function sizeGUI() {
    gui.add(styles, "pointRadius").name("point radius");
}