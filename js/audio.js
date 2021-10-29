//file for the Web Audio API integration
const AudioContext = window.AudioContext || window.webkitAudioContext;
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const addButton = document.getElementById('add_module');
const removeButton = document.getElementById('remove_module');
let numOsc = 0;
let numLFO = 0;
const rackArray = [];
//const scope = document.getElementById('oscilloscope');
//const scopeCtx = scope.getContext("2d");
const audioContext = new AudioContext();

//let osc_scope = audioContext.createAnalyser();
//osc_scope.fftSize = 2048;
//let scopeBuffer = osc_scope.frequencyBinCount;
//let data = new Uint8Array(scopeBuffer);
//osc_scope.getByteTimeDomainData(data);

//setup();

/* add_osc_core: Adds the html containing the structure for a new oscillator module.
 *               The module contains a squarewave, sawtoothwave, and sinewave oscillators.
 *               The oscillators are intialized and events are added to sliders that control 
 *               the frequency of the oscillators.   
 */ 
function add_osc_core() {
    numOsc++; //used for template literals
    let rack = document.getElementById('module_rack'); //gets the div that is going to contain the modules
    //insert the html to make an oscillator module, each is unique due to using a template literal
    rack.insertAdjacentHTML('beforeend', 
        `<div id="osc_core_${numOsc}">
        <h3>Osc Core ${numOsc}</h3>
        <input id="freq_square_${numOsc}" type="range" min="0" max="440" value="0" step="10">
        <input id="freq_saw_${numOsc}" type="range" min="0" max="440" value="0" step="10">
        <input id="freq_sin_${numOsc}" type="range" min="0" max="440" value="0" step="10">
        </div>`
    );
    //add the module to the selector that selects the module for removal
    let remove_option = document.getElementById('remove_module_select');
    remove_option.insertAdjacentHTML('beforeend', `<option value="oscillators">Oscillator Pannel ${numOsc}</option>`);

    //setting up the oscillatorNodes
    let oscSquare = audioContext.createOscillator();
    oscSquare.type = 'square';
    oscSquare.frequency.value = 0;
    let oscSaw = audioContext.createOscillator();
    oscSaw.type = 'sawtooth';
    oscSaw.frequency.value = 0;
    let oscSine = audioContext.createOscillator();
    oscSine.type = 'sine';
    oscSine.frequency.value = 0;

    oscSine.start(0);
    oscSine.connect(audioContext.destination);

    //adding the oscillator module to the global list of modules
    //NOTE: may need to change this to include the input/output to make connecting modules
    //      easier
    let oscillators = {id: `osc_core_${numOsc}`, osc1: oscSquare, osc2: oscSaw, osc3: oscSine};
    rackArray.push(oscillators);
    
    //setting up event listeners for the frequency sliders
    document.getElementById(`freq_square_${numOsc}`).addEventListener('input', (e) => {
        let newFreq = Number(e.target.value);
        oscSquare.frequency.setValueAtTime(newFreq, audioContext.currentTime);
    }); 

    document.getElementById(`freq_saw_${numOsc}`).addEventListener('input', (e) => {
        let newFreq = Number(e.target.value);
        oscSaw.frequency.setValueAtTime(newFreq, audioContext.currentTime);
    });

    document.getElementById(`freq_sin_${numOsc}`).addEventListener('input', (e) => {
        let newFreq = Number(e.target.value);
        oscSine.frequency.setValueAtTime(newFreq, audioContext.currentTime);
    });
}
/* remove_osc_core: This function removes the selected osc module from the DOM
 *                  then removes it from the global module list. 
 * NOTE: This will probably have to be modified to also disconnect any node attached to it.
 */
function remove_osc_core(selector) {
    //gets the selected option from the selector element
    let module_name = selector.selectedOptions[0].innerHTML;
    //gets the number from the selected element
    let module_num = module_name.match(/(\d+)/);
    //gets the actual html by it's id
    let module = document.getElementById(`osc_core_${module_num[0]}`);
    //gets the parent element
    let rack = document.getElementById('module_rack');
    //removes the selected child element
    rack.removeChild(module);
    //removes the option from the selector
    selector.selectedOptions[0].parentNode.removeChild(selector.selectedOptions[0]);
    //removes the module from the global list of modules
    let index = rackArray.findIndex(({id}) => id === `osc_core_${module_num[0]}`);
    rackArray.splice(index, 1);
}

