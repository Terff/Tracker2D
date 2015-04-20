/*
 * Not going to be constructed properly for some time.
 * Two sections, for mouse input and keyboard input.
 * What sorts of each should we recognize?
 * We'll also need states for buttons.
 * Long term thoughts: At some point in the near future, we might want to add a synchronization feature to help people create more complicated interlocking
*/

/*
    Short term important stuff: Save, load, copy, paste, general rectangle-based selector.
    Medium term useful thing: Extrapolation feature.
*/

var isOverlayShowing = false; //Used to handle some pointer events CSS.
var pauseState = true;
var toolList = ['pencil', 'line', 'eraser', 'pause', 'selectBox','paste', 'query']; //We can add a bunch more. Use these to label buttons?
var selectedTool = 'pencil'; //Change as needed, default to pencil.
var tileBuffer; //An array representing a rectangle of selected tiles.
var saveContent; //A string representing the contents of the map.
var encodedContent; //Stores the base64 equivalent of saveContent.
var selectBoxCoords = new Array(4); //Stores two coordinate pairs.

var bottomUIButton = function(coords) {
    this.coords = coords;
}

//Deprecate this?
var pauseButton = function(coords) {
    this.coords = coords;
}

//See main.js for the UI images, although maybe we should move that here.
//Extend this to draw all buttons?
var drawButtons = function() {

    //Pause button with 2 states
    if(pauseState == false) { ctx.drawImage(UIImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    else if(pauseState == true) { ctx.drawImage(UIImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }

    ctx.drawImage(UIImages[2],PENCIL_BUTTON_AREA[0],PENCIL_BUTTON_AREA[1]); //Pencil
    ctx.drawImage(UIImages[3],ERASER_BUTTON_AREA[0],ERASER_BUTTON_AREA[1]); //Eraser
    ctx.drawImage(UIImages[6],SELECTBOX_BUTTON_AREA[0],SELECTBOX_BUTTON_AREA[1]); //Box select
    ctx.drawImage(UIImages[7],PASTE_BUTTON_AREA[0],PASTE_BUTTON_AREA[1]); //Paste
    ctx.drawImage(UIImages[8],QUERY_BUTTON_AREA[0],QUERY_BUTTON_AREA[1]); //Query

    //Save and load functions
    ctx.drawImage(UIImages[4],SAVE_BUTTON_AREA[0],SAVE_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[5],LOAD_BUTTON_AREA[0],LOAD_BUTTON_AREA[1]); 
    

}

function fillBuffer(fromX, toX, fromY, toY, command) {
    //Stores a rectangle of tiles (a subset of the entire field). 
    //When saving, it fills up with the entire field. Otherwise, it probably covers a bit less.
    console.log("Filling the buffer");
    switch(command) {
        case 'save':
            tileBuffer = fieldContents;
            //console.log(tileBuffer);
            break;
        case 'selectBox':
            //In this case, tileBuffer has to actually be defined.
            tileBuffer = new Array((toX - fromX) + 1);
            for(var i = 0; i < tileBuffer.length; ++i) {
                tileBuffer[i] = new Array((toY - fromY) + 1);
            }
            //Only then can it be populated properly.
            for(var i = 0; i < tileBuffer.length; ++i){
                for(var j = 0; j < tileBuffer[i].length; ++j){
                    tileBuffer[i][j] = fieldContents[fromX + i][fromY + j];
                }
            }
            console.log(tileBuffer);
            break;
        default:
            break;
    }
}

//toX and toY are derived from the size of tileBuffer.
//TileX and tileY are where the user clicked.
//currentTile is an optional instruction for interpolation, which will be defined later.
function pasteBuffer(fromX, toX, fromY, toY, tileX, tileY, currentTile) {
    //This is an overlap paste that replaces all contents.
    //Maybe we can make a mixpaste later?
    for(var i = 0; i < tileBuffer.length; ++i){
        for(var j = 0; j < tileBuffer[i].length; ++j){
            //Conditional to prevent accidental writes outside the file, which could get crashy.
            //Horizontal overflows cause errors,  but don't break everything. I still consider this a bug.
            if((i + tileX) < FILE_SIZE[0] || (j + tileY) < FILE_SIZE[1]) {
                fieldContents[(i + tileX)][(j + tileY)] = tileBuffer[i][j];
            }
        }
    }
}

//This needs to be extended with more properties and the desired bug (musician) values.
function saveFile() {
    pauseState = true;
    fillBuffer(0, FILE_SIZE[0], 0, FILE_SIZE[1], 'save');
    if(tileBuffer === fieldContents) { 
        console.log("We're ready to save now."); 
    } else { console.log("Something went wrong in saveFile() or fillBuffer(). Real error trapping later."); }
    //Bake everything into a string.
    saveContent = "";
    //console.log(tileBuffer.length);
    //The very first line contains the amount of tiles.
    saveContent += FILE_SIZE[0] + "," + FILE_SIZE[1] + '\n';

    //Dump all tiles to a string. Parses top to bottom before moving left to right.
    for(var i = 0; i < tileBuffer.length; ++i){
        for(var j = 0; j < tileBuffer[i].length; ++j){
            if(tileBuffer[i][j] !== undefined) { 
                saveContent += tileBuffer[i][j].toString();
            } else saveContent += "undefined"; //In the load function, lines with only the word "undefined" on them will not become tiles.
            saveContent += '\n';
        }

    }
    //Dump song properties next.
    saveContent += TEMPO + '\n' + PLAYFIELD_SIZE + '\n' + author + '\n' + songDescription + '\n';
    //Convert the entire thing to base64.
    encodedContent = window.btoa(saveContent);
    $("#saveText").html(encodedContent);
    $("#saveExport").removeClass("currentlyHidden")
    //It will be some time before we can actually get this to a user.
}

function loadFile() {
    pauseState = true;
    closeLoadWindow();
    //We need to implement error trapping at some point.
    encodedContent = $("#loadText").val();
    if(encodedContent !== undefined) {
        encodedContent = window.atob(encodedContent);
    }
    console.log(encodedContent);
    var loadingWorkArray = encodedContent.split("\n");
    var loadDimensions = loadingWorkArray[0].split(",");
    //loadDimensions[0] = parseInt(loadDimensions[0]);
    //loadDimensions[1] = parseInt(loadDimensions[1]);
    
    //console.log(loadDimensions);
    //1 to (max index - 4) for now
    //Input all the tiles. This produces buggy, incorrect output. Fix it!
    for(var i = 0; i < loadDimensions[0]; ++i){
        for(var j = 0; j < loadDimensions[1]; ++j) {
            var currentIndex = (j*loadDimensions[1]) + i; //Flow control seems to be right.

            if(loadingWorkArray[currentIndex + 1] !== "undefined") {
                console.log(j + " , " + i);
                var currentTile = loadingWorkArray[currentIndex + 1].split(",");

                //Let's try this kludge instead.
                /*
                console.log(currentTile[0]);
                currentTile[0] = (currentTile[0])*(44100);
                console.log(currentTile[0]);
                */

                fieldContents[j][i] = new Tile(currentTile[0],currentTile[1],
                                               currentTile[2],currentTile[3],
                                               currentTile[4],currentTile[5],
                                               currentTile[6]);

                console.log(fieldContents[j][i]);
            } else fieldContents[j][i] = undefined;
        }
    }
    //We can still make song properties work. This will require editing in the future.
    TEMPO = loadingWorkArray[loadingWorkArray.length - 5];
    //PLAYFIELD_SIZE = loadingWorkArray[loadingWorkArray.length - 4]; //Dummied out for now because it doesn't matter.
    author = loadingWorkArray[loadingWorkArray.length - 3];
    songDescription = loadingWorkArray[loadingWorkArray.length - 2];
    //We need to add bug parameters to this format. Here's another kludge. Don't you love kludging?
    bug1.x = 80; 
    bug1.y = 24;
    bug1.action = "moveRight";
    bug2.x = 80; 
    bug2.y = 72;
    bug2.action = "moveRight";
}

function closeSaveWindow(){
    setTimeout(function() {$("#saveExport").addClass("currentlyHidden");}, 50);

}

function closeLoadWindow(){
    setTimeout(function() {$("#loadExport").addClass("currentlyHidden");}, 50);
}