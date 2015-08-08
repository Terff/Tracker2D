/*
 * This is likely to be the most complicated file in Tracker2D, since it contains a wide variety of functions.
 * Long term thoughts: At some point in the near future, we might want to add a synchronization feature to help people create more complicated interlocking
 * See this for advice on how to get click and drag: http://simonsarris.com/blog/140-canvas-moving-selectable-shapes
*/

var isOverlayShowing = false; //Used to handle some pointer events CSS.
var pauseState = true;
var pasteStyle = 1; //1 is an overwrite paste, 2 is mixpaste. Stored in localStorage.

//Labels for all tools that require clicking on the field. Not in use yet except as a reference.
//singleStep will eventually be implemented and will advance time by a single tick every time it's clicked.
var toolList = ['pencil', 'line', 'eraser', 'pause', 'selectBox','paste', 'query', 'moveBug','storeBug','turnBug','singleStep','modifyTile','arrowPen', 'extrapolate']; 
var selectedTool = 'pencil'; //Change as needed, default to pencil.
var saveContent; //A string representing the contents of the map.
var selectBoxCoords = new Array(4); //Stores two coordinate pairs.
var fieldOffset = [0,0] //Changed via interaction with the minimap, used to decide which part of the field's showing.

var storedBugPositions = new Array(40); //Stores 8 quintuples, representing bug coordinates, commands, and storage status.
var numberOfPropertiesSaved = storedBugPositions.length + AMOUNT_OF_SONG_PROPERTIES; //Simplifies some saveload logic
var renderMinimap = true; //The minimap should not be updated until a file is finished loading.
var loadedTiles; //Used for reversion.

var TileBuffer = function(fromX, toX, fromY, toY) {
    if(fromX === undefined){ this.fromX = 0; } else { this.fromX = fromX; }
    if(fromX === undefined){ this.fromY = 0; } else { this.fromY = fromY; }
    if(toX === undefined){ this.toX = fieldContents.length; } else { this.toX = toX; }
    if(toY === undefined){ this.toY = fieldContents[0].length; } else { this.toY = toY; }
    this.array = new Array((toX - fromX) + 1);
    for(var i = 0; i < this.array.length; ++i) {
            this.array[i] = new Array((toY - fromY) + 1);
    }

}

TileBuffer.prototype.fillBuffer = function(fromX, toX, fromY, toY, fillCommand) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    //Stores a rectangle of tiles (a subset of the entire field). 
    //When saving, it fills up with the entire field. Otherwise, it probably covers a bit less.
    console.log("Filling the buffer");
    switch(fillCommand) {
        case 'save':
            this.array = fieldContents;
            break;
        case 'selectBox':
            //In this case, tileBuffer has to actually be defined.
            this.array = new Array((toX - fromX) + 1);
            for(var i = 0; i < this.array.length; ++i) {
                this.array[i] = new Array((toY - fromY) + 1);
            }
            //Only then can it be populated properly.
            for(var i = 0; i < this.array.length; ++i){
                for(var j = 0; j < this.array[i].length; ++j){
                    this.array[i][j] = fieldContents[fromX + i][fromY + j];
                }
            }
            //console.log(this.array);
            break;
        default:
            break;
    }
}

//toX and toY are derived from the size of tileBuffer. TileX and tileY are where the user clicked.
//I expect I may add more paste styles in the future, so this uses a switch statement.
TileBuffer.prototype.pasteBuffer = function(fromX, toX, fromY, toY, tileX, tileY) {
    //This handles multiple paste styles.
    for(var i = 0; i < defaultBuffer.array.length; ++i){
        for(var j = 0; j < defaultBuffer.array[i].length; ++j){
            //Conditional to prevent accidental writes outside the file, which could get crashy.
            //Horizontal overflows cause errors,  but don't break everything. I still consider this a bug.
            //tileX and tileY store offsets.
            if((i + tileX) < FILE_SIZE[0] || (j + tileY) < FILE_SIZE[1]) {
                switch(pasteStyle){
                    case 1: // Simplistic overwrite paste.
                        if(defaultBuffer.array[i][j] !== undefined){
                            fieldContents[(i + tileX)][(j + tileY)] = jQuery.extend(true, {}, defaultBuffer.array[i][j]);
                        } else { fieldContents[(i + tileX)][(j + tileY)] = undefined; } //Required for proper whitespace behavior
                        break; 
                    case 2: // More complicated mixpaste that doesn't overwrite occupied tiles at all.
                        if(defaultBuffer.array[i][j] !== undefined){
                            if(fieldContents[(i + tileX)][(j + tileY)] === undefined){
                                fieldContents[(i + tileX)][(j + tileY)] = jQuery.extend(true, {}, defaultBuffer.array[i][j]);
                            } else break;
                        }
                        break;
                    case 3: // If I can find a way to convey what it does well, I might bring back this reference paste.
                        //fieldContents[(i + tileX)][(j + tileY)] = defaultBuffer.array[i][j];
                        break;
                } 
            }
        }
    }
}

