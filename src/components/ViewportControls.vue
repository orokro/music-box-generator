<!--
	ViewportControls.vue
	--------------------

	Provides some overlaid controls on top of the ThreeJS viewport for user interaction.

	For now, we just a way to pick the peg type.
-->
<template>

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

</template>
<script setup>

// vue imports
import { ref } from 'vue';
import { useMusicStore } from '@stores/musicStore';

// get the store
const store = useMusicStore();

</script>
<style lang="scss" scoped>

	// the main container for the viewport controls
	.viewport-controls {

		// fixed on top-left of the viewport, above the ThreeJS canvas
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 10;

		// box settings
		background: rgba(0,0,0,0.7);
		padding: 5px;
		border-radius: 4px;

	}// viewport-controls

</style>
