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

    // Flag for the background loop
    let playingVibrato = false;

    /**
     * Plays a continuous step on the C Major scale in the background. 
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
        playingVibrato = false;

        if (effect === SoundEffect.Vibrato) {
            playingVibrato = true;

            control.inBackground(function () {
                let timeMs = 0;
                const cycleTimeMs = 800; // 0.8 seconds per full wave cycle
                const stepMs = 40;       // update pitch every 40 ms for smoothness

                // 1/4 pitch (quarter tone) is roughly a 2.9% shift in frequency
                const maxPitchShift = freqHz * 0.029;

                while (playingVibrato) {
                    // 1. Calculate our position on the Sine wave (from 0 to 2*PI)
                    let angle = (timeMs / cycleTimeMs) * 2 * Math.PI;

                    // 2. Math.sin() gives a smooth curve from -1 to 1. 
                    // Multiply it by our max pitch shift.
                    let smoothShift = Math.sin(angle) * maxPitchShift;

                    // 3. Play the adjusted frequency (MakeCode requires whole numbers)
                    music.ringTone(Math.round(freqHz + smoothShift));

                    // 4. Wait a tiny bit, then move time forward
                    basic.pause(stepMs);
                    timeMs += stepMs;

                    // 5. Reset time after 0.8 seconds to prevent the number from getting too large
                    if (timeMs >= cycleTimeMs) {
                        timeMs = 0;
                    }
                }
            });
        } else {
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
        playingVibrato = false;
        music.ringTone(0);
    }
}