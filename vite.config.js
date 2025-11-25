import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	plugins: [vue({
		template: {
			compilerOptions: {
				// Treat any tag starting with 'Tres' as a custom element
				isCustomElement: (tag) => tag.startsWith('Tres') && tag !== 'TresCanvas',
			},
		},
	})],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	// CRITICAL FIX: Force Vite to pre-bundle these dependencies.
	// This resolves the "module specifier" error by creating explicit cache files
	// for these libraries, bypassing path resolution bugs in complex shells.
	optimizeDeps: {
		include: [
			'vue',
			'pinia',
			'@tresjs/core',
			'@tresjs/cientos',
			'three',
			'tone',
			'uuid',
			'file-saver'
		],
	},
})