function hookKeyboard(){

    //Start with the canvas keys.
    $(window).keypress(function(e){
        //Multiple cases for multiple browser implementations.
        var keyboardInput = (e.charCode) ? e.charCode : ((e.which) ? e.which : e.keyCode);
        console.log(keyboardInput);
        switch(keyboardInput){
            //Pitch adjustment. This should perhaps be disabled when a window requiring text input is open.
            //It might be good to play the current instrument at the selected pitch when the user triggers hotkeys.
            case 61:
                if(currentOctave < 5) {
                    currentOctave += 1;
                    currentPitch += 12;
                    $('#pitchInput').val(currentPitch);
                }
                break;
            case 45:
                if(currentOctave > 0) {
                    currentOctave -= 1;
                    currentPitch -= 12;
                    $('#pitchInput').val(currentPitch);
                }
                $('#pitchInput').val(currentPitch);
                break;

            case 113:
                scaleNote = 0;
                break;
            case 119:
                scaleNote = 1;
                break;
            case 101:
                scaleNote = 2;
                break;
            case 114:
                scaleNote = 3;
                break;
            case 116:
                scaleNote = 4;
                break;
            case 121:
                scaleNote = 5;
                break;
            case 117:
                scaleNote = 6;
                break;
            case 105:
                scaleNote = 7;
                break;
            case 111:
                scaleNote = 8;
                break;
            case 112:
                scaleNote = 9;
                break;
            case 91:
                scaleNote = 10;
                break;
            case 93:
                scaleNote = 11;
                break;
            default:
                break;   
        }
        if(keyboardInput !== 61 && keyboardInput !== 45) { 
            currentPitch = currentOctave*12 + scaleNote; 
            $('#pitchInput').val(currentPitch);
        }
    });

    

    //Input sanitization for number only fields ("spinners"). Thanks, Stackoverflow!
    //http://stackoverflow.com/questions/891696/jquery-what-is-the-best-way-to-restrict-number-only-input-for-textboxes-all
    jQuery('.numbersOnly').keypress(function (){  
        this.value = this.value.replace(/[^0-9\.]/g,'');
        //var testTempo = this.value.parseInt();
        //console.log(testTempo); 
    });

    //UI hooks for the Song Properties and Tile Properties windows
    jQuery('#tempoSpinner').change(function (){
        //console.log(this.value);
        if(this.value >= 1 && this.value <= 999) {
            TEMPO = this.value;
        } else if(this.value < 1 || this.value > 999) {
            this.value.replace(TEMPO);
        }
        //Reset this timing value to recalibrate the main loop on tempo change.
        timeToUpdate = 0;
        updateFrequency = TICK_MULTIPLIER/TEMPO;
        
    });

    jQuery('#authorName').change(function (){
        author = this.value;
    });
    jQuery('#songName').change(function (){
        songTitle = this.value;
    });
    jQuery('#songDesc').change(function (){
        songDescription = this.value;
    });

    //Instrument adjuster in Tile Properties
    jQuery('#modifyTileInstrumentSpinner').change(function (){
        //currentlyEditedTile gets around scoping...
        if(this.value >= 0 && this.value <= soundSet.length) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].instrument = parseInt(this.value);
        } else if(this.value < 0 || this.value > soundSet.length) {
            this.value.replace(fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].instrument);
        }
        fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].updateColor();   
    });    
    //Flow Control Value adjuster in Tile Properties
    jQuery('#modifyTileFlowSpinner').change(function (){
        //currentlyEditedTile gets around scoping...
        if(this.value >= 0 && this.value <= 999) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].flowValue = parseInt(this.value);
        } else if(this.value < 0 || this.value > 999) {
            this.value.replace(fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].flowValue);
        } 
    });
    //Pointer adjusters for much the same purpose.
    jQuery('#modifyPointerTileX').change(function (){
        if(this.value >= 0 && this.value <= FILE_SIZE[0]) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].xPointer = parseInt(this.value);
        } else if(this.value < 0 || this.value > FILE_SIZE[0]) {
            this.value.replace(xPointer);
        }
    });
    jQuery('#modifyPointerTileY').change(function (){
        if(this.value >= 0 && this.value <= FILE_SIZE[1]) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].yPointer = parseInt(this.value);
        } else if(this.value < 0 || this.value > FILE_SIZE[1]) {
            this.value.replace(yPointer);
        }
    });




}