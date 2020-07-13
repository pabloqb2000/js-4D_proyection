let zoomSld;
let drawPtsBtn, drawLnBtn, drawPolBtn, rotBtn, cropBtn;
let scene = []; // Array of visible objects
let cam; // Camera
let rotation = true, angle = [0, 0.02, 0, 0]; // rotation angle

function setup() {
	textFont("Orbitron");
	createCanvas(windowWidth, windowHeight);
	background(32);

	// Create UI elements
	zoomSld = new Slider(35, 500, 250, 0,0, width/12, height/60, null, "Zoom");
	drawPtsBtn = new ToggleButton(0,0, width/12, height/30, "Points", null, true);
	drawLnBtn = new ToggleButton(0,0, width/12, height/30, "Lines", null, true);
	drawPolBtn = new ToggleButton(0,0, width/12, height/30, "Polys", null, true);
	cropBtn = {active: false};
	rotBtn = new ToggleButton(0,0, width/12, height/30, "Rotate", () => {
		if(rotBtn.active) {
			requestPointerLock();
		} else {
			exitPointerLock();
		}
	}, false);

	// Start UI
	UI.tableWidth = 1;
	UI.tableHeight = 100;
	UI.distrubute();

	// Start scene objects
	let l = 0, d = 0;
	cam = new Perspective4DCamera(new Vector([d, d, 3+d, 3+d]), new Vector([l,l,-l,-l]));//new Vector([PI/4,-3*PI/4,0,0]));

	// Add a default object to the scene
	let t = genTeseract();
	let a = 1;
	rotateObj(t, [a,0,a,0]);
	scene.push(t);
}

function draw() {
	// Draw UI and draggable elements
	background(32);
	UI.update();
	UI.draw();
	
	translate(13/24*width, height/2);
	scale(1,-1);

	// Update the camera position and rotation
	cam.update();
	// Make the camera draw the objects in the scene
	cam.render(scene);

	// Rotate the object if rotation is active
	if(rotation) {
		for(let o of scene) {
			rotateObj(o, angle);
		}
	}

	if(keyIsPressed) {
		if(keyCode >= 49 && keyCode <= 52) { // 1 - 4
			let a = [0,0,0,0];
			a[keyCode - 49] = 0.02;
			for(let o of scene) {
				rotateObj(o, a);
			}
		}
	}
}

/**
 * Rotate the object o
 * 
 * @param o Object to rotate
 * @param a Angles to rotate
 */
function rotateObj(o, a) {
	for(let i = 0; i < o.points.length; i++) {
		let p = o.points[i];
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
		o.points[i] = p;
	}
}