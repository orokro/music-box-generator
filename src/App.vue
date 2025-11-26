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
			<div class="viewport-panel-container">
				<ViewportPanel ref="drumRef" />
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

// Components
import Header from '@components/Header.vue';
import ViewportPanel from './components/ViewportPanel.vue';
import NoteTimeline from '@components/NoteTimeline.vue';

// reference to the drum component
const viewPanelRef = ref(null);

/**
 * Trigger the download of the OBJ from the ViewportPanel
 */
const triggerDownloadObj = () => {
	if (viewPanelRef.value) {
		viewPanelRef.value.downloadObj();
	}
};

</script>
<style lang="scss" scoped>

	// outermost app container
	.app-layout {

		// box size & settings
		height: 100vh;

		// lay out
		display: flex;
		flex-direction: column;

		/* MAIN CONTENT AREA: Split between Viewport and Timeline */
		.content-split {

			// layout
			flex: 1;
			display: flex;
			overflow: hidden;

			// Ensure children position correctly
			position: relative;

			// container for both viewport and timeline panels
			.viewport-panel-container {

				position: relative;

				// layout styles
				display: flex;
				flex: 0 0 40%;
				flex-direction: column;

			}// .viewport-panel-container

			// timeline panel on the right
			.timeline-panel {

				flex: 1;
				overflow: hidden;
				position: relative;

				// Ensure background color covers any gaps
				background: #222;

			}// timeline-panel

		}// .content-split

	}// .app-layout

</style>
