import { palette, styles, projectionVecPalette, projectionVecStyles, axisConfig, axisPalette, squaresConfig} from "./configs.js";
import { showValues } from "./helpers.js";

export class Point {
    constructor (x, y, label = "") {
        this.x = x;
        this.y = y;
        this.label = label
    }

    show(myp5) {
        let strokeWithOpacity = myp5.color(palette.pointStroke);
        strokeWithOpacity.setAlpha(styles.pointStrokeOpacity);

        let fillWithOpacity = myp5.color(palette.pointFill);
        fillWithOpacity.setAlpha(styles.pointFillOpacity);

        myp5.push();
        myp5.fill(fillWithOpacity);
        myp5.stroke(strokeWithOpacity);
        myp5.strokeWeight(styles.pointStrokeWeight);
        myp5.ellipse(this.x, this.y, styles.pointRadius, styles.pointRadius);
        myp5.pop();
    }

    showLabel(myp5, myColor = palette.labelFill, myOpacity = styles.labelOpacity, xOffset = styles.labelOffsetX, yOffset = styles.labelOffsetY) {
        let colorWithOpacity = myp5.color(myColor);
        colorWithOpacity.setAlpha(myOpacity)

        myp5.push();
        
        myp5.translate(this.x, this.y)
        myp5.scale(1, -1);

        myp5.stroke(myColor);
        myp5.fill(colorWithOpacity);
        myp5.textSize(styles.labelTextSize);
        myp5.text(this.label, xOffset, yOffset)

        myp5.pop();
    }
}

export class Segment {
    constructor (point_1, point_2, label = "") {
        this.point_1 = point_1;
        this.point_2 = point_2;
    }

    getSlopeVec(myp5) {
        return myp5.createVector(this.point_2.x - this.point_1.x, this.point_2.y - this.point_1.y);
    }

    getProjection(myp5, u, v) {
        return v.copy().mult(u.copy().dot(v) / v.copy().dot(v));
    }


    // Displays perpendicular distance from line l to point m
    getPerpendicularDistance(myp5, m) {
        // Choose the origin along l.
        // Create a vector u with tip at m.
        let u = myp5.createVector(m.x - this.point_1.x, m.y - this.point_1.y); 

        // Create unit vector v pointing along l.
        let v = this.getSlopeVec(myp5).normalize();

        // Calculate the projection of u onto v. Call it w.
        let w = this.getProjection(myp5, u, v);
        
        // Draw a line connecting m and the tip of w.
        let perpDistStart = new Point(this.point_1.x + w.x, this.point_1.y + w.y);
        let perpDistEnd = new Point(this.point_1.x + u.x, this.point_1.y + u.y);
        let perpDist = new Segment(perpDistEnd, perpDistStart);
        return perpDist;
    }

    getVerticalDistance(myp5, m) {
        let perpDist = this.getPerpendicularDistance(myp5, m).getSlopeVec(myp5);
        let vertDist;

        if (perpDist.y > 0) {
            vertDist = perpDist.copy().setHeading(myp5.PI/2);
        }
        else {
            vertDist = perpDist.copy().setHeading(-myp5.PI/2);
        }

        let angle = perpDist.angleBetween(vertDist)

        if (Math.cos(angle) != 0) {
            vertDist.setMag(perpDist.mag() / Math.cos(angle));
            return vertDist;
        }
        else {
            return;
        }
    }

    showAsVector(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = styles.segmentOpacity) {
        let slopeVec = this.getSlopeVec(myp5);
        this.showVec(myp5, this.point_1, slopeVec, myColor, myWeight, myOpacity, true);
    }
    
    showAsSegment(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = styles.segmentOpacity) {
        let slopeVec = this.getSlopeVec(myp5);
        this.showVec(myp5, this.point_1, slopeVec, myColor, myWeight, myOpacity, false);
    }

    showAsAxis(myp5, myColor = palette.segmentFill, myWeight = styles.segmentWeight, myOpacity = axisConfig.axisOpacity) {
        let slopeVec = this.getSlopeVec(myp5);
        this.showVec(myp5, this.point_1, slopeVec, myColor, myWeight, myOpacity, true);
        this.showVec(myp5, this.point_2, slopeVec.mult(-1), myColor, myWeight, myOpacity, true);
    }

    showVec(myp5, base, vec, myColor, myWeight, myOpacity, showArrowTip) {
        let colorWithOpacity = myp5.color(myColor);
        colorWithOpacity.setAlpha(myOpacity)
        myp5.push();
        myp5.stroke(colorWithOpacity);
        myp5.strokeWeight(myWeight);
        myp5.fill(colorWithOpacity);
        myp5.translate(base.x, base.y);
        myp5.line(0, 0, vec.x, vec.y);
        if(showArrowTip) {
            myp5.rotate(vec.heading());
            myp5.translate(vec.mag() - styles.segmentArrowSize, 0);
            myp5.triangle(0, styles.segmentArrowSize / 2, 0, -styles.segmentArrowSize / 2, styles.segmentArrowSize, 0);
        }
        myp5.pop();
    }

