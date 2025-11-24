import * as Tone from 'tone';
import { watch } from 'vue';
import { useMusicStore } from '../stores/musicStore';

export function useAudio() {
	const store = useMusicStore();

	// PolySynth is perfect for this. We use a "Synth" voice that sounds plucky.
	const synth = new Tone.PolySynth(Tone.Synth, {
		oscillator: {
			type: "triangle" // Triangle or Sine mimics music box best
		},
		envelope: {
			attack: 0.005,
			decay: 0.3,
			sustain: 0.0,
			release: 0.5
		}
	}).toDestination();

	// Sequencer Loop
	let loop = null;

	const initAudio = async () => {
		await Tone.start();
	};

	const startPlayback = async () => {
		await initAudio();

		if (loop) {
			loop.dispose();
		}

		// Create a sequence that runs every 16th note
		loop = new Tone.Sequence((time, step) => {
			store.currentStep = step;

			// Find notes at this step
			const notesAtStep = store.placedNotes.filter(n => n.stepIndex === step);

			notesAtStep.forEach(note => {
				const noteName = store.noteRows[note.rowIndex].key;
				// Play the note. 8n = eighth note duration
				synth.triggerAttackRelease(noteName, "8n", time);
			});

		}, [...Array(store.totalSteps.value).keys()], "8n");

		Tone.Transport.bpm.value = store.drumSettings.tempo;
		loop.start(0);
		Tone.Transport.start();
		store.isPlaying = true;
	};

	const stopPlayback = () => {
		Tone.Transport.stop();
		if (loop) {
			loop.dispose();
			loop = null;
		}
		store.currentStep = -1;
		store.isPlaying = false;
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