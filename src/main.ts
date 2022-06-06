import 'uno.css';
import 'ant-design-vue/dist/antd.css';


import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'

const app = createApp(App)

app.use(Antd).mount('#app')
