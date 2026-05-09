/**
 * Custom blocks for QBS!
 */
//% color=#E3008C icon="\uf028" weight=100
//% groups='["Music"]'
//% block="QBS"
namespace QBS {

    /**
     * Options to add cool effects to our notes.
     */
    export enum SoundEffect {
        //% block="straight sound ➖"
        None = 0,
        //% block="wobbly sound 〰️"
        Vibrato = 1
    }

    // Pre-calculated frequencies for the C Major scale.
    // Index 0 is G3 (196 Hz). Index 18 is D6 (1175 Hz).
    const cScaleFreqs = [
        196, 220, 247, 262, 294, 330, 349, 392, 440,
        494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175
    ];

    /**
     * Plays a step on the C Major scale. 0 starts at the note G.
     * @param note a number from 0 to 18, eg: 3
     * @param effect choose whether to add a wobbly vibrato effect
     */
    //% block="🎵 play note step $note || with $effect"
    //% group="Music"
    //% note.min=0 note.max=18 note.defl=3
    //% effect.defl=SoundEffect.None
    //% expandableArgumentMode="toggle"
    //% help="qbs-ext/docs/play-note-step"
    //% weight=90
    export function playNoteStep(note: number, effect?: SoundEffect): void {
        // Ensure the note stays safely within our 0 to 18 bounds
        let safeNote = Math.max(0, Math.min(18, Math.round(note)));
        let freqHz = cScaleFreqs[safeNote];

        // Pass the simplified logic to our advanced helper
        advancedPlay(freqHz, effect);
    }

    /**
     * Advanced: Play a specific raw frequency with an optional effect.
     * @param freqHz the exact pitch in Hertz, eg: 440
     * @param effect the sound effect to apply
     */
    //% block="🔊 play exact pitch $freqHz with $effect"
    //% group="Music"
    //% freqHz.min=130 freqHz.max=2000 freqHz.defl=440
    //% advanced=true
    //% help="qbs-ext/docs/advanced-play"
    //% weight=80
    export function advancedPlay(freqHz: number, effect: SoundEffect): void {
        if (effect === SoundEffect.Vibrato) {
            // Create a "vibrato" by rapidly alternating the pitch up and down
            for (let i = 0; i < 5; i++) {
                music.playTone(freqHz + 10, 50);
                music.playTone(freqHz - 10, 50);
            }
        } else {
            // Play a standard flat tone for 500 milliseconds (half a second)
            music.playTone(freqHz, 500);
        }
    }
}