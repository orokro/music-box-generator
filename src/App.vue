<!--
	App.vue
	-------

	Main Layout
-->
<template>

	<div class="app-layout">

		<!-- our Header Bar w/ Controls -->
		<Header
			@download-obj="triggerDownloadObj"
		/>

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
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';

// Components
import Header from './components/Header.vue';
import MusicDrum from './components/MusicDrum.vue';
import NoteTimeline from './components/NoteTimeline.vue';

// get the store
const store = useMusicStore();

// reference to the drum component
const drumRef = ref(null);

const triggerDownloadObj = () => {
	if (drumRef.value) {
		drumRef.value.downloadObj();
	}
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