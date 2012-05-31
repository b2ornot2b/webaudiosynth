/*!
 *  Some parts copyright 2012 abudaan http://abumarkub.net
 *  code licensed under MIT 
 *  http://abumarkub.net/midibridge/license
 * 
 *  dependecies:
 *  - MIDIBridge.js
 *  
 */

var lastNote = -1;

function MIDIMessageReceived(e) {

    // NOTE: MIDIBridge is authored to an older version of the MIDI API proposal - this will need to change to the
    // "data" property being a UInt8Array later.
    //console.log(e.toString());

    if ( (e.command == midiBridge.NOTE_OFF) ||
         ((e.command == midiBridge.NOTE_OFF)&&(e.data2==0)) ) { // with MIDI, note on with velocity zero is the same as note off
        if (e.data1 == lastNote) {   // this keeps from shutting off if we're overlapping notes
            p.stop();
            lastNote = -1;
        }
    } else if (e.command == midiBridge.NOTE_ON) {
        var noteNumber = e.data1 - 29;
        if (noteNumber >= 0) {
            p.play( noteNumber );
            lastNote = e.data1;
        }
    }
}

window.addEventListener('load', function() {   
    midiBridge.init(function(MIDIAccess){        
        var inputs = MIDIAccess.enumerateInputs();
        var firstInput = inputs[0];
        var input = MIDIAccess.getInput( firstInput );
        
        if(input){
            alert("MIDI input device active!");
            input.addEventListener("midimessage",MIDIMessageReceived);            
        } else {
            console.log("Error: No MIDI devices.");
        }
    });           
});