function add_lfo() {
    numLFO++;
    let rack = document.getElementById('module_rack'); //gets the div that is going to contain the modules

    //insert the html to make an oscillator module, each is unique due to using a template literal
    rack.insertAdjacentHTML('beforeend', 
        `<div id="LFO_${numLFO}">
        <h3>LFO ${numLFO}</h3>
        <input id="freq_lfo_${numLFO}" type="range" min="0" max="220" value="0" step="0.1">
        <label for="add_LFO">LFO Type:</label>
        <select id="sel_lfo_${numLFO}" name="add_LFO">
            <option value='square'>Square</option>
            <option value='sine'>Sine</option>
            <option value='sawtooth'>Sawtooth</option>
            <option value='triangle'>Triangle</option>
        </select>
        </div>`
    );
    //add the module to the selector that selects the module for removal
    let remove_option = document.getElementById('remove_module_select');
    remove_option.insertAdjacentHTML('beforeend', `<option value="lfo">LFO ${numLFO}</option>`);

    //setting up the oscillatorNodes
    let lfo = audioContext.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 0;

    let lfos = {id: `LFO_${numLFO}`, lfo1: lfo};
    rackArray.push(lfos);

    document.getElementById(`sel_lfo_${numLFO}`).addEventListener('change', (e) => {
        let lfo_type = e.target.value;
        lfo.type = lfo_type;
    });

    document.getElementById(`freq_lfo_${numLFO}`).addEventListener('input', (e) => {
        let newFreq = Number(e.target.value);
        lfo.frequency.setValueAtTime(newFreq, audioContext.currentTime);
    });

}

function remove_lfo(selector) {
        //gets the selected option from the selector element
        let module_name = selector.selectedOptions[0].innerHTML;
        //gets the number from the selected element
        let module_num = module_name.match(/(\d+)/);
        //gets the actual html by it's id
        let module = document.getElementById(`LFO_${module_num[0]}`);
        //gets the parent element
        let rack = document.getElementById('module_rack');
        //removes the selected child element
        rack.removeChild(module);
        //removes the option from the selector
        selector.selectedOptions[0].parentNode.removeChild(selector.selectedOptions[0]);
        //removes the module from the global list of modules
        let index = rackArray.findIndex(({id}) => id === `LFO_${module_num[0]}`);
        rackArray.splice(index, 1);
}

//sets up an event listener on the addButton
addButton.addEventListener('click', () => {
    //gets what module that the end user wants to add
    let selector = document.getElementById('add_module_select');
    //selects the correct add module function based on the selected option 
    switch (selector.value) {
        case 'oscillators':
            add_osc_core();
            break;
        case 'lfo':
            add_lfo();
            break;
        default:
            console.log(selector.value);
    }
});

//sets up an event listener on the removeButton
removeButton.addEventListener('click', () => {
    //gets what module that the end user wants to remove
    let selector = document.getElementById('remove_module_select');
    //selects the correct remove module function based on the selected option 
    switch (selector.value) {
        case 'oscillators':
            remove_osc_core(selector);
            break;
        case 'lfo':
            remove_lfo(selector);
            break;
        default:
            console.log(selector.value);
    }
});

playButton.addEventListener('click', () => {
    if(audioContext.state === 'suspended') {
        //gain.connect(audioContext.destination);
        audioContext.resume();
    }
}); 

pauseButton.addEventListener('click', () => {
    audioContext.suspend();
    //gain.disconnect(audioContext.destination);
}); 

function setup() {
    /*
    const oscSquare = audioContext.createOscillator();
    oscSquare.type = 'square';
    oscSquare.frequency = 0;
    const oscSaw = audioContext.createOscillator();
    oscSaw.type = 'sawtooth';
    oscSaw.frequency = 0;
    const oscSine = audioContext.createOscillator();
    oscSine.type = 'sine';
    */
    const gain = audioContext.createGain();
    gain.gain.value = 0.5;
    oscSquare.connect(gain);
    oscSquare.start(0);
    oscSaw.connect(gain);
    oscSaw.start(0);
    oscSine.connect(gain);
    oscSine.start(0);
    gain.connect(osc_scope);

    freqSquare.addEventListener('input', (e) => {
        let newFreq = parseInt(e.target.value);
        //console.log(newFreq);
        oscSquare.frequency.setValueAtTime(newFreq, audioContext.currentTime);
        //console.log(oscSquare.frequency);
    }); 

    freqSaw.addEventListener('input', (e) => {
        let newFreq = parseInt(e.target.value);
        //console.log(newFreq);
        oscSaw.frequency.setValueAtTime(newFreq, audioContext.currentTime);
        //console.log(oscSquare.frequency);
    });

    freqSin.addEventListener('input', (e) => {
        let newFreq = parseInt(e.target.value);
        //console.log(newFreq);
        oscSine.frequency.setValueAtTime(newFreq, audioContext.currentTime);
        //console.log(oscSquare.frequency);
    }); 

}

//need to replace this as it is direcly from https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
//used to debug
function drawScope() {
    requestAnimationFrame(drawScope);
    osc_scope.getByteTimeDomainData(data);
    scopeCtx.fillStyle - "rgb(0, 0, 0)";
    scopeCtx.fillRect(0,0,scope.width, scope.height);
    scopeCtx.lineWidth = 2;
    scopeCtx.strokeStyle = "rgb(0, 200, 0)";
    scopeCtx.beginPath();
    let sliceWidth = scope.width * 1.0 / scopeBuffer;
    let x  = 0;
    for(let i = 0; i < scopeBuffer; i++) {
        let v = data[i]/128.0;
        let y = v * scope.height / 2;
        if(i === 0) {
            scopeCtx.moveTo(x, y);
        } else {
            scopeCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    scopeCtx.lineTo(scope.width, scope.height/2);
    scopeCtx.stroke();
}
//drawScope();