    showPerpendicularDistance(myp5, m) {
        this.getPerpendicularDistance(myp5, m).showAsSegment(myp5, projectionVecPalette.distFill, projectionVecStyles.weight, projectionVecStyles.opacity);
    }

    showVerticalDistance(myp5, m) {
        let vertDist = this.getVerticalDistance(myp5, m);
        if (vertDist != null) {
            this.showVec(myp5, m, vertDist, projectionVecPalette.distFill, projectionVecStyles.weight, projectionVecStyles.opacity, false);
        }
    }

    showSquaredError(myp5, m) {
        let vertDist = this.getVerticalDistance(myp5, m);
        let myColor = myp5.color(squaresConfig.fill);
        myColor.setAlpha(squaresConfig.opacity);
        if (vertDist != null) {
            myp5.push();
            myp5.noStroke();
            myp5.fill(myColor);
            myp5.rect(m.x, m.y, vertDist.y, vertDist.y);
            myp5.pop();
        }
    }


    rotateSegment(myp5, theta, rotateAboutPoint) {
        let vec1 = myp5.createVector(this.point_1.x - rotateAboutPoint.x, this.point_1.y - rotateAboutPoint.y)
        let transVec1 = vec1.copy().rotate(theta);

        let vec2 = myp5.createVector(this.point_2.x - rotateAboutPoint.x, this.point_2.y - rotateAboutPoint.y)
        let transVec2 = vec2.copy().rotate(theta);

        this.updatePoint1(transVec1, rotateAboutPoint);
        this.updatePoint2(transVec2, rotateAboutPoint);
    }

    updatePoint1(vec, point) {
        this.point_1.x = vec.x + point.x;
        this.point_1.y = vec.y + point.y;
    }

    updatePoint2(vec, point) {
        this.point_2.x = vec.x + point.x;
        this.point_2.y = vec.y + point.y;
    }
}

export class Axes {
    constructor(x, y, right, up, left, down, xLabel = "", yLabel = "") {
        this.x = x;
        this.y = y;
        this.right = right;
        this.up = up;
        this.left = left;
        this.down = down;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
    }

    show(myp5) {
        let xAxisStart = new Point(-this.left + this.x, 0 + this.y);
        let xAxisEnd = new Point(this.right + this.x, 0 + this.y, this.xLabel);
        let xAxis = new Segment(xAxisStart, xAxisEnd);

        let yAxisStart = new Point(0 + this.x, -this.down + this.y);
        let yAxisEnd = new Point(0 + this.x, this.up + this.y, this.yLabel);
        let yAxis = new Segment(yAxisStart, yAxisEnd);
            
        xAxis.showAsAxis(myp5);
        yAxis.showAsAxis(myp5);

        xAxisEnd.showLabel(myp5, axisPalette.fill, styles.labelOpacity, axisConfig.horizontalLabelXOffset, axisConfig.horizontalLabelYOffset);
        yAxisEnd.showLabel(myp5, axisPalette.fill, styles.labelOpacity, axisConfig.verticalLabelXOffset, axisConfig.verticalLabelYOffset);
    }
}

export class PointCloud {
    constructor(points, xOffset, yOffset) {
        this.originalpoints = points;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        let offsetPoints = [];
        points.forEach(p => {
            let x = p.x + xOffset;
            let y = p.y + yOffset;
            offsetPoints.push(new Point(x, y));
        });
        this.points = offsetPoints;
    }

    showAsCurve(myp5) {
        myp5.push()
        myp5.noFill()
        myp5.stroke(255);
      
        myp5.beginShape();
        for (let v of this.points) {
          myp5.vertex(v.x, v.y);
        }
        myp5.endShape();
        myp5.pop()
    }

    showFunctionValue(myp5, fitline, fitpoints) {
        let fitlineVec = fitline.getSlopeVec(myp5);
        // console.log(fitlineVec)

        if (fitlineVec.x != 0) {
            let b = fitlineVec.y/fitlineVec.x

            let xScale = 200;
            let yScale = 1/5000;
            
            let qua  = fitpoints.map(p => p.x * p.x).reduce((partialSum, a) => partialSum + a, 0)     ;
            let lin  = fitpoints.map(p => p.x * p.y).reduce((partialSum, a) => partialSum + a, 0) * -2;
            let con  = fitpoints.map(p => p.y * p.y).reduce((partialSum, a) => partialSum + a, 0)     ;
        
            let xPos = b * xScale;
            let yPos = (qua*b*b + lin*b + con) * yScale;

            let point = new Point(xPos + this.xOffset, yPos + this.yOffset);
            point.show(myp5);

            let vals = [
                {key: "slope", value: b.toFixed(2)}
            ]

            showValues(myp5, vals);

            // console.log(point)
        }
    }
}