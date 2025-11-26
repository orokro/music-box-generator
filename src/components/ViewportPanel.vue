<!--
	ViewportPanel.vue
	-----------------

	Hosts the ThreeJS viewport along with controls for manipulating the view and peg types.
-->
<template>

	<!-- LEFT: 3D Viewport -->
	<div class="viewport-panel">

		<ViewportControls />

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

</template>
<script setup>

// vue imports
import { ref } from 'vue';
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';

// Components
import ViewportControls from '@components/ViewportControls.vue';
import MusicDrum from '@components/MusicDrum.vue';

// reference to the drum component
const drumRef = ref(null);

// provide a method to download the OBJ from the parent
defineExpose({

	downloadObj: () => {
		if (drumRef.value) {
			drumRef.value.downloadObj();
		}
	}
});

</script>
<style lang="scss" scoped>

	// panel for both viewport and controls widgets
	.viewport-panel {

		// make it fill the left half of the main content area
		flex: 1;
		position: relative;

		// make the TresCanvas fill this container
		.tres-canvas-responsive {

			width: 100% !important;
			height: 100% !important;
			display: block;

		}// .tres-canvas-responsive

	}// viewport-panel

</style>
