
//Each instrument is going to have at least one sound in it, but some will definitely have more.
//Drumkits and the planned "funny SFX" module, in particular, will have a bunch.
//I'll have to rewrite parts of the audio routine to support that.

//Are there any other parameters that might come in handy?
//We could expand instruments to contain multiple samples by adding another dimension to these arrays, or by replacing a file with a folder.
//However, we'd have to make playback more robust first.
var soundSet = new Array(175); //128 sounds for the general MIDI instruments, 46 more for the base percussion map; index 0 is silence.

soundSet[0] = ["00 - Silence", './sounds/00.mp3']; //Name and reference sound for a simple one-sound instrument.
//Pianos
soundSet[1] = ["01 - Grand Piano", './sounds/01.ogg']; 
soundSet[2] = ["02 - Bright Piano", './sounds/02.ogg']; 
soundSet[3] = ["03 - Electric Piano", './sounds/03.ogg']; 
soundSet[4] = ["04 - Honky-Tonk", './sounds/04.ogg'];
soundSet[5] = ["05 - Rhodes", './sounds/05.ogg']; 
soundSet[6] = ["06 - Cheesy DX7", './sounds/06.ogg'];
soundSet[7] = ["07 - Harpsichord", './sounds/07.ogg']; 
soundSet[8] = ["08 - Clavinet", './sounds/08.ogg'];  
//Chromatic Percussion
soundSet[9] = ["09 - Celesta", './sounds/09.ogg'];
soundSet[10] = ["10 - Glockenspiel", './sounds/10.ogg']; 
soundSet[11] = ["11 - Music Box", './sounds/11.ogg']; 
soundSet[12] = ["12 - Vibraphone", './sounds/12.ogg']; 
soundSet[13] = ["13 - Marimba", './sounds/13.ogg']; 
soundSet[14] = ["14 - Xylophone", './sounds/14.ogg'];
soundSet[15] = ["15 - Tubular Bells", './sounds/15.ogg']; 
soundSet[16] = ["16 - Dulcimer", './sounds/16.ogg'];
//Organ
soundSet[17] = ["17 - Drawbar Organ", './sounds/17.ogg'];
soundSet[18] = ["18 - Percussive Organ", './sounds/18.ogg']; 
soundSet[19] = ["19 - Rock Organ", './sounds/19.ogg']; 
soundSet[20] = ["20 - Church Organ", './sounds/20.ogg']; 
soundSet[21] = ["21 - Reed Organ", './sounds/21.ogg']; 
soundSet[22] = ["22 - Accordion", './sounds/22.ogg'];
soundSet[23] = ["23 - Harmonica", './sounds/23.ogg']; 
soundSet[24] = ["24 - Tangoccordion", './sounds/24.ogg'];
//Guitar
soundSet[25] = ["25 - Nylon String Guitar", './sounds/25.ogg']; 
soundSet[26] = ["26 - Steel String Guitar", './sounds/26.ogg']; 
soundSet[27] = ["27 - Jazz Guitar", './sounds/27.ogg']; 
soundSet[28] = ["28 - Clean Electric Guitar", './sounds/28.ogg']; 
soundSet[29] = ["29 - Palm Muted Guitar", './sounds/29.ogg']; 
soundSet[30] = ["30 - Overdriven Guitar", './sounds/30.ogg'];
soundSet[31] = ["31 - Distorted Guitar", './sounds/31.ogg'];
soundSet[32] = ["32 - Guitar Harmonics", './sounds/32.ogg'];
//Bass
soundSet[33] = ["33 - Acoustic Bass", './sounds/33.ogg'];
soundSet[34] = ["34 - Fingered Bass", './sounds/34.ogg'];
soundSet[35] = ["35 - Picked Bass", './sounds/35.ogg'];
soundSet[36] = ["36 - Fretless", './sounds/36.ogg'];
soundSet[37] = ["37 - Slap Bass 1", './sounds/37.ogg'];
soundSet[38] = ["38 - Slap Bass 2", './sounds/38.ogg'];
soundSet[39] = ["39 - Synth Bass", './sounds/39.ogg'];
soundSet[40] = ["40 - YM2612 Amp Bass", './sounds/40.ogg'];
//Strings
soundSet[41] = ["41 - Violin", './sounds/41.ogg'];
soundSet[42] = ["42 - Viola", './sounds/42.ogg'];
soundSet[43] = ["43 - Cello", './sounds/43.ogg'];
soundSet[44] = ["44 - Contrabass", './sounds/44.ogg'];
soundSet[45] = ["45 - Tremolo", './sounds/45.ogg'];
soundSet[46] = ["46 - Pizzicato Section", './sounds/46.ogg'];
soundSet[47] = ["47 - Harp", './sounds/47.ogg'];
soundSet[48] = ["48 - Timpani", './sounds/48.ogg'];
//Ensemble
soundSet[49] = ["49 - String Ensemble", './sounds/49.ogg'];
soundSet[50] = ["50 - Slow Strings", './sounds/50.ogg'];
soundSet[51] = ["51 - Synth Strings", './sounds/51.ogg'];
soundSet[52] = ["52 - Synth Strings 2", './sounds/52.ogg'];
soundSet[53] = ["53 - Choir Aahs", './sounds/53.ogg'];
soundSet[54] = ["54 - Bootleg Egoraptor Chorus", './sounds/54.ogg'];
soundSet[55] = ["55 - Synth Vox", './sounds/55.ogg'];
soundSet[56] = ["56 - Orchestra Hit", './sounds/56.ogg'];
//Brass
soundSet[57] = ["57 - Trumpet", './sounds/57.ogg'];
soundSet[58] = ["58 - Trombone", './sounds/58.ogg'];
soundSet[59] = ["59 - Tuba", './sounds/59.ogg'];
soundSet[60] = ["60 - Muted Trumpet", './sounds/60.ogg'];
soundSet[61] = ["61 - French Horn", './sounds/61.ogg'];
soundSet[62] = ["62 - Generic Brass", './sounds/62.ogg'];
soundSet[63] = ["63 - Synth Brass", './sounds/63.ogg'];
soundSet[64] = ["64 - Synth Brass 2", './sounds/64.ogg'];
//Reed
soundSet[65] = ["65 - Soprano Sax", './sounds/65.ogg'];
soundSet[66] = ["66 - Tenor Sax", './sounds/66.ogg'];
soundSet[67] = ["67 - Alto Sax", './sounds/67.ogg'];
soundSet[68] = ["68 - Baritone Sax", './sounds/68.ogg'];
soundSet[69] = ["69 - Oboe", './sounds/69.ogg'];
soundSet[70] = ["70 - English Horn", './sounds/70.ogg'];
soundSet[71] = ["71 - Bassoon", './sounds/71.ogg'];
soundSet[72] = ["72 - Clarinet", './sounds/72.ogg'];
//Pipe
soundSet[73] = ["73 - Piccolo", './sounds/73.ogg'];
soundSet[74] = ["74 - Flute", './sounds/74.ogg'];
soundSet[75] = ["75 - Recorder", './sounds/75.ogg'];
soundSet[76] = ["76 - Pan Flute", './sounds/76.ogg'];
soundSet[77] = ["77 - Blown Bottle", './sounds/77.ogg'];
soundSet[78] = ["78 - Shakuhachi", './sounds/78.ogg'];
soundSet[79] = ["79 - Whistle", './sounds/79.ogg'];
soundSet[80] = ["80 - Ocarina", './sounds/80.ogg'];
//Synth Lead
soundSet[81] = ["81 - Square Waveform", './sounds/81.ogg'];
soundSet[82] = ["82 - Sawtooth Waveform", './sounds/82.ogg'];
soundSet[83] = ["83 - Synth Calliope", './sounds/83.ogg'];
soundSet[84] = ["84 - Chiffer Lead", './sounds/84.ogg'];
soundSet[85] = ["85 - Charang", './sounds/85.ogg'];
soundSet[86] = ["86 - Supposedly A Synth Voice", './sounds/86.ogg'];
soundSet[87] = ["87 - 5ths Lead", './sounds/87.ogg'];
soundSet[88] = ["88 - Bass Lead", './sounds/88.ogg'];
//Synth Pad
soundSet[89] = ["89 - Fantasia", './sounds/89.ogg'];
soundSet[90] = ["90 - Warm Pad", './sounds/90.ogg'];
soundSet[91] = ["91 - Polysynth", './sounds/91.ogg'];
soundSet[92] = ["92 - Space Voice", './sounds/92.ogg'];
soundSet[93] = ["93 - Bowed Glass", './sounds/93.ogg'];
soundSet[94] = ["94 - Metallic Pad", './sounds/94.ogg'];
soundSet[95] = ["95 - Halo Pad", './sounds/95.ogg'];
soundSet[96] = ["96 - Sweep Pad", './sounds/96.ogg'];
//Synth Effects (Who, when the GM specification was being designed, named these things?)
soundSet[97] = ["97 - Ice Rain", './sounds/97.ogg'];
soundSet[98] = ["98 - Soundtrack", './sounds/98.ogg'];
soundSet[99] = ["99 - Crystal", './sounds/99.ogg'];
soundSet[100] = ["100 - Atmosphere", './sounds/100.ogg'];
soundSet[101] = ["101 - Brightness", './sounds/101.ogg'];
soundSet[102] = ["102 - Goblins", './sounds/102.ogg'];
soundSet[103] = ["103 - Echo Drops", './sounds/103.ogg'];
soundSet[104] = ["104 - Star Theme", './sounds/104.ogg'];
//Non-European instruments
soundSet[105] = ["105 - Sitar", './sounds/105.ogg'];
soundSet[106] = ["106 - Banjo", './sounds/106.ogg'];
soundSet[107] = ["107 - Shamisen", './sounds/107.ogg'];
soundSet[108] = ["108 - Koto", './sounds/108.ogg'];
soundSet[109] = ["109 - Kalimba", './sounds/109.ogg'];
soundSet[110] = ["110 - Bagpipe", './sounds/110.ogg'];
soundSet[111] = ["111 - Fiddle", './sounds/111.ogg'];
soundSet[112] = ["112 - Shanai", './sounds/112.ogg'];
//Percussive instruments (not to be confused with the Percussion banks)
soundSet[113] = ["113 - Tinkle Bell", './sounds/113.ogg'];
soundSet[114] = ["114 - Agogo", './sounds/114.ogg'];
soundSet[115] = ["115 - Steel Drums", './sounds/115.ogg'];
soundSet[116] = ["116 - Woodblock", './sounds/116.ogg'];
soundSet[117] = ["117 - Taiko Drum", './sounds/117.ogg'];
soundSet[118] = ["118 - Melodic Tom", './sounds/118.ogg'];
soundSet[119] = ["119 - Synth Drum", './sounds/119.ogg'];
soundSet[120] = ["120 - Reverse Cymbal", './sounds/120.ogg'];
//GM Sound Effects
soundSet[121] = ["121 - Guitar Frets", './sounds/121.ogg'];
soundSet[122] = ["122 - Breath Noise (Buh)", './sounds/122.ogg'];
soundSet[123] = ["123 - Seashore", './sounds/123.ogg'];
soundSet[124] = ["124 - Birds", './sounds/124.ogg'];
soundSet[125] = ["125 - Telephone", './sounds/125.ogg'];
soundSet[126] = ["126 - Helicopter", './sounds/126.ogg'];
soundSet[127] = ["127 - Applause", './sounds/127.ogg'];
soundSet[128] = ["128 - Gunshot", './sounds/128.ogg'];

