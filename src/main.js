
(function (win) {
  var bodyStyle = document.createElement('style')
  bodyStyle.innerHTML = `body{width:7680px; height:3240px!important;}`
  document.documentElement.firstElementChild.appendChild(bodyStyle)

  function refreshScale() {
    let docWidth = document.documentElement.clientWidth;
    let docHeight = document.documentElement.clientHeight;
    var designWidth = 7680,
      designHeight = 3240,
      widthRatio = docWidth / designWidth,
      heightRatio = docHeight / designHeight;
    document.body.style = `transform:scale(${widthRatio},${heightRatio});transform-origin:left top;`;
    // 应对浏览器全屏切换前后窗口因短暂滚动条问题出现未占满情况
    setTimeout(function () {
      var lateWidth = document.documentElement.clientWidth,
        lateHeight = document.documentElement.clientHeight;
      if (lateWidth === docWidth) return;

      widthRatio = lateWidth / designWidth
      heightRatio = lateHeight / designHeight
      document.body.style = "transform:scale(" + widthRatio + "," + heightRatio + ");transform-origin:left top;"
    }, 0)
  }
  refreshScale()

  win.addEventListener("pageshow", function (e) {
    if (e.persisted) { // 浏览器后退的时候重新计算
      refreshScale()
    }
  }, false);
  win.addEventListener("resize", refreshScale, false);
})(window)
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import echarts from 'echarts'
import './utils/flexible';
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
