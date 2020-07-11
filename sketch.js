let zoomSld;
let camTypeBtn, drawPtsBtn, drawLnBtn, drawPolBtn, cropBtn, rotBtn;
let objSel;
let scene = []; // Array of visible objects
let cam; // Camera
let objList = {
	"Rot Toroid":genRotToroid,
	"Moebious":  genMoebious,
	"Function":	 genFunc,
	"Cylinder":  genCyl,
	"Toroid": 	 genToroid,
	"Cube":		 genCube,
	"Sphere": 	 genSphere,
};

function setup() {
	textFont("Orbitron");
	createCanvas(windowWidth, windowHeight);
	background(32);

	// Create UI elements
	zoomSld = new Slider(35, 1000, 500, 0,0, width/12, height/60, null, "Zoom");
	let tmp = new UiElement(); // Blank space
	camTypeBtn = new Button(0,0, width/8, height/30, "Perspective", changeCam);
	drawPtsBtn = new ToggleButton(0,0, width/12, height/30, "Points", null, true);
	cropBtn = new ToggleButton(0,0, width/12, height/30, "Crop", null, true);
	drawLnBtn = new ToggleButton(0,0, width/12, height/30, "Lines", null, true);
	rotBtn = new ToggleButton(0,0, width/12, height/30, "Rotate", () => {
		if(rotBtn.active) {
			requestPointerLock();
		} else {
			exitPointerLock();
		}
	}, false);
	drawPolBtn = new ToggleButton(0,0, width/12, height/30, "Polys", null, true);
	objSel = new OptionsBox(Object.keys(objList), height/25, () => {
		scene = [];
		scene.push(objList[objSel.selected]());
	});

	// Start UI
	UI.tableWidth = 2;
	UI.tableHeight = 100;
	UI.distrubute();

	// Start scene objects
	let l = 1, d = 5;
	cam = new PerspectiveCamera(new Vector([d*l,d*l,d*l]), new Vector([PI/4,-3*PI/4,0]));

	// Add a default object to the scene
	scene.push(genRotToroid());
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
}

/**
 * Change the camera type and the text of the button
 */
function changeCam() {
	if(camTypeBtn.text == "Perspective") {
		camTypeBtn.text = "Orthographic";
		cam = new OrthographicCamera(cam.pos, cam.rot);
	} else {
		camTypeBtn.text = "Perspective";
		cam = new PerspectiveCamera(cam.pos, cam.rot);
	}
}