/*

*/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue({
		template: {
			compilerOptions: {
				// Treat any tag starting with 'Tres' as a custom element
				// This silences the "Failed to resolve component" warnings
				isCustomElement: (tag) => tag.startsWith('Tres') && tag !== 'TresCanvas',
			},
		},
	})],
});
