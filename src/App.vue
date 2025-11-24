<!--
	App.vue
	-------

	Main Layout
-->
<template>

	<div class="app-layout">

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
						<input type="number" v-model.number="store.drumSettings.tempo" min="40" max="240">
					</label>
				</div>

				<div class="file-controls">
					<button @click="triggerDownloadObj">Download .OBJ</button>
					<button @click="saveProject">Save Project</button>
					<label class="upload-btn">
						Open Project
						<input type="file" @change="loadProject" accept=".json">
					</label>
				</div>
			</div>
		</header>

		<!-- MAIN CONTENT -->
		<main class="content-split">
			<!-- LEFT: 3D Viewport -->
			<div class="viewport-panel">
				<div class="viewport-controls">
					<label>
						Peg Type:
						<select v-model="store.drumSettings.pegType">
							<option value="pegs">Pegs</option>
							<option value="holes">Holes</option>
							<option value="ramps">Ramps</option>
						</select>
					</label>
				</div>

				<!-- FIXED: Removed 'window-size' so it respects the parent div size -->
				<TresCanvas clear-color="#333" shadows class="tres-canvas-responsive">
					<TresPerspectiveCamera :position="[10, 10, 10]" :look-at="[0, 0, 0]" />
					<OrbitControls />

					<TresAmbientLight :intensity="0.5" />
					<TresDirectionalLight :position="[5, 10, 5]" :intensity="1" cast-shadow />

					<!-- The Drum Component -->
					<MusicDrum ref="drumRef" />

					<TresGridHelper :args="[20, 20]" />
				</TresCanvas>
			</div>

			<!-- RIGHT: Timeline -->
			<div class="timeline-panel">
				<NoteTimeline />
			</div>
		</main>
	</div>

</template>

<script setup>
// vue imports
import { ref } from 'vue';
import { useMusicStore } from './stores/musicStore';
import { useAudio } from './composables/useAudio';
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';

// Components
import MusicDrum from './components/MusicDrum.vue';
import NoteTimeline from './components/NoteTimeline.vue';

const store = useMusicStore();
const audio = useAudio();
const drumRef = ref(null);

const togglePlay = () => {
	if (store.isPlaying) {
		audio.stopPlayback();
	} else {
		audio.startPlayback();
	}
};

const triggerDownloadObj = () => {
	if (drumRef.value) {
		drumRef.value.downloadObj();
	}
};

const saveProject = () => {
	const name = prompt("Enter project name:", "MyMusicBox");
	if (name) store.saveProject(name);
};

const loadProject = (event) => {
	const file = event.target.files[0];
	if (file) store.loadProject(file);
};
</script>

<style lang="scss">
	/* Global Reset */
	* { box-sizing: border-box; }
	body { margin: 0; font-family: sans-serif; background: #1a1a1a; color: white; overflow: hidden; }

	.app-layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.main-header {
		height: 60px;
		background: #111;
		border-bottom: 1px solid #333;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		flex-shrink: 0; /* Prevent header from shrinking */

		h1 { font-size: 1.2rem; margin: 0; color: #ff9800; }

		.controls {
			display: flex;
			gap: 20px;

			button {
				background: #333;
				border: 1px solid #555;
				color: white;
				padding: 5px 10px;
				cursor: pointer;
				&:hover { background: #444; }
			}

			.playback-controls, .file-controls {
				display: flex;
				gap: 10px;
				align-items: center;
			}

			.upload-btn {
				background: #333;
				border: 1px solid #555;
				padding: 5px 10px;
				cursor: pointer;
				font-size: 0.8rem;
				&:hover { background: #444; }
				input { display: none; }
			}
		}
	}

	.content-split {
		flex: 1;
		display: flex;
		overflow: hidden;
		position: relative; /* Ensure children position correctly */
	}

	.viewport-panel {
		flex: 0 0 40%;
		border-right: 1px solid #333;
		position: relative;
		display: flex; /* Ensure canvas fills this */
		flex-direction: column;

		.viewport-controls {
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 10;
			background: rgba(0,0,0,0.7);
			padding: 5px;
			border-radius: 4px;
		}
	}

	/* Force Tres Canvas to behave */
	.tres-canvas-responsive {
		width: 100% !important;
		height: 100% !important;
		display: block;
	}

	.timeline-panel {
		flex: 1;
		overflow: hidden;
		position: relative;
		background: #222; /* Ensure background color covers any gaps */
	}
</style>