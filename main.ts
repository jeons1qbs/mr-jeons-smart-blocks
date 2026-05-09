/**
 * Custom blocks for QBS!
 */
//% color=#E3008C icon="\uf028" weight=100
//% groups='["Music"]'
//% block="QBS"
namespace QBS {

    export enum SoundEffect {
        //% block="straight sound ➖"
        None = 0,
        //% block="smooth wobbly sound 〰️"
        Vibrato = 1
    }

    // Pre-calculated frequencies for the C Major scale.
    const cScaleFreqs = [
        196, 220, 247, 262, 294, 330, 349, 392, 440,
        494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175
    ];

    /**
     * Plays a continuous step on the C Major scale. 
     * Put this in a 'forever' loop if your note changes constantly!
     * @param note a number from 0 to 18, eg: 3
     * @param effect choose whether to add a beautiful smooth vibrato effect
     */
    //% block="🎵 play continuous note $note || with $effect"
    //% group="Music"
    //% note.min=0 note.max=18 note.defl=3
    //% effect.defl=SoundEffect.None
    //% expandableArgumentMode="toggle"
    //% help="qbs-ext/docs/play-continuous-note"
    //% weight=90
    export function playContinuousNote(note: number, effect?: SoundEffect): void {
        let safeNote = Math.max(0, Math.min(18, Math.round(note)));
        let freqHz = cScaleFreqs[safeNote];

        advancedPlayContinuous(freqHz, effect);
    }

    /**
     * Advanced: Play a specific continuous raw frequency.
     * @param freqHz the exact pitch in Hertz, eg: 440
     * @param effect the sound effect to apply
     */
    //% block="🔊 play exact continuous pitch $freqHz with $effect"
    //% group="Music"
    //% freqHz.min=130 freqHz.max=2000 freqHz.defl=440
    //% advanced=true
    //% help="qbs-ext/docs/advanced-play-continuous"
    //% weight=80
    export function advancedPlayContinuous(freqHz: number, effect: SoundEffect): void {
        if (effect === SoundEffect.Vibrato) {
            // 1. Get the current running time of the micro:bit in milliseconds
            let timeMs = input.runningTime();
            let cycleTimeMs = 800;

            // 2. Use modulo (%) to keep our time math nicely inside the 0-800 window
            let timeInCycle = timeMs % cycleTimeMs;

            // 3. Calculate our position on the Sine wave (from 0 to 2*PI)
            let angle = (timeInCycle / cycleTimeMs) * 2 * Math.PI;

            // 4. Calculate the 1/4 pitch shift
            let maxPitchShift = freqHz * 0.029;
            let smoothShift = Math.sin(angle) * maxPitchShift;

            // 5. Instantly play the adjusted frequency and exit the block
            music.ringTone(Math.round(freqHz + smoothShift));
        } else {
            // Instantly play the flat frequency and exit the block
            music.ringTone(freqHz);
        }
    }

    /**
     * Stops any continuous music playing from this extension.
     */
    //% block="🛑 stop continuous music"
    //% group="Music"
    //% help="qbs-ext/docs/stop-continuous-music"
    //% weight=70
    export function stopContinuousMusic(): void {
        music.ringTone(0);
    }
}