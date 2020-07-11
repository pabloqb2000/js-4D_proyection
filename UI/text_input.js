class TextInput extends UiElement {
    /**
     * 
     * @param maxChars Max number of characters
     * @param text Default text
     */
    constructor(maxChars=20, text="", x=0, y=0, height=20) {
        super(x,y, textWidth("_".repeat(maxChars)) + height, height, false, false);
        this.maxChars = maxChars;
        this.text = text;
        this.focusable = true;
    }

    draw() {
        strokeWeight(1);
        stroke(this.highlighted ? 200 : 230);
        fill(32);
        rect(this.x, this.y, this.width, this.height, this.height/5);

        noStroke();
        fill(this.highlighted ? 200 : 230);
        textSize(this.height/2);
        textAlign(LEFT);
        text(this.text, this.x + this.height/4, this.y + this.height*0.7);

        // Draw cursor bar
        if(this.focused && millis() % 1000 < 500) {
            let x = this.x + this.height/4 + textWidth(this.text) + 2;
            stroke(this.highlighted ? 200 : 230);            
            line(x, this.y + 5, x, this.y + this.height - 5);
        }
    }

    keyPressed() {
        switch(keyCode) {
            case (8): // Backspace
                this.text = this.text.substr(0, this.text.length - 1);
                break;
            case(13): // Enter
                this.focused = false;
                break;
        }
    }

    keyTyped() {
        if(this.text.length < this.maxChars) {
            this.text = this.text + key;
        }
    }
}