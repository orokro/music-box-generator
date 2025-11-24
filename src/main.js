import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Tres from '@tresjs/core' // Import Tres
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Tres) // Register TresJS plugin
app.mount('#app')