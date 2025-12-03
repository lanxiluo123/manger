import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routes/index';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/iconfont/iconfont.css';
const app = createApp(App)

app.use(ElementPlus)
app.use(router)


app.mount('#app')
