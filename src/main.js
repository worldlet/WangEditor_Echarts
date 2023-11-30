import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//引入echarts
import echarts from 'echarts/lib/echarts';
//vue全局注入echarts
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
