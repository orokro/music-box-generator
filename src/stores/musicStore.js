import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';

export const useMusicStore = defineStore('musicBox', () => {

	// --- State: Drum Configuration ---
	const drumSettings = ref({
		diameter: 13, // mm
		length: 19.9, // mm
		lipSize: 0.4, // mm
		pegType: 'pegs', // 'holes', 'pegs', 'ramps'
		tempo: 120, // bpm
	});

	// --- State: Music Definition ---
	// The specific spread requested
	const noteRows = [
		{ label: 'C5',  key: 'C5' },
		{ label: 'E5',  key: 'E5' },
		{ label: 'F5',  key: 'F5' },
		{ label: 'G5',  key: 'G5' },
		{ label: 'A5',  key: 'A5' },
		{ label: 'A#5', key: 'A#5' },
		{ label: 'C6',  key: 'C6' },
		{ label: 'D6',  key: 'D6' },
		{ label: 'F6',  key: 'F6' },
		{ label: 'Gb6', key: 'Gb6' }, // Flat represented as b usually for libraries
		{ label: 'G6',  key: 'G6' },
		{ label: 'G#6', key: 'G#6' },
		{ label: 'A6',  key: 'A6' },
		{ label: 'A6',  key: 'A6' }, // Duplicate row as requested
		{ label: 'A#6', key: 'A#6' },
		{ label: 'C7',  key: 'C7' },
		{ label: 'D7',  key: 'D7' },
		{ label: 'D7',  key: 'D7' },
	];

	// Total length of the timeline (in "steps")
	const totalSteps = ref(32);

	// The active notes. Structure: { id, rowIndex, stepIndex }
	const placedNotes = ref([]);

	const isPlaying = ref(false);
	const currentStep = ref(-1);

	// --- Actions ---

	const toggleNote = (rowIndex, stepIndex) => {
		const existingIndex = placedNotes.value.findIndex(
			(n) => n.rowIndex === rowIndex && n.stepIndex === stepIndex
		);

		if (existingIndex !== -1) {
			placedNotes.value.splice(existingIndex, 1);
		} else {
			placedNotes.value.push({
				id: uuidv4(),
				rowIndex,
				stepIndex
			});
		}
	};

	const clearProject = () => {
		placedNotes.value = [];
		drumSettings.value.tempo = 120;
	};

	// --- I/O Actions ---

	const saveProject = (projectName) => {
		const data = {
			version: 1.0,
			settings: drumSettings.value,
			notes: placedNotes.value,
			steps: totalSteps.value
		};
		const blob = new Blob([JSON.stringify(data, null, '\t')], { type: 'application/json' });
		saveAs(blob, `${projectName || 'music-box'}.json`);
	};

	const loadProject = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target.result);
				if(data.settings) drumSettings.value = data.settings;
				if(data.notes) placedNotes.value = data.notes;
				if(data.steps) totalSteps.value = data.steps;
			} catch (err) {
				alert("Invalid JSON file");
			}
		};
		reader.readAsText(file);
	};

	return {
		drumSettings,
		noteRows,
		totalSteps,
		placedNotes,
		isPlaying,
		currentStep,
		toggleNote,
		saveProject,
		loadProject,
		clearProject
	};
});
