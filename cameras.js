/**
 * Abstract camera class
 * Contains the definitions of some functions for all cameras
 */
class AbstractCamera {
    /**
     * @param position Initial position of the camera
     * @param rotation Initial rotation of the camera
     */
    constructor(position, rotation) {
        this.pos = position;
        this.rot = rotation;
        this.axis = this.getAxis();

        this.moveSpeed = 0.1;
        this.rotSpeed = 0.002;
    }

    /**
     * Returns a list of wireframe objects
     * One object for each axis
     */
    getAxis() {
        return  [
            new Wireframe(new Vector([0,0,0]), [new Vector([0,0,0]), new Vector([1,0,0])], [[0,1]], [86, 210, 227]),
            new Wireframe(new Vector([0,0,0]), [new Vector([0,0,0]), new Vector([0,1,0])], [[0,1]], [105, 227, 86]),
            new Wireframe(new Vector([0,0,0]), [new Vector([0,0,0]), new Vector([0,0,1])], [[0,1]], [227, 103, 86])
        ];
    }

    /**
     * First render the axis and then render the given array of objects
     * 
     * @param objects Array of objects to render
     */
    render(objects) {
        // Axis
        for(let a of this.axis) {
            this.draw(a);
        }

        // Objects
        for(let o of objects) {
            this.draw(o);
        }
    }

    /**
     * Gets the projection of the points of the given object
     * and draws the given object
     * 
     * @param obj 
     */
    draw(obj) {
        // Get projections
        let projs = obj.points.map(p => this.transform(p, obj));

        // Draw points
        if(drawPtsBtn.active) {
            strokeWeight(obj.ptThick);
            stroke(obj.ptColor);

            for(let p of projs) {
                point(p.getX(), p.getY());
            }
        }

        // Draw wireframes
        if(obj instanceof Wireframe && drawLnBtn.active) {
            strokeWeight(obj.lnThick);
            stroke(obj.lnColor);

            for(let l of obj.lines) {
                let p1 = projs[l[0]];
                let p2 = projs[l[1]];
                line(p1.getX(), p1.getY(), p2.getX(), p2.getY());
            }
        }

        // Draw solid objects
        if(obj instanceof SolidObj) {
            if(drawLnBtn.active) {
                strokeWeight(obj.lnThick);
                stroke(obj.lnColor);
            } else {
                noStroke();
            }
            if(drawPolBtn.active) {
                fill(obj.polColor);
            } else {
                noFill();
            }

            for(let p of obj.polygons) {
                beginShape();
                for(let i of p) {
                    vertex(projs[i].getX(), projs[i].getY());
                }
                endShape(CLOSE);
            }
        }
    }
    
    /**
     * Transforms the given p point acording to the position and rotation of this camera
     * and finally calls project() to project this point to 2D
     * 
     * @param p Point to transform
     * @param obj Object the point belongs to
     */
    transform(p, obj) {
        // Transform the point to have coordinates relative to this camera 
        let v = p.copy().add(obj.pos).sub(this.pos);
        // Rotate the object acording to the rotation of this camera
        v = this.rotateToView(v);
        // Crop the points behind the camera
        if(cropBtn.active) {
            v = this.crop(v);
        }
        // Project the point
        return this.project(v);
    }

