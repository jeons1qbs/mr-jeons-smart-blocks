/**
 * QBS Expressive Music Extension
 */
//% color=#E3008C icon="\uf028" weight=100
//% groups='["Music"]'
namespace QBS {

    export enum SoundEffect {
        //% block="straight sound ➖"
        None = 0,
        //% block="expressive vibrato 〰️"
        Vibrato = 1
    }

    const cScaleFreqs = [
        196, 220, 247, 262, 294, 330, 349, 392, 440,
        494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175
    ];

    /**
     * Plays a note that responds to how you move and touch the micro:bit.
     * Tilt Forward/Back for Sharps/Flats. 
     * The force of your touch controls Volume.
     * @param note the scale index (0-18), eg: 3
     * @param effect choose whether to add vibrato
     */
    //% block="🎵 play expressive note $note || effect $effect"
    //% group="Music"
    //% note.min=0 note.max=18 note.defl=3
    //% effect.defl=SoundEffect.None
    //% expandableArgumentMode="toggle"
    //% weight=90
    export function playExpressiveNote(note: number, effect?: SoundEffect): void {
        let safeNote = Math.max(0, Math.min(18, Math.round(note)));
        let baseFreq = cScaleFreqs[safeNote];

        // --- 1. INTERNAL INTENSITY (The "Tap Force") ---
        // We calculate the intensity right here inside the block.
        let shock = Math.abs(input.acceleration(Dimension.Strength) - 1023);
        // Map raw shock (0-1500) to intensity (0-100)
        let intensity = Math.max(0, Math.min(100, Math.round(Math.map(shock, 0, 1500, 0, 100))));

        // --- 2. VOLUME MAPPING ---
        // 0 intensity -> Vol 30 | 80+ intensity -> Vol 255
        let vol = Math.map(intensity, 0, 80, 30, 255);
        vol = Math.max(30, Math.min(255, vol));
        music.setVolume(vol);

        // --- 3. PITCH SHIFT (Forward/Backward Tilt) ---
        // Threshold: 20 degrees is ~340 milli-g
        let tiltY = input.acceleration(Dimension.Y);
        let finalFreq = baseFreq;

        if (tiltY < -340) {
            finalFreq = baseFreq * 1.0595; // Sharp
        } else if (tiltY > 340) {
            finalFreq = baseFreq * 0.9439; // Flat
        }

        // --- 4. SOUND OUTPUT & DYNAMIC VIBRATO ---
        if (effect === SoundEffect.Vibrato) {
            let timeMs = input.runningTime();

            // Vibrato speeds up as volume increases
            // 200ms cycle (quiet) -> 140ms cycle (loud)
            let cycleTimeMs = Math.map(vol, 30, 255, 200, 140);

            let angle = ((timeMs % cycleTimeMs) / cycleTimeMs) * 2 * Math.PI;
            let maxPitchShift = finalFreq * 0.015;
            let smoothShift = Math.sin(angle) * maxPitchShift;

            music.ringTone(Math.round(finalFreq + smoothShift));
        } else {
            music.ringTone(finalFreq);
        }
    }

    /**
     * Stops any continuous music playing.
     */
    //% block="🛑 stop music"
    //% group="Music"
    //% weight=70
    export function stopMusic(): void {
        music.ringTone(0);
    }
}