TileBuffer.prototype.transformBuffer = function(transformCommand){
    //Initialize by updating the buffer with our current contents; break if this does nothing.
    //Needs special code to handle non-square arrays. 
    defaultBuffer.fillBuffer(selectBoxCoords[0],selectBoxCoords[1],selectBoxCoords[2],selectBoxCoords[3],'selectBox');
    if(defaultBuffer.array === undefined) { 
        console.log("It's empty");
        return;
    } else {
        var transformContents = new Array(defaultBuffer.array.length);
        for(var i = 0; i < transformContents.length; ++i) {
            transformContents[i] = new Array(defaultBuffer.array[i].length);
        }
        //Then transform the array.
        switch(transformCommand){
            case "horizontalFlip":
                for(var i = 0; i < defaultBuffer.array.length; ++i){
                    for(var j = 0; j < defaultBuffer.array[i].length; ++j){
                        transformContents[i][j] = defaultBuffer.array[(defaultBuffer.array.length - i) - 1][j]
                    }
                }
                break;
            case "verticalFlip":
                for(var i = 0; i < defaultBuffer.array.length; ++i){
                    for(var j = 0; j < defaultBuffer.array[i].length; ++j){
                        transformContents[i][j] = defaultBuffer.array[i][(defaultBuffer.array[i].length - j) - 1]
                    }
                }
                break;
            //This freaks out for rectangles taller than they are wide!
            case "rotateRight":
                //alert("Not implemented yet");
                //Diagonally mirror, then reverse rows like horizontalFlip.
                for(var i = 0; i < defaultBuffer.array.length; ++i){
                    for(var j = 0; j < defaultBuffer.array[i].length; ++j){
                        transformContents[j][i] = defaultBuffer.array[i][j]; //Diagonal mirroring; step one?
                    }
                }
                //Then change the select buffer accordingly.
                /*
                for(var i = 0; i < defaultBuffer.array.length; ++i){
                    for(var j = 0; j < defaultBuffer.array[i].length; ++j){
                        transformContents[i][j] = defaultBuffer.array[(defaultBuffer.array.length - i) - 1][j]
                    }
                }
                */
                
            
                break;
            case "rotateLeft":
                alert("Not implemented yet");
                //You know, this COULD be kludged by calling rotateRight three times...
                break;            

            default:
                break;
        }
        //console.log(transformContents);
        //Then paste it onto the field. Perhaps this should be an .extend paste?
        defaultBuffer.array = transformContents;
        //This should be implicitly an overwrite at the same place we started.
        pasteStyle = 1;
        defaultBuffer.pasteBuffer(this.fromX, this.fromY, this.toX, this.toY, this.fromX, this.fromY);
        //When we rotate, though, we need to change the dimensions of the transform buffer.
        //The first rotation works, but without this, the user would have to manually resize their selection
        //after each rotation to prevent data loss or mangling.
        switch(transformCommand){
            case "rotateRight":
                break;
            case "rotateLeft":
                break;
            default: 
                break;
        }
    }
}