    /**
     * Update position and rotation based on user input
     */
    update() {
        // Create 3 axis in the direction the camera is pointing towards
        let u = (new Vector([1,0,0])).mult(this.moveSpeed);
        //let v = (new Vector([0,1,0])).mult(this.moveSpeed); (this one is not used)
        let w = (new Vector([0,0,1])).mult(this.moveSpeed);

        u = u.rotate3D(this.rot.getX(), 0).rotate3D(this.rot.getY(), 1).rotate3D(this.rot.getZ(), 2);
        //v = v.rotate3D(this.rot.getX(), 0).rotate3D(this.rot.getY(), 1).rotate3D(this.rot.getZ(), 2);
        w = w.rotate3D(this.rot.getX(), 0).rotate3D(this.rot.getY(), 1).rotate3D(this.rot.getZ(), 2);

        // Remove their y component to make the player stay at the same height
        u.set(1,0).normalize();
        w.set(1,0).normalize();

        // Move
        if(keyIsDown(87)) cam.pos.add(w.mult(this.moveSpeed)); // W
        if(keyIsDown(83)) cam.pos.sub(w.mult(this.moveSpeed)); // S
        if(keyIsDown(65)) cam.pos.sub(u.mult(this.moveSpeed)); // A
        if(keyIsDown(68)) cam.pos.add(u.mult(this.moveSpeed)); // D
        if(keyIsDown(32)) cam.pos.add(new Vector([0,this.moveSpeed,0])); // SPACE
        if(keyIsDown(16)) cam.pos.sub(new Vector([0,this.moveSpeed/2,0])); // SHIFT

        // Rotate
        if(keyIsDown(37)) cam.rot.data[2] += this.moveSpeed/2; // LEFT ARROW
        if(keyIsDown(39)) cam.rot.data[2] -= this.moveSpeed/2; // RIGHT ARROW
        if(rotBtn.active) {
            this.rot.data[1] += (movedX * this.rotSpeed) % (2*PI);
            this.rot.data[0] = min(max(-PI/2, this.rot.data[0] + movedY*this.rotSpeed), PI/2);
        }
    }

    /**
     * Rotate the objects that are going to be projected 
     * acording to the rotation of this camera 
     * 
     * @param v Vector to rotate
     */
    rotateToView(v){
        return v.rotate3D(-this.rot.getZ(), 2).rotate3D(-this.rot.getY(), 1).rotate3D(-this.rot.getX(), 0);
    }

    /**
     * If the given vector is behind the camera
     * (if it has a negative z value)
     * sets its coordinates to NaN so that the point
     * is not drawn
     * 
     * @param v 
     */
    crop(v) {
        if(v.getZ() < 0) {
            v.map(() => NaN);
        }
        return v;
    }
}

/**
 * Orthographic camera class
 * projects the objects ignoring their Z coordinate
 * this gives the effect of a parallel projection
 */
class OrthographicCamera extends AbstractCamera {
    /**
     * projects the point with this cameras projection type
     * 
     * @param p Point to be projected 
     */
    project(p) {
        let z = zoomSld.value/10;
        return (new Vector([p.getX(), p.getY()])).mult(z);
    }
}

/**
 * Perspective camera class
 * projects the objects appling perspective
 */
class PerspectiveCamera extends AbstractCamera {
    /**
     * projects the point with this cameras projection type
     * 
     * @param p Point to be projected 
     */
    project(p) {
        let z = zoomSld.value;
        return (new Vector([p.getX(), p.getY()])).mult(z/p.getZ());
    }
}

/**
 * Abscract camera using 4D vectors
 */
class Perspective4DCamera extends PerspectiveCamera {
    /**
     * @param position Initial 4D position of the camera
     * @param rotation Initial 4D rotation of the camera
     */
    constructor(position, rotation) {
        super(position, rotation);
    }

    /**
     * Returns a list of wireframe objects
     * One object for each axis
     * (now axis are 4D and there are 4 axis)
     */
    getAxis() {
        return  [
            new Wireframe(new Vector([0,0,0,0]), [new Vector([0,0,0,0]), new Vector([1,0,0,0])], [[0,1]], [86, 210, 227]),
            new Wireframe(new Vector([0,0,0,0]), [new Vector([0,0,0,0]), new Vector([0,1,0,0])], [[0,1]], [105, 227, 86]),
            new Wireframe(new Vector([0,0,0,0]), [new Vector([0,0,0,0]), new Vector([0,0,1,0])], [[0,1]], [227, 103, 86]),
            new Wireframe(new Vector([0,0,0,0]), [new Vector([0,0,0,0]), new Vector([0,0,0,1])], [[0,1]], [200, 200, 200])
        ];
    }

