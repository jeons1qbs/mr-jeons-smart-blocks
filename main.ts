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
    const cScaleFreqs = [
        196, 220, 247, 262, 294, 330, 349, 392, 440,
        494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175
    ];

    // This flag tells our background loop whether it should keep shaking the pitch
    let playingVibrato = false;

    /**
     * Plays a continuous step on the C Major scale in the background. 
     * @param note a number from 0 to 18, eg: 3
     * @param effect choose whether to add a wobbly vibrato effect
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
     * Advanced: Play a specific continuous raw frequency in the background.
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
        // Turn off any currently running vibrato loop before starting a new one
        playingVibrato = false;

        if (effect === SoundEffect.Vibrato) {
            playingVibrato = true;

            // control.inBackground runs the loop without freezing the rest of your blocks!
            control.inBackground(function () {
                while (playingVibrato) {
                    music.ringTone(freqHz + 10);
                    basic.pause(50);
                    music.ringTone(freqHz - 10);
                    basic.pause(50);
                }
            });
        } else {
            // music.ringTone plays infinitely in the background without pausing
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
        // Tell the background vibrato loop to stop spinning
        playingVibrato = false;
        // Setting the ringtone to 0 Hz effectively silences the speaker
        music.ringTone(0);
    }
}