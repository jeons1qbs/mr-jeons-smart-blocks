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
        //% block="beautiful vibrato 〰️"
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
            // 1. Get current running time of the micro:bit
            let timeMs = input.runningTime();

            // 2. RESEARCH APPLIED: 5 Hz Vibrato Rate = 200ms per cycle
            let cycleTimeMs = 200;
            let timeInCycle = timeMs % cycleTimeMs;

            // 3. Calculate position on the Sine wave
            let angle = (timeInCycle / cycleTimeMs) * 2 * Math.PI;

            // 4. RESEARCH APPLIED: ~1.5% frequency shift (subtle, beautiful depth)
            let maxPitchShift = freqHz * 0.015;
            let smoothShift = Math.sin(angle) * maxPitchShift;

            // 5. Instantly play adjusted frequency and exit block
            music.ringTone(Math.round(freqHz + smoothShift));
        } else {
            // Instantly play flat frequency and exit block
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