/**
 * Point cloud class
 * Simples object, containing only points
 */
class PointCloud {
    /**
     * Constructor of a cloud of points
     * 
     * @param position Postion of the center of the cloud
     * @param points Set of points making the cloud (should be an array of vectors relative to the center of the cloud)
     * @param ptColor Color of the points
     * @param ptThick Thickness of the points
     */
    constructor(position, points, ptColor=230, ptThick=2) {
        this.pos = position;
        this.points = points;
        this.ptColor = color(ptColor);
        this.ptThick = ptThick;
    }

    /**
     * Move all the cloud in the direction of the given v vector
     * 
     * @param v Vector to add to the position
     */
    move(v) {
        this.pos.add(v);
        return this;
    }

    /**
     * Scale all points from the center of the cloud by a factor of s
     * 
     * @param s
     */
    scale(s) {
        for(let p of this.points) {
            p.mult(s);  
        }
        return this;
    }

    /**
     * Rotate all points arround the given axis by a radians
     * 
     * @param a Angle to rotate
     * @param axis Axis to rotate arround
     */
    rotate(a, axis) {
        for(let p of this.points) {
            p.rotate3D(a, axis);
        }
        return this;
    }
}

/**
 * Wireframe class
 * made of points and lines
 */
class Wireframe extends PointCloud {
    /**
     * 
     * @param position Position of the center of the wireframe
     * @param points Position of the points relative to the center 
     * @param lines Pairs of indexes of points making a line
     * @param lnColor Color of the lines
     * @param ptColor Color of the points
     * @param lnThick Thickness of the lines
     * @param ptThick Thickness of the points
     */
    constructor(position, points, lines, lnColor=200, ptColor=230, lnThick=1, ptThick=2) {
        super(position, points, ptColor, ptThick);
        this.lines = lines;
        this.lnColor = color(lnColor);
        this.lnThick = lnThick;
    }
}

/**
 * Object class
 * made of points and polygons
 */
class SolidObj extends PointCloud {
    /**
     * 
     * @param position Position of the center of the object
     * @param points Position of the points relative to the center
     * @param polygons Arrays of indexes of the points making a polygon
     * @param polColor Color of the polygons
     * @param lnColor Color of the lines
     * @param ptColor Color of the points
     * @param lnThick Thickness of the lines
     * @param ptThick Thickness of the points
     */
    constructor(position, points, polygons, 
        polColor=[86, 210, 227, 64], lnColor=200, ptColor=230, lnThick=1, ptThick=2) {
            super(position, points, ptColor, ptThick);
            this.polygons = polygons;
            this.polColor = polColor;
            this.lnColor = lnColor;
            this.lnThick = lnThick;
        }
}