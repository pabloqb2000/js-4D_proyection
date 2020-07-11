function mouseDragged() {
	UI.mouseDragged();
	Drag.mouseDragged();
}

function mousePressed() {
	UI.mousePressed();
	Drag.mousePressed();
}

function mouseClicked() {
    let r = UI.mouseClicked();
	Drag.mouseClicked();
}

function mouseReleased() {
    UI.mouseReleased();
	Drag.mouseReleased();
}

function mouseWheel(event) {
	UI.mouseWheel(event);
}

function keyPressed() {
  UI.keyPressed();
}

function keyTyped() {
	UI.keyTyped();
}