//Beginning of the Level 1 percussion map
soundSet[129] = ["P01 - Acoustic Bass Drum", './sounds/129.ogg']; 
soundSet[130] = ["P02 - Electric Bass Drum", './sounds/130.ogg']; 
soundSet[131] = ["P03 - Side Stick", './sounds/131.ogg']; 
soundSet[132] = ["P04 - Acoustic Snare", './sounds/132.ogg']; 
soundSet[133] = ["P05 - Handclap", './sounds/133.ogg']; 
soundSet[134] = ["P06 - Electric Snare", './sounds/134.ogg']; 
soundSet[135] = ["P07 - Low Floor Tom", './sounds/135.ogg']; 
soundSet[136] = ["P08 - Closed Hi Hat", './sounds/136.ogg']; 
soundSet[137] = ["P09 - High Floor Tom", './sounds/137.ogg']; 
soundSet[138] = ["P10 - Pedal Hi Hat", './sounds/138.ogg']; 
soundSet[139] = ["P11 - Low Tom", './sounds/139.ogg']; 
soundSet[140] = ["P12 - Open Hi Hat", './sounds/140.ogg']; 
soundSet[141] = ["P13 - Low-Mid Tom", './sounds/141.ogg']; 
soundSet[142] = ["P14 - Hi-Mid Tom", './sounds/142.ogg'];
soundSet[143] = ["P15 - Crash Cymbal 1", './sounds/143.ogg']; 
soundSet[144] = ["P16 - High Tom", './sounds/144.ogg']; 
soundSet[145] = ["P17 - Ride Cymbal 1", './sounds/145.ogg']; 
soundSet[146] = ["P18 - Chinese Cymbal", './sounds/146.ogg']; 
soundSet[147] = ["P19 - Ride Bell", './sounds/147.ogg']; 
soundSet[148] = ["P20 - Tambourine", './sounds/148.ogg']; 
soundSet[149] = ["P21 - Splash Cymbal", './sounds/149.ogg']; 
soundSet[150] = ["P22 - Cowbell", './sounds/150.ogg']; 
soundSet[151] = ["P23 - Crash Cymbal 2", './sounds/151.ogg']; 
soundSet[152] = ["P24 - Vibraslap (!?)", './sounds/152.ogg']; 