    /**
     * If the given vector is behind the camera
     * (if it has a negative z value of negative U value)
     * sets its coordinates to NaN so that the point
     * is not drawn
     * 
     * @param v 
     */
    crop(v) {
        if(v.getU() < 0) {
            v.map(() => NaN);
            return v;
        } else {
            return super.crop(v);
        }
    }

    /**
     * Rotates the given vector acording to the actual rotation of the camera
     * Since both the cameras rotation and the vector are 4D
     * quaternions are used to rotate the vector
     * 
     * @param v Vector to be rotated
     */
    rotateToView(v) {
        let q1, q2;
        let p = v.copy();
        let a = this.rot.data;

        //1st Axis
        q1 = new Vector([cos(a[0] / 2), sin(a[0] / 2), 0, 0]);
        q2 = new Vector([cos(a[0] / 2), sin(a[0] / 2), 0, 0]);
        p = Vector.QuatRot(q1, p, q2);
        //2nd Axis
        q1 = new Vector([cos( a[1] / 2), sin( a[1] / 2), 0, 0]);
        q2 = new Vector([cos(-a[1] / 2), sin(-a[1] / 2), 0, 0]);
        p = Vector.QuatRot(q1, p, q2);
        //3rd Axis
        q1 = new Vector([cos( a[2] / 2), 0, sin( a[2] / 2), 0]);
        q2 = new Vector([cos(-a[2] / 2), 0, sin(-a[2] / 2), 0]);
        p = Vector.QuatRot(q1, p, q2);
        //4th Axis
        q1 = new Vector([cos( a[3] / 2), 0, 0, sin( a[3] / 2)]);
        q2 = new Vector([cos(-a[3] / 2), 0, 0, sin(-a[3] / 2)]);
        p = Vector.QuatRot(q1, p, q2);

        return p;
    }

    /**
     * Projects the point from 4D to 3D
     * and then call the super class projection method
     * to project from 3D to 2D
     * 
     * @param p 4D point to be projected 
     */
    project(p) {
        return super.project(new Vector([p.getX(), p.getY(), p.getZ()]).div(p.getU()));
    }

    /**
     * Update the cameras positon and rotation depending on the users input
     */
    update() {
        // Move
        if(keyIsDown(87)) cam.pos.add(new Vector([0,0,this.moveSpeed,0])); // W
        if(keyIsDown(83)) cam.pos.sub(new Vector([0,0,this.moveSpeed,0])); // S
        if(keyIsDown(65)) cam.pos.sub(new Vector([this.moveSpeed,0,0,0])); // A
        if(keyIsDown(68)) cam.pos.add(new Vector([this.moveSpeed,0,0,0])); // D
        if(keyIsDown(32)) cam.pos.add(new Vector([0,this.moveSpeed,0,0])); // SPACE
        if(keyIsDown(16)) cam.pos.sub(new Vector([0,this.moveSpeed,0,0])); // SHIFT
        if(keyIsDown(81)) cam.pos.add(new Vector([0,0,0,this.moveSpeed])); // Q
        if(keyIsDown(69)) cam.pos.sub(new Vector([0,0,0,this.moveSpeed])); // E

        // Rotate
        if(keyIsDown(37)) cam.rot.data[0] += this.moveSpeed/2; // LEFT ARROW
        if(keyIsDown(39)) cam.rot.data[0] -= this.moveSpeed/2; // RIGHT ARROW
        if(keyIsDown(38)) cam.rot.data[3] += this.moveSpeed/2; // UP ARROW
        if(keyIsDown(40)) cam.rot.data[3] -= this.moveSpeed/2; // DOWN ARROW
        if(rotBtn.active) {
            this.rot.data[1] += (movedX * this.rotSpeed) % (2*PI);
            this.rot.data[2] += (movedY * this.rotSpeed) % (2*PI);
        }
    }
}