//Prettyprints some data to the queryInfo div, which should only show up when the query tool's selected.
function respondToQuery(X, Y) {
    var queryResponse = "";
    //Starting with the coordinates...
    queryResponse += "<p>Tile Coordinates: " + X + " , " + Y + "</p>";
    if(fieldContents[X][Y] !== undefined) {
        //We iterate through the tile properties.
        if(fieldContents[X][Y].note !== undefined ) { queryResponse += "<p>Pitch: " + Math.floor(fieldContents[X][Y].note * 44100) + " (Note #" + pitchTable.indexOf(fieldContents[X][Y].note) + ")";}
        else { queryResponse += "Does not reference a pitch."; }
        queryResponse += "<p> Instrument: " +  soundSet[fieldContents[X][Y].instrument][0] + "</p>";
        queryResponse += "<p> Audio Effect: " +  fieldContents[X][Y].dspEffect + "</p>";
        queryResponse += "<p> Audio Effect Value: " +  fieldContents[X][Y].dspValue + "</p>";        
        queryResponse += "<p> Flow Effect: " +  fieldContents[X][Y].flowEffect + "</p>";
        queryResponse += "<p> Flow Effect Value: " +  fieldContents[X][Y].flowValue + "</p>"; //Uncomment when relevant.
        queryResponse += "<p> Volume: " + (fieldContents[X][Y].volume * 100) + "%</p>";
        queryResponse += "<p> Points to this tile: " + fieldContents[X][Y].xPointer + " , " + fieldContents[X][Y].yPointer + "</p>";
    } else queryResponse += "No data in this tile.";
    //If there's a bug here, describe the one on top. This assumes that bugs should be allowed to overlap...
    for(var i = 0; i < bugList.length; ++i){
        //console.log(bugList[i].bugTile[0] + " , " + bugList[i].bugTile[1]);
        //console.log(X + " , " + Y);
        if( (bugList[i].bugTile[0]) === X && 
             bugList[i].bugTile[1] === Y) { 
            queryResponse += "<p>Bug name: " + bugList[i].name + "<p>";
            queryResponse += "<p>Current behavior: " + bugList[i].action + "<p>";
            if(bugList[i].inStorage === true) {
                queryResponse += "<p>This bug is in storage.</p>";
            }
            queryResponse += "<p>This bug plays notes at " + bugList[i].volume + "% of their volume. </p>";
            break;
        }
    }

    //We may want to call the playSound routine on this tile.
    $('#queryInfo').html(queryResponse);
}

//Under constant extension. I think I fixed the pointer saving bug, but send me a message if I didn't.
function saveFile() {
    pauseState = true;
    storeBugPositions(); //This may or may not be a useful addition.
    defaultBuffer.fillBuffer(0, FILE_SIZE[0], 0, FILE_SIZE[1], 'save');
    selectBoxCoords = [0,0,0,0]; //Clear the selection to prevent a pastebug.
    if(defaultBuffer.array === fieldContents) { 
        //console.log("We're ready to save now."); 
    } else { console.log("Something went wrong in saveFile() or fillBuffer(). Real error trapping later."); }
    //Put our latest revision in the revert buffer, too.
    loadedTiles = jQuery.extend(true, {}, fieldContents);
    //Bake everything into a string.
    saveContent = "";
    //console.log(tileBuffer.length);
    //The very first line contains the amount of tiles.
    saveContent += FILE_SIZE[0] + "," + FILE_SIZE[1] + '\n';
    //Dump all tiles to a string. Parses top to bottom before moving left to right.
    for(var i = 0; i < defaultBuffer.array.length; ++i){
        for(var j = 0; j < defaultBuffer.array[i].length; ++j){
            if(defaultBuffer.array[i][j] !== undefined) { 
                saveContent += defaultBuffer.array[i][j].toString();
            } else saveContent += "undefined"; //In the load function, lines with only the word "undefined" on them will not become tiles.
            saveContent += '\n';
        }

    }
    //Dump the bug properties! Extends the file by 40 (8 * the amount of bug properties) lines.
    for(var i = 0; i < storedBugPositions.length; ++i) {
        saveContent += storedBugPositions[i] + '\n';
    }

    //Dump song properties next.
    saveContent += TEMPO + '\n' + PLAYFIELD_SIZE + '\n' + author + '\n' + songDescription + '\n' + songTitle;
    var encodeToFile = new Blob([saveContent]); 
    saveAs(encodeToFile, songTitle + ".txt");
}