soundSet[153] = ["P25 - Ride Cymbal 2", './sounds/153.ogg']; 
soundSet[154] = ["P26 - High Bongo", './sounds/154.ogg']; 
soundSet[155] = ["P27 - Low Bongo", './sounds/155.ogg']; 
soundSet[156] = ["P28 - Mute High Conga", './sounds/156.ogg']; 
soundSet[157] = ["P29 - Open High Conga", './sounds/157.ogg']; 
soundSet[158] = ["P30 - Low Conga", './sounds/158.ogg']; 
soundSet[159] = ["P31 - High Timbale", './sounds/159.ogg']; 
soundSet[160] = ["P32 - Low Timbale", './sounds/160.ogg'];


soundSet[161] = ["P33 - High Agogo", './sounds/161.ogg']; 
soundSet[162] = ["P34 - Low Agogo", './sounds/162.ogg']; 
soundSet[163] = ["P35 - Cabasa", './sounds/163.ogg']; 
soundSet[164] = ["P36 - Maracas", './sounds/164.ogg']; 
soundSet[165] = ["P37 - Short Whistle", './sounds/165.ogg']; 
soundSet[166] = ["P38 - Long Whistle", './sounds/166.ogg']; 
soundSet[167] = ["P39 - Short Guiro", './sounds/167.ogg']; 
soundSet[168] = ["P40 - Long Guiro", './sounds/168.ogg']; 


soundSet[169] = ["P41 - Claves", './sounds/169.ogg']; 
soundSet[170] = ["P42 - High Wood Block", './sounds/170.ogg']; 
soundSet[171] = ["P43 - Low Wood Block", './sounds/171.ogg']; 
soundSet[172] = ["P44 - Mute Cuica", './sounds/172.ogg']; 
soundSet[173] = ["P45 - Open Cuica", './sounds/173.ogg']; 
soundSet[174] = ["P46 - Mute Triangle", './sounds/174.ogg']; 
soundSet[175] = ["P47 - Jingle Bell", './sounds/175.ogg']; //More useful than an open triangle, I think.


//Cool synthesizer type effects will go here

//And finally, novelty sound effects, like farting.