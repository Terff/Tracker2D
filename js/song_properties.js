/* Under construction.
*/

var AMOUNT_OF_SONG_PROPERTIES = 4; //Update if we add more.

var TEMPO = 120; //Hardcoded for now, represents tempo in BPM. Use mathematical wizardry to make sure this is accurate.
var PLAYFIELD_SIZE = [64, 128, 256, 512]; //The user will eventually be able to choose how large their field is in tiles. Produces squares.

//Once these are implemented, it should reflect badly on the user not to put anything at all here when sharing a file.
var author = "If you see this, the author couldn't be bothered to even claim anonymity.";
var songDescription = "If you see this, the author couldn't be bothered to say anything about his work.";

//Implement bug starting positions if any.
var bug1StartingPosition = [1,1];