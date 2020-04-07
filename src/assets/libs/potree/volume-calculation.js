// const defaultArea = [
//   { x: 1.51, y: 0, z: -1.98 },
//   { x: -0.17, y: 0, z: -1.96 },
//   { x: -0.06, y: 0, z: 0.06 },
//   { x: 1.36, y: 0, z: 0.73 }
// ];

//determinant of matrix a

export class VolumeCalculation {
    pointcloudPoints = []
    markerPoints = []
    constructor(pointcloudPoints, markerPoints) {
        this.pointcloudPoints = pointcloudPoints
        this.markerPoints = markerPoints
    }


    det(a) {
            return (
                a[0][0] * a[1][1] * a[2][2] +
                a[0][1] * a[1][2] * a[2][0] +
                a[0][2] * a[1][0] * a[2][1] -
                a[0][2] * a[1][1] * a[2][0] -
                a[0][1] * a[1][0] * a[2][2] -
                a[0][0] * a[1][2] * a[2][1]
            );
        }
        //unit normal vector of plane defined by points a, b, and c
    unit_normal(a, b, c) {
            let x = det([
                [1, a[1], a[2]],
                [1, b[1], b[2]],
                [1, c[1], c[2]]
            ]);
            let y = det([
                [a[0], 1, a[2]],
                [b[0], 1, b[2]],
                [c[0], 1, c[2]]
            ]);
            let z = det([
                [a[0], a[1], 1],
                [b[0], b[1], 1],
                [c[0], c[1], 1]
            ]);
            let magnitude = Math.pow(
                Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2),
                0.5
            );
            return [x / magnitude, y / magnitude, z / magnitude];
        }
        // dot product of vectors a and b
    dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    // cross product of vectors a and b
    cross(a, b) {
        let x = a[1] * b[2] - a[2] * b[1];
        let y = a[2] * b[0] - a[0] * b[2];
        let z = a[0] * b[1] - a[1] * b[0];
        return [x, y, z];
    }

    calculatePolygonArea(poly) {
        if (poly.length < 3) {
            return 0;
        } else {
            let total = [0, 0, 0];
            for (let i = 0; i < poly.length; i++) {
                var vi1 = poly[i];
                if (i === poly.length - 1) {
                    var vi2 = poly[0];
                } else {
                    var vi2 = poly[i + 1];
                }
                let prod = cross(vi1, vi2);
                total[0] = total[0] + prod[0];
                total[1] = total[1] + prod[1];
                total[2] = total[2] + prod[2];
            }
            let result = dot(total, unit_normal(poly[0], poly[1], poly[2]));

            return Math.abs(result / 2);
        }
    }

    /** Calculate a dynamic step size based
     * on the area of the polygon and fixed proportions.
     * Max step size should be 1m.
     */
    MAX_STEP_SIZE = 1;
    MIN_STEP_SIZE = 0.05;
    STEP_SIZE_PROPORTIONS = [
        { area: 50, stepSize: 0.05 },
        { area: 2000, stepSize: 1 }
    ];

    getStepSize(polygon) {
        const coordinates = polygon.map(point => [point.x, point.y, point.z]);
        const polyArea = calculatePolygonArea(coordinates);
        const [STEP_SIZE_PROP_1, STEP_SIZE_PROP_2] = STEP_SIZE_PROPORTIONS;
        const { area: x1, stepSize: y1 } = STEP_SIZE_PROP_1;
        const { area: x2, stepSize: y2 } = STEP_SIZE_PROP_2;
        const stepSize =
            ((y2 - y1) / (x2 - x1)) * polyArea + (x2 * y1 - x1 * y2) / (x2 - x1);
        const sizeToUse = Math.max(Math.min(stepSize, MAX_STEP_SIZE), MIN_STEP_SIZE);
        return sizeToUse;
    }

    pointInsidePolygon(point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point[0],
            y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0],
                yi = vs[i][1];
            var xj = vs[j][0],
                yj = vs[j][1];

            var intersect =
                yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    isPointInsidePolygon(point = [0, 0], polygon = defaultArea) {
        const coordinates = polygon.map(point => [point.x, point.y]);
        return pointInsidePolygon(point, coordinates);
    }

    removeFromArr(arr = [], pos = 2, until = 3) {
        let c = 0;
        return arr.reduce((acc, val) => {
            c += 1;

            if (c === until) {
                c = 0;
            }

            return c === pos ? acc : [...acc, val];
        }, []);
    }

    nestArray(arr = [], elemsToNest = 3) {
        return arr.reduce((acc, val, i) => {
            if (i % elemsToNest === 0) {
                const newArr = Array(elemsToNest)
                const fillP = newArr.fill(1)
                const mapPoint = fillP.map((el, j) => arr[i + j]);
                // .fill(1)
                // .map((el, j) => arr[i + j]);
                return [...acc, ...mapPoint];
            }
            return acc;
        }, []);
    }

    getRectangleDisclosingPolygon(polygon) {
        const minX = Math.min(...polygon.map(p => p.x));
        const minY = Math.min(...polygon.map(p => p.y));
        const maxX = Math.max(...polygon.map(p => p.x));
        const maxY = Math.max(...polygon.map(p => p.y));
        return [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: minX, y: maxY },
            { x: maxX, y: maxY }
        ];
    }

    getGridFromRectangle([bL, bR, tL, tR], stepSize) {
        const grid = [];
        for (let currY = bL.y; currY <= tL.y; currY += stepSize) {
            for (let currX = bL.x; currX <= bR.x; currX += stepSize) {
                grid.push({ x: currX + stepSize, y: currY + stepSize });
            }
        }
        return grid;
    }

    removeAllGridPointsNotInPolygon(grid, polygon) {
        return grid.filter(({ x, y }) => {
            const foundPointIn = isPointInsidePolygon([x, y], polygon);
            return foundPointIn;
        });
    }

    getNearestPoint([originX, originY], points) {

        const euclidianDistances = points.map((point, i) => {
            // console.log("i", i)
            try {
                const [currX, currY] = point;
                const triangleA = Math.abs(currX - originX);
                const triangleB = Math.abs(currY - originY);
                const distance = Math.sqrt(triangleA ** 2 + triangleB ** 2);
                return { distance, point };

            } catch (error) {
                // console.log(point, i, error)
            }

        });
        const [{ point: nearestPoint }] = euclidianDistances.sort(
            ({ distance: distance1 }, { distance: distance2 }) => {
                return distance1 - distance2;
            }
        );
        return nearestPoint;
    }

    calculatePolygonVolume({ positions: allPoints, area = defaultArea }) {
        console.log("calculate volume", allPoints)
        allPoints = objToArray(allPoints)
        console.log("calc volume all points", allPoints)
        const STEP_SIZE = getStepSize(area);

        // Step 1: Create a rectangle disclosing the whole polygon
        const disclosingRectangle = getRectangleDisclosingPolygon(area);
        console.log("disclosingRectangle", disclosingRectangle)

        // Step 2: Split this rectangle into small squares
        const fullGrid = getGridFromRectangle(disclosingRectangle, STEP_SIZE);

        console.log("fullgrid", fullGrid)
            // Step 3: Remove all squares which don't lie in that polygon
        const gridPointsInPolygon = removeAllGridPointsNotInPolygon(fullGrid, area);

        console.log("gridpoints in polygon", gridPointsInPolygon)
            // Step 4: For each grid point find the nearest position (pointcloud point)
        const nestedPoints = nestArray(allPoints); // [[1,2,3], [1,2,3], [1,2,3], ...]

        console.log("nested points", nestedPoints)

        const pointsToUse = gridPointsInPolygon.map(gridPoint => {
            const [, , h] = getNearestPoint([gridPoint.x, gridPoint.y], allPoints);
            return {
                ...gridPoint,
                h
            };
        });

        console.log("pointsto use", pointsToUse)

        // Step 5: Calculate partial volumes for each grid cell and add them up
        const lowestMeasurePointH = Math.min(...area.map(p => p.z));

        console.log("lowestmeasurepointh", lowestMeasurePointH)
        const partialVolumes = pointsToUse.map(point => {
            const volume = STEP_SIZE ** 2 * (point.h - lowestMeasurePointH);
            return volume;
        });

        console.log("partialVolumes", partialVolumes)

        const overallVolume = partialVolumes.reduce((acc, val) => acc + val, 0);

        return overallVolume;
    }

    // onmessageq = ({ data }) => {
    //   const result = calculatePolygonVolume(data);
    //   postMessage(result);
    // };

    objToArray(obj) {
        let arrayNew = []
        for (i = 0; i < obj.length - 1; i++) {
            arrayNew.push([obj[i].x, obj[i].y, obj[i].z])
        }
        return arrayNew
    }

    // console.log("text")
    // let volume = calculatePolygonVolume({
    //     positions:[],
    //     area: []
    // })
}