function loadFile(evt) {
    pauseState = true;
    renderMinimap = false;
    hideUI();
    //We need to implement error trapping at some point.
    var file = evt.target.files[0];
    //Only parse if valid. For now, this just means if the file is a file at all.
    if(file){
        var reader = new FileReader();
        reader.onload = function(e) { 
            var fileContents = e.target.result;
            saveContent = fileContents;
            //Actual save parsing begins here.
            var loadingWorkArray = saveContent.split("\n");
            var loadDimensions = loadingWorkArray[0].split(",");
            var tileLength = loadDimensions[0]*loadDimensions[1];
            FILE_SIZE = [loadDimensions[0],loadDimensions[1]];
            //Kludge.
            PLAYFIELD_SIZE = loadDimensions[0]/64; 
            resizeFile();

            //From the first indice to the index of tileLength.
            //Dump the tiles to fieldContents.
            for(var i = 0; i < loadDimensions[0]; ++i){
                for(var j = 0; j < loadDimensions[1]; ++j) {
                    var currentIndex = (j*loadDimensions[1]) + i;

                    //console.log(loadingWorkArray[currentIndex + 1]); //Always a string.
                    /*
                    if(loadingWorkArray[currentIndex + 1] === "undefined"){
                        fieldContents[j][i] = undefined;
                    } else if(loadingWorkArray[currentIndex + 1] !== "undefined") {
                    */
                    //Kludgetastic.
                    var currentTile = loadingWorkArray[currentIndex + 1].split(",");
                    if(isNaN(currentTile[0]) === true){
                        fieldContents[j][i] = undefined;
                    } else if(isNaN(currentTile[0]) === false){
                        fieldContents[j][i] = new Tile(currentTile[0],currentTile[1],
                                                   currentTile[2],currentTile[3],
                                                   currentTile[4],currentTile[5],
                                                   currentTile[6],undefined,
                                                   currentTile[7],currentTile[8]);
                    }
                    //console.log(fieldContents[j][i]);
                    //}
                }
            }
            //Load bug properties. There's a serious offset here; might need tweaking.
            //Eventually, it might be a good idea to put all bug properties on one line.
            for(var i = 0; i < (loadingWorkArray.length - tileLength - AMOUNT_OF_SONG_PROPERTIES - 4); i+=5){
                //console.log(loadingWorkArray[i + tileLength + 1]);
                bugList[(i/5)].bugTile[0] = $.parseJSON(loadingWorkArray[i + tileLength + 1]);
                bugList[(i/5)].bugTile[1] = $.parseJSON(loadingWorkArray[i + tileLength + 2]);
                bugList[(i/5)].action = loadingWorkArray[i + tileLength + 3];
                bugList[(i/5)].inStorage = $.parseJSON(loadingWorkArray[i + tileLength + 4]);
                bugList[(i/5)].volume = $.parseJSON(loadingWorkArray[i + tileLength + 5]);
                console.log(bugList[i/5]);
            }
            //Run the obligatory bug checking loop and store the loaded bug positions in the buffer.
            for(var i = 0; i < bugList.length; ++i) {
                checkBug(i);
            }
            storeBugPositions();
            restoreBugPositions(true); //The program will pause automatically when the bugs have been restored to their positions.
            //Song properties are stored at the very end of the file.
            TEMPO = loadingWorkArray[loadingWorkArray.length - 5];
            updateFrequency = TICK_MULTIPLIER/TEMPO; //Important that we derive this value.
            $("#tempoSpinner").attr('value', TEMPO);
            console.log($("#tempoSpinner"));
            PLAYFIELD_SIZE = loadingWorkArray[loadingWorkArray.length - 4];
            $("#fieldSizeSpinner").val = PLAYFIELD_SIZE*64;
            author = loadingWorkArray[loadingWorkArray.length - 3];
            songDescription = loadingWorkArray[loadingWorkArray.length - 2];
            songTitle = loadingWorkArray[loadingWorkArray.length - 1];
            loadedTiles = jQuery.extend(true, {}, fieldContents);
        }

        reader.readAsText(file);
        renderMinimap = true;
    } else {
        alert("File load failed for some reason. This messsage also displays if you exit out of the loading dialog manually.");
        renderMinimap = true;
        return;
    }
}

