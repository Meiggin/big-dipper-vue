
(function () {
  let docEle = document.documentElement
  let screenRatioByDesign = 64 / 27
  function setHtmlFontSize() {
    var screenRatio = docEle.clientWidth / docEle.clientHeight;
    var fontSize = (
      screenRatio > screenRatioByDesign
        ? (screenRatioByDesign / screenRatio)
        : 1
    ) * docEle.clientWidth / 10;

    docEle.style.fontSize = fontSize.toFixed(3) + "px";
  }
  setHtmlFontSize()
  window.addEventListener('resize', setHtmlFontSize)
})();

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './utils/flexible';
import './assets/font/css/index.css'
import {
  loading,
  digitalFlop
} from '@jiaminghi/data-view'

import ChartBlock from '@/components/echarts/index.vue'
Vue.use(ChartBlock)
Vue.use(loading)
Vue.use(digitalFlop)

Vue.config.productionTip = false
Vue.prototype.bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
