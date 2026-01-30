let brushSize = 10;
// brush opacity in percentage (%) 
// 0 = transparent, 255 = complete solid
let brushOpacity = 255;
const COLOURS = Object.freeze({
    BLACK: "#000000",
    WHITE: "#FFFFFF",
    RED: "#FF0000",
    GREEN: "#00FF00",
    BLUE: "#0000FF",
    YELLOW: "#FFFF00",
    CYAN: "#00FFFF",
    MAGENTA: "#FF00FF",
    GRAY: "#808080",
    ORANGE: "#FFA500",
});
let brushColour;
let currentColourName = "BLACK";
const BRUSH_TYPES = Object.freeze({
    PEN: "pen",
    SCRIBBLE: "scribble",
    PENCIL: "pencil",
    ERASER: "eraser",
});
let brushtype = BRUSH_TYPES.PEN;
const BG_COLOUR = 220;
const FIRST_LINE_Y = 20;
const LINE_SPACING = 20;
const MAX_ALPHA = 255;

function setup() {
    createCanvas(800, 600);
    background(BG_COLOUR);
    brushColour = color(COLOURS.BLACK);
}

function draw() {
    drawUI();
    if (mouseIsPressed) {
        switch(brushtype) {
            // pen
            case "pen": penStroke(); break;
            // scribble
            case "scribble": scribbleStroke(); break;
            // eraser
            case "eraser": eraserStroke(); break;
        }
    }
    pressedAndHold();
}

function penStroke() {
    stroke(brushColour);
    strokeWeight(brushSize);
    line(pmouseX, pmouseY, mouseX, mouseY); 
}

function scribbleStroke() {
  // Define how much the pen "shakes"
  let intensity = brushSize * 0.2; 

  // Add a random offset to the current mouse position
  let nudgeX = random(-intensity, intensity);
  let nudgeY = random(-intensity, intensity);

  stroke(brushColour);
  strokeWeight(brushSize);
  
  // Draw from the previous (nudged) position to the current (nudged) position
  line(pmouseX + nudgeX, pmouseY + nudgeY, mouseX + nudgeX, mouseY + nudgeY);
}

function eraserStroke() {
    stroke(BG_COLOUR);
    strokeWeight(brushSize);
    line(pmouseX, pmouseY, mouseX, mouseY); 
}

function drawUI() {
    push();
    // Refresh the UI Area
    fill(BG_COLOUR - 10);
    noStroke();
    rect(0, 0, 300, 200);
    // Add instructions and current state of tools
    fill(0);
    textSize(12);
    let x = 10;
    let y = FIRST_LINE_Y;
    let opacityPercent = Math.ceil(brushOpacity/MAX_ALPHA * 100);
    text(`Simple Paint v0.1\n`, x, y);
    y += LINE_SPACING;
    text(`[P] Pen [B] Scribble [E] Eraser [C] Clear Canvas`, x, y);
    y += LINE_SPACING;
    text(`[0] to [9]: Change Brush Colour`, x, y);
    y += LINE_SPACING;
    text(`[LEFT] Arrows [RIGHT]: Change Stroke Weight`, x, y);
    y += LINE_SPACING;
    text(`[DOWN] Arrows [UP]: Change Stroke Transparency`, x, y);
    y += LINE_SPACING;
    text(`Brush Type: ${brushtype}`, x, y);
    y += LINE_SPACING;
    text(`Stroke Weight: ${brushSize}`, x, y);
    y += LINE_SPACING;
    text(`Stroke Transparency: ${opacityPercent}%`, x, y);
    y += LINE_SPACING;
    text(`Brush Colour: ${currentColourName}`, x, y);
    pop();
}

function keyPressed() {
    switch(key) {
        // pen
        case 'p': brushtype = BRUSH_TYPES.PEN; break;
        // scribble
        case 'b': brushtype = BRUSH_TYPES.SCRIBBLE; break;
        // eraser
        case 'e': brushtype = BRUSH_TYPES.ERASER; break;
        // clear page
        case 'c': background(BG_COLOUR); break;
        // save image
        case 's': saveImage(); break;
        // brush colour: black
        case '1': setBrushColour(COLOURS.BLACK); break;
        // brush colour: white
        case '2': setBrushColour(COLOURS.WHITE); break;
        // brush colour: red
        case '3': setBrushColour(COLOURS.RED); break;
        // brush colour: green
        case '4': setBrushColour(COLOURS.GREEN); break;
        // brush colour: blue
        case '5': setBrushColour(COLOURS.BLUE); break;
        // brush colour: yellow
        case '6': setBrushColour(COLOURS.YELLOW); break;
        // brush colour: cyan
        case '7': setBrushColour(COLOURS.CYAN); break;
        // brush colour: magenta
        case '8': setBrushColour(COLOURS.MAGENTA); break;
        // brush colour: gray
        case '9': setBrushColour(COLOURS.GRAY); break;
        // brush colour: orange
        case '0': setBrushColour(COLOURS.ORANGE); break;
    }
}

function setBrushColour(hexCode) {
    currentColourName = Object.keys(COLOURS).find(key => COLOURS[key] === hexCode);
    brushColour = color(hexCode);
    brushColour.setAlpha(brushOpacity);
}

function pressedAndHold() {
    if (frameCount % 5 === 0) {
        // decrease stroke weight
        if (keyIsDown(LEFT_ARROW) && brushSize > 1) {
            brushSize--;
        }
        // increase stroke weight
        if (keyIsDown(RIGHT_ARROW)) {
            brushSize++;
        }
        // decrease stroke opacity
        if (keyIsDown(DOWN_ARROW) && brushOpacity > 0) {
            brushOpacity -= MAX_ALPHA/100;
            brushColour.setAlpha(brushOpacity);
        }
        // increase stroke opacity
        if (keyIsDown(UP_ARROW) && brushOpacity < 255) {
            brushOpacity += MAX_ALPHA/100;
            brushColour.setAlpha(brushOpacity);
        }
    }
}

function saveImage() {
    let fileName = prompt("Input file name");

    if (fileName !== null) {
        save(`${fileName}.jpg`);
    }
}