//General UI handling function called whenever the user opens up a UI element through Canvas.
//The timeouts prevent clicks from bleeding through to other elements.
function hideUI(){
    if($("#saveExport").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#saveExport").addClass("currentlyHidden");}, 50);
    }
    if($("#loadExport").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#loadExport").addClass("currentlyHidden");}, 50);
    }
    if($("#modifySongProperties").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#modifySongProperties").addClass("currentlyHidden");}, 50);
    }
    if($("#modifyTile").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#modifyTile").addClass("currentlyHidden");}, 50);
    }
    if($("#helpPage").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#helpPage").addClass("currentlyHidden");}, 50);
    }
    if($("#queryInfo").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#queryInfo").addClass("currentlyHidden");}, 50);
    }     
    if($("#modifyBugProperties").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#modifyBugProperties").addClass("currentlyHidden");}, 50);
    }     
    if($("#modifyUIProperties").hasClass("currentlyHidden") === false) { 
        setTimeout(function() {$("#modifyUIProperties").addClass("currentlyHidden");}, 50);
        //Some UI properties need to be saved to localStorage when we close this.
        if($('#extrapolatePitch').is(':checked')){
            localStorage.extrapolateStyle = "note";
        } else if($('#extrapolateVolume').is(':checked')){
            localStorage.extrapolateStyle = "volume";
        } else if($('#extrapolateFXValue').is(':checked')){
            localStorage.extrapolateStyle = "dspValue";
        }
        if($('#samplePlayback').prop('checked') === true ) {
            localStorage.samplePlayback = "true";
        } else if($('#samplePlayback').prop('checked') === false ){ 
            localStorage.samplePlayback = "false"; 
        }
    }

}

//checkBug and getBug need to be merged properly?
//This one just checks the status of the bug without altering it.
function checkBug(bugVal){
    var getBugHTML = "";
    var storageClass = "#bugStorageUnit" + (bugVal + 1);
    if(bugList[bugVal].inStorage === false && bugList[bugVal] !== undefined) {
        $(storageClass).html('<button type="button" onclick="getBug('+ bugVal + ',true)">' + (bugVal + 1) +'</button>');
    } else if(bugList[bugVal].inStorage === true) {
        getBugHTML = '<button type="button" onclick="getBug(' + bugVal + ')">' + bugList[bugVal].image.outerHTML + '</button>';
        $(storageClass).html(getBugHTML);
    }
}

function getBug(bugVal, edit){
    if(edit !== true && edit !== false){ edit = false; } //Error trapping.
    var getBugHTML = '<button type="button" onclick="getBug(' + bugVal + ',true)">' + bugList[bugVal].image.outerHTML + '</button>';
    var storageClass = "#bugStorageUnit" + (bugVal + 1);
    if(bugList[bugVal].inStorage === false && bugList[bugVal] !== undefined) {
        if(edit === true){
            bugList[bugVal].inStorage = true;
            //getBugHTML = '<button type="button" onclick="getBug(' + bugVal + ',true)">' + bugList[bugVal].image.outerHTML + '</button>';
            //console.log(getBugHTML);
            moveToStorage(bugVal);
        } else if (edit === false) { moveFromStorage(bugVal); }

    } else if(bugList[bugVal].inStorage === true) {
        if(edit === true){
            bugList[bugVal].inStorage = false;
            moveFromStorage(bugVal);
        } else if (edit === false) { moveToStorage(bugVal); }
    }
    //Local functions that should only be called within getBug.
    //These don't need to be functions, but it seems to improve readability.
    function moveToStorage(bugVal){
        $(storageClass).html(getBugHTML);
    }

    function moveFromStorage(bugVal){
        $(storageClass).html('<button type="button" onclick="getBug('+ bugVal + ',true)">' + (bugVal + 1) +'</button>');
    }
}

function storeBugPositions() {
    pauseState = true;
    for(var i = 0; i < storedBugPositions.length; i+=5){
        storedBugPositions[i] = bugList[(i/5)].bugTile[0];
        storedBugPositions[i+1] = bugList[(i/5)].bugTile[1];
        storedBugPositions[i+2] = bugList[(i/5)].action;
        storedBugPositions[i+3] = bugList[(i/5)].inStorage;
        storedBugPositions[i+4] = bugList[(i/5)].volume;
    }
}

function restoreBugPositions(pauseOnRestore) {
    //We only want to pause if the calling function requests it. 
    console.log(pauseOnRestore);
    if(pauseOnRestore !== true) {  
        pauseState = false;
    } else if(pauseOnRestore === true){ pauseState = true; }
    //Generalize the second part of this condition... somehow.
    if(storedBugPositions === [] || storedBugPositions.length !== 40) {
        console.log("Sorry, an error occured in the data storing bug positions; see the browser console for details.");
        console.log(storedBugPositions);
        return;
    } else {
        for(var i = 0; i < storedBugPositions.length; i+=5){
            //This is literally the opposite of what we do in storeBugPositions().
            bugList[(i/5)].bugTile[0] = storedBugPositions[i];
            bugList[(i/5)].bugTile[1] = storedBugPositions[i+1];
            bugList[(i/5)].action = storedBugPositions[i+2];
            bugList[(i/5)].inStorage = storedBugPositions[i+3];
            bugList[(i/5)].volume = storedBugPositions[i+4];
        }
        for(var i = 0; i < bugList.length; ++i) {
            getBug(i,false);
        }
        //Inform the timer as well. This should be incorporated into a more general reset function.
        elapsedTime = 0;
        $("#elapsedTime").html(elapsedTime);
    }
}

