import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
