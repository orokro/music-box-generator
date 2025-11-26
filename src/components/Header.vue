<!--
	Header.vue
	----------

	Main header bar for the application along the top of the screen.

	Includes things such as:
	- The application title
	- Play button
	- Tempo box
	- Download .OBJ button
	- Save / Load project buttons
-->
<template>

	<!-- HEADER -->
	<header class="main-header">
			<h1>Music Box Drum Generator</h1>

			<div class="controls">

				<div class="playback-controls">
					<button @click="togglePlay">
						{{ store.isPlaying ? 'Stop' : 'Play' }}
					</button>
					<label>
						Tempo:
						<input
							type="number"
							v-model.number="store.drumSettings.tempo"
							min="40"
							max="240"
						>
					</label>
				</div>

				<div class="file-controls">
					<button @click="triggerDownloadObj">Download .OBJ</button>
					<button @click="saveProject">Save Project</button>
					<label class="upload-btn">
						Open Project
						<input
							type="file"
							accept=".json"
							@change="loadProject"
						>
					</label>
				</div>

			</div>
		</header>

</template>
<script setup>

// vue imports
import { useMusicStore } from '@stores/musicStore';
import { useAudio } from '@composables/useAudio';

// define some emits
const emits = defineEmits(["download-obj"]);

// get our store & hooks
const store = useMusicStore();
const audio = useAudio();


/**
 * Handle the play button to toggle playback
 */
const togglePlay = () => {

	if (store.isPlaying) {
		audio.stopPlayback();
	} else {
		audio.startPlayback();
	}
};


/**
 * Forward event to parent to trigger .OBJ download
 */
const triggerDownloadObj = () => {
	emits("download-obj");
};


/**
 * Save the current project to a JSON file
 */
const saveProject = () => {

	const name = prompt("Enter project name:", "MyMusicBox");
	if (name)
		store.saveProject(name);
};


/**
 * Handle loading a project from a JSON file
 *
 * @param event File input change event
 */
const loadProject = (event) => {

	const file = event.target.files[0];
	if (file)
		store.loadProject(file);
};

</script>
<style lang="scss" scoped>

	// main header bar a long the top of the screen
	.main-header {

		// fixed-height box on top of screen
		height: 60px;

		// box settings
		background: #111;
		border-bottom: 1px solid #333;
		padding: 0 20px;

		// layout
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;

		// stylet he title
		h1 {
			font-size: 1.2rem;
			color: #ff9800;
			margin: 0;
		}// h1

		// the box of controls on the right
		.controls {

			// layout
			display: flex;
			gap: 20px;

			// general button styles
			button {

				// box styles
				background: #333;
				border: 1px solid #555;
				padding: 5px 10px;

				// text settings
				color: white;

				// appear clickable & light up on hover
				cursor: pointer;
				&:hover { background: #444; }

			}// button

			// specific buttons
			.playback-controls, .file-controls {
				display: flex;
				gap: 10px;
				align-items: center;

			}// .playback-controls, .file-controls

			// upload button is styled around a file input, not a normal button
			.upload-btn {

				// box settings
				background: #333;
				border: 1px solid #555;
				padding: 5px 10px;

				// text settings
				font-size: 0.8rem;

				// appear clickable & light up on hover
				cursor: pointer;
				&:hover { background: #444; }

				// hide the actual file input b/c we're styling the label
				input { display: none; }

			}// .upload-btn

		}// .controls

	}// .main-header

</style>