//Takes input from the volume slider.
function updateInputVolume(volumeNumber) {
    $("#currentInputVolume").html(volumeNumber); //Adjusts the value.
    currentVolume = volumeNumber/100;
}

//Switches between overwrite and mixpaste. 
function changePasteStyle() {
    if(pasteStyle === 1) {
        pasteStyle = 2;
        $("#selectPasteStyle").html("Change from Mix to Overwrite");
    } else if(pasteStyle === 2 || null){
        pasteStyle = 1;
        $("#selectPasteStyle").html("Change from Overwrite to Mix");
    }
    localStorage.pasteStyle = pasteStyle;
}

//Initializes everything, but only responds if the soundSet is loaded. Move to main.js?
function loadIfReady(){
    if(soundsAreReady.called) { init(); }
    //Otherwise, inform the user somehow. We can't use alert because it breaks the load routine..
}

function estimateSongLength(){
    console.log("Not implemented yet");
    /*
    This should only attempt to estimate the song's length if there are definite end conditions.
    For now, this means either a freeze or revert tile is on the field.
    Two ways to go about this that might be combined:
    1. Simulate X moves into the future without actually playing their sounds.
    2. Set the 'maximum' length when a bug moves over such a tile.
    Self-modifying tracks with complicated counters and teleporters and such aren't going to be easy to measure.
    This might get into the halting problem, you know?
    */
}

//Still kind of janky, especially when there's stuff in a file.
function resizeFile(){
        var oldSize = fieldContents.length; //It's good to know large the file was before the resize.

        //If we're shrinking the map, clean out the areas that will be removed.
        if(fieldContents.length > FILE_SIZE[0]){
            for(var i = FILE_SIZE[0]; i < fieldContents.length; ++i){
                for(var j = FILE_SIZE[1]; j < fieldContents[i].length; ++j){
                    fieldContents[i][j] = undefined;
                }
            }
        }
        //Move bugs to failsafe positions just to be safe. Eventually make this conditional.
        for(var i = 0; i < bugList.length; ++i){
            if(bugList[i].x > FILE_SIZE[0] || bugList[i].y > FILE_SIZE[1]){
                bugList[i].bugTile[0] = 1;
                bugList[i].bugTile[1] = 1 + i*2;
            }
        }

        fieldContents.length = FILE_SIZE[0];
        //Define the rest of the field.
        for(var i = 0; i < fieldContents.length; ++i) {
            if(fieldContents[i] == undefined){
                fieldContents[i] = new Array(FILE_SIZE[1]);
            }
            fieldContents[i].length = FILE_SIZE[1];
        }
        
        //If we're growing the field, sanitize the new territories with this kludge.
        if(oldSize < FILE_SIZE[0]){
            for(var i = 0; i < fieldContents.length; ++i){
                for(var j = 0; j < fieldContents[i].length; ++j){
                    //Avoid cleaning out userdata.
                    if(i >= oldSize || j >= oldSize) { fieldContents[i][j] = undefined; }
                    
                }
            }
        }

}

//This function renames the value of the pitch to more accurately reflect where it is in a traditional Western 12 tone scale.
function updatePitchDescription(){
    var noteName;
    switch(scaleNote){
        case 0:
            noteName = "C";
            break;        
        case 1:
            noteName = "C#";
            break;        
        case 2:
            noteName = "D";
            break;        
        case 3:
            noteName = "D#";
            break;        
        case 4:
            noteName = "E";
            break;        
        case 5:
            noteName = "F";
            break;        
        case 6:
            noteName = "F#";
            break;        
        case 7:
            noteName = "G";
            break;        
        case 8:
            noteName = "G#";
            break;        
        case 9:
            noteName = "A";
            break;        
        case 10:
            noteName = "A#";
            break;        
        case 11:
            noteName = "B";
            break;
        default:
            alert("Something has gone horribly wrong in updatePitchDescription()!");
            return;
    }
    $('#pitchInput').val(noteName + "-" + (currentOctave + 1) );

}