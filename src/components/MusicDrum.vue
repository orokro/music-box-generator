<!--
	MusicDrum.vue
	-------------

	3D representation of the cylinder.
	Handles procedural generation of the body and pegs.
-->
<template>
	<TresGroup ref="drumGroupRef" :rotation-z="Math.PI / 2">

		<!-- Main Cylinder Body -->
		<!-- args: [radiusTop, radiusBottom, height, radialSegments] -->
		<TresMesh>
			<TresCylinderGeometry
				:args="[radius, radius, settings.length, 64]"
			/>
			<TresMeshStandardMaterial color="#e0e0e0" />
		</TresMesh>

		<!-- Visual Indent (Lip) - represented as darker caps for now to save polys -->
		<TresMesh :position="[0, settings.length/2 + 0.01, 0]">
			<TresCylinderGeometry :args="[radius - settings.lipSize, radius - settings.lipSize, 0.1, 32]" />
			<TresMeshStandardMaterial color="#555" />
		</TresMesh>
		<TresMesh :position="[0, -settings.length/2 - 0.01, 0]">
			<TresCylinderGeometry :args="[radius - settings.lipSize, radius - settings.lipSize, 0.1, 32]" />
			<TresMeshStandardMaterial color="#555" />
		</TresMesh>

		<!-- Notes / Pegs -->
		<TresGroup>
			<template v-for="note in store.placedNotes" :key="note.id">
				<TresMesh
					:position="calculatePegPosition(note.rowIndex, note.stepIndex)"
					:rotation="calculatePegRotation(note.stepIndex)"
				>
					<!-- PEG GEOMETRY -->
					<TresCylinderGeometry
						v-if="settings.pegType === 'pegs'"
						:args="[0.3, 0.3, 1.5, 8]"
					/>

					<!-- HOLE GEOMETRY (Visual representation: Black cylinder slightly inset) -->
					<TresCylinderGeometry
						v-else-if="settings.pegType === 'holes'"
						:args="[0.3, 0.3, 0.5, 8]"
					/>

					<!-- RAMP GEOMETRY (Box rotated) -->
					<TresBoxGeometry
						v-else
						:args="[0.5, 1.5, 0.5]"
					/>

					<TresMeshStandardMaterial
						:color="settings.pegType === 'holes' ? '#111' : '#ff9800'"
					/>
				</TresMesh>
			</template>
		</TresGroup>

	</TresGroup>
</template>

<script setup>
// vue imports
import { computed, ref, watch } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import { saveAs } from 'file-saver';

// Store
const store = useMusicStore();
const settings = computed(() => store.drumSettings);

// Specs
const radius = computed(() => settings.value.diameter / 2);

// Expose the group for the parent to trigger export
const drumGroupRef = ref(null);

defineExpose({
	downloadObj: () => {
		if (!drumGroupRef.value) return;
		const exporter = new OBJExporter();
		const result = exporter.parse(drumGroupRef.value);
		const blob = new Blob([result], { type: 'text/plain' });
		saveAs(blob, 'music-box-drum.obj');
	}
});

// --- Calculations ---

// We map the 18 rows to the length of the cylinder
// We map the Time Steps (32) to the circumference (360 degrees)

const calculatePegPosition = (rowIndex, stepIndex) => {
	// Y axis in Local space is the length of the cylinder
	// X/Z axis is the circular placement

	// Calculate Y (Row position)
	// We need to spread 18 rows across 19.9mm length with some padding
	const usableLength = settings.value.length - 2; // 1mm padding each side
	const rowSpacing = usableLength / (store.noteRows.length - 1);
	const y = (rowIndex * rowSpacing) - (usableLength / 2);

	// Calculate Angle based on step
	const angleStep = (Math.PI * 2) / store.totalSteps;
	const angle = stepIndex * angleStep;

	// Convert Polar to Cartesian for X/Z
	// Radius needs to push it slightly out of the drum surface
	const r = radius.value + (settings.value.pegType === 'holes' ? -0.2 : 0.5);
	const x = r * Math.sin(angle);
	const z = r * Math.cos(angle);

	return [x, y, z];
};

const calculatePegRotation = (stepIndex) => {
	const angleStep = (Math.PI * 2) / store.totalSteps;
	const angle = stepIndex * angleStep;

	// Rotate object so it faces outward from center
	// Standard cylinder is vertical, so we rotate X to lay flat, then Z for angle
	// Actually easier to just Rotate Y if the peg is a cylinder pointing up

	return [0, -angle, Math.PI / 2]; // Approximation, requires tweaking based on geometry primitives
};

</script>

<style lang="scss" scoped>
	// No CSS needed for 3D component
</style>