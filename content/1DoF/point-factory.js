import { trendlineConfig, axisConfig, curveConfig} from "./configs.js";
import { Point, PointCloud } from "./components.js";

export function generateLinearFitPoints(myp5, numberOfPoints) {
    let ret = []
  
    let m = trendlineConfig.slopeInit;
    let b = trendlineConfig.yIntInit;
    let errorRange = trendlineConfig.maxError;
  
    for (let i = 0; i < numberOfPoints; i++) {
      let xMin = - axisConfig.left;
      let xMax = axisConfig.right;
  
      let x = myp5.random(xMin, xMax);
      let y = myp5.random(m*x + b - errorRange, m*x + b + errorRange);
      
      let point = new Point(x, y);
      ret.push(point);
    }
  
    return ret;
  }

export function generateErrorCurvePoints(myp5, points) {
    let path = [];

    let xScale = 200;
    let yScale = 1/5000;
    
    let qua  = points.map(p => p.x * p.x).reduce((partialSum, a) => partialSum + a, 0)     ;
    let lin  = points.map(p => p.x * p.y).reduce((partialSum, a) => partialSum + a, 0) * -2;
    let con  = points.map(p => p.y * p.y).reduce((partialSum, a) => partialSum + a, 0)     ;

    for (let b = 0; b < 3.6; b += 0.01) {
        let xPos = b * xScale;
        let yPos = (qua*b*b + lin*b + con) * yScale;

        path.push({"x": xPos, "y": yPos});
    }

    return path;
}