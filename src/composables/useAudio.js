import * as Tone from 'tone';
import { watch } from 'vue';
import { useMusicStore } from '../stores/musicStore';

export function useAudio() {
	const store = useMusicStore();

	// Create Synth
	const synth = new Tone.PolySynth(Tone.Synth, {
		oscillator: { type: "triangle" },
		envelope: {
			attack: 0.005,
			decay: 0.1,
			sustain: 0.1,
			release: 1
		},
		volume: -5 // Lower volume slightly to prevent clipping
	}).toDestination();

	let loop = null;

	const startPlayback = async () => {
		// --- CRITICAL FIX: FORCE AUDIO CONTEXT TO START ---
		// Browsers suspend audio until a user gesture.
		// We await this explicitly to ensure the internal clock starts ticking.
		try {
			await Tone.start();
			console.log('Audio Context is:', Tone.context.state);
		} catch (error) {
			console.error('Failed to start audio context:', error);
		}

		// Clean up old loop if exists
		if (loop) {
			loop.dispose();
		}

		// Reset visual position immediately
		store.currentStep = 0;
		let internalStepCounter = 0;

		// --- NEW APPROACH: Tone.Loop ---
		// Tone.Loop is more robust than Sequence for this specific use case.
		// It just ticks every "8n" (eighth note) forever, and we calculate the math.
		loop = new Tone.Loop((time) => {

			// 1. Calculate which step we are on (0 - 31)
			// Modulo (%) ensures it wraps around automatically (32 becomes 0)
			const stepIndex = internalStepCounter % store.totalSteps;

			// 2. Play Audio
			// We find all notes in the store that match this specific step
			const notesAtStep = store.placedNotes.filter(n => n.stepIndex === stepIndex);

			notesAtStep.forEach(note => {
				const noteName = store.noteRows[note.rowIndex].key;
				// triggerAttackRelease(note, duration, time)
				synth.triggerAttackRelease(noteName, "8n", time);
			});

			// 3. Update Visuals (Synced)
			// Tone.Draw ensures the UI updates exactly when the sound hits the speakers
			Tone.Draw.schedule(() => {
				store.currentStep = stepIndex;
			}, time);

			// 4. Increment counter for next tick
			internalStepCounter++;

		}, "8n");

		// Apply Tempo
		Tone.Transport.bpm.value = store.drumSettings.tempo;

		// Start everything
		loop.start(0);
		Tone.Transport.start();

		store.isPlaying = true;
		console.log('Playback started');
	};

	const stopPlayback = () => {
		Tone.Transport.stop();
		Tone.Draw.cancel(); // Clear pending visual updates

		if (loop) {
			loop.dispose();
			loop = null;
		}

		store.currentStep = -1;
		store.isPlaying = false;
		console.log('Playback stopped');
	};

	// Watch tempo changes live
	watch(() => store.drumSettings.tempo, (newTempo) => {
		Tone.Transport.bpm.rampTo(newTempo, 0.1);
	});

	return {
		startPlayback,
		stopPlayback
	};
}
