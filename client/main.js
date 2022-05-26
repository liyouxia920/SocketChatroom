import Vue from 'vue'
import App from './App'
import io from './components/weapp.socket.io.js';

Vue.config.productionTip = false
// 修改为你的服务器ip
Vue.prototype.socket = io('http://10.4.9.73:8081')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
