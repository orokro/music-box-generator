<!--
	NoteTimeline.vue
	----------------

	2D Grid for placing notes.
-->
<template>

	<div class="timeline-container">

		<div class="timeline-header">
			<div class="row-labels">
				<!-- Empty corner -->
			</div>
			<div class="step-markers">
				<div
					v-for="i in store.totalSteps"
					:key="i"
					class="step-marker"
					:class="{ active: store.currentStep === (i - 1) }"
				>
					{{ i }}
				</div>
			</div>
		</div>

		<div class="timeline-body">
			<div
				v-for="(row, rIndex) in store.noteRows"
				:key="row.key + rIndex"
				class="timeline-row"
			>
				<!-- Note Label -->
				<div class="row-label">
					<select>
						<option selected>{{ row.label }}</option>
					</select>
				</div>

				<!-- Grid Cells -->
				<div class="row-cells">
					<div
						v-for="sIndex in store.totalSteps"
						:key="sIndex"
						class="cell"
						:class="{
							filled: isNoteActive(rIndex, sIndex - 1),
							playing: store.currentStep === (sIndex - 1)
						}"
						@mousedown="handleCellClick(rIndex, sIndex - 1)"
						@mouseenter="handleDrag(rIndex, sIndex - 1)"
					></div>
				</div>
			</div>
		</div>
	</div>

</template>
<script setup>

// vue imports
import { ref } from 'vue';
import { useMusicStore } from '../stores/musicStore';

const store = useMusicStore();
const isDragging = ref(false);

const isNoteActive = (rIndex, sIndex) => {
	return store.placedNotes.some(
		n => n.rowIndex === rIndex && n.stepIndex === sIndex
	);
};

const handleCellClick = (rIndex, sIndex) => {
	isDragging.value = true;
	store.toggleNote(rIndex, sIndex);

	// Global mouse up listener to stop drag
	window.addEventListener('mouseup', () => {
		isDragging.value = false;
	}, { once: true });
};

const handleDrag = (rIndex, sIndex) => {
	if (isDragging.value) {
		// Only add, don't toggle (remove) during drag to prevent flickering
		const exists = isNoteActive(rIndex, sIndex);
		if (!exists) {
			store.toggleNote(rIndex, sIndex);
		}
	}
};
</script>

<style lang="scss" scoped>
	$cell-size: 25px;
	$label-width: 80px;

	.timeline-container {
		display: flex;
		flex-direction: column;
		background: #222;
		color: #eee;
		padding: 10px;
		overflow-x: auto;
		height: 100%;
		border-left: 1px solid #444;

		/* Scrollbar styling */
		&::-webkit-scrollbar {
			height: 8px;
			background: #111;
		}
		&::-webkit-scrollbar-thumb {
			background: #555;
			border-radius: 4px;
		}
	}

	.timeline-header {
		display: flex;
		margin-bottom: 5px;

		.row-labels {
			width: $label-width;
			flex-shrink: 0;
		}

		.step-markers {
			display: flex;

			.step-marker {
				width: $cell-size;
				text-align: center;
				font-size: 0.7rem;
				color: #666;
				border-left: 1px solid #333;

				&.active {
					background-color: #ff9800;
					color: #000;
				}
			}
		}
	}

	.timeline-row {
		display: flex;
		height: $cell-size;
		border-bottom: 1px solid #333;

		&:nth-child(odd) {
			background: rgba(255, 255, 255, 0.02);
		}

		.row-label {
			width: $label-width;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			border-right: 1px solid #444;

			select {
				background: #333;
				color: #fff;
				border: none;
				font-size: 0.8rem;
				width: 90%;
			}
		}

		.row-cells {
			display: flex;

			.cell {
				width: $cell-size;
				height: 100%;
				border-right: 1px solid #333;
				cursor: pointer;
				transition: background 0.1s;

				&:hover {
					background: #444;
				}

				&.filled {
					background: #4caf50;
					box-shadow: inset 0 0 0 1px #2e7d32;
				}

				&.playing {
					background: rgba(255, 152, 0, 0.3);

					&.filled {
						background: #ffeb3b; // Highlight filled note being played
					}
				}
			}
		}
	}
</style>