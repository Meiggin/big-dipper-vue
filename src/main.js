
(function () {
  let docEle = document.documentElement
  let screenRatioByDesign = 64 / 27
  function setHtmlFontSize() {
    var screenRatio = docEle.clientWidth / docEle.clientHeight;
    console.log(screenRatio, screenRatioByDesign)
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
import echarts from 'echarts'
import './utils/flexible';
import './assets/font/css/index.css'
import {
  loading,
} from '@jiaminghi/data-view'

Vue.use(loading)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
