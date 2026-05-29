type WinTier = 'win' | 'big' | 'mega';

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.08,
) {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

export const slotSounds = {
  setMuted(value: boolean) {
    muted = value;
  },
  isMuted() {
    return muted;
  },
  spinStart() {
    tone(220, 0.06, 'square', 0.04);
  },
  reelStop(index: number) {
    tone(140 + index * 40, 0.08, 'triangle', 0.06);
  },
  win(tier: WinTier) {
    if (tier === 'mega') {
      [440, 554, 659, 880].forEach((f, i) => {
        setTimeout(() => tone(f, 0.25, 'sine', 0.1), i * 90);
      });
      return;
    }
    if (tier === 'big') {
      [330, 440, 550].forEach((f, i) => {
        setTimeout(() => tone(f, 0.18, 'sine', 0.08), i * 70);
      });
      return;
    }
    tone(523, 0.15, 'sine', 0.07);
  },
  lose() {
    tone(110, 0.12, 'sawtooth', 0.03);
  },
};
