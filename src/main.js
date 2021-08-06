import Vue from 'vue'
import App from './App.vue'
import router from './router'
import echarts from 'echarts'
import './utils/mixins'
import './utils/flexible';
import {
  loading,

  borderBox8,
  borderBox1,
  decoration3,
  decoration5,
  decoration10,
  activeRingChart,
  fullScreenContainer
} from '@jiaminghi/data-view'

Vue.use(loading)
Vue.use(borderBox8)
Vue.use(borderBox1)
Vue.use(decoration3)
Vue.use(decoration5)
Vue.use(decoration10)
Vue.use(activeRingChart)
Vue.use(fullScreenContainer)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
