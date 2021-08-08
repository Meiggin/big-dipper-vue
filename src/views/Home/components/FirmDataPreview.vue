<template>
  <div class="device-data-preview">
    <div class="device-state left-layout">
      <div class="online-rate">
        <p class="content-title">全国设备状态</p>
        <div class="device-chart">
          <dv-active-ring-chart :config="deviceSateConfig" style="width:100%; height:200px" />
        </div>
      
      </div>
    
    </div>
    <!-- 右侧设备占比 -->
    <div class="data-proportion right-layout">
      <div class="real-time-Warning" :style="{'height': $parent.fullscreen ? height : '315px'}">
        <p class="content-title">实时预警</p>
      </div>
      <div class="proportion-type" :style="{'height': $parent.fullscreen ? height : '250px'}">
        <p class="content-title">设备类型占比</p>
        <div>
          <div id="proportionType" style="height: 230px"></div>
        </div>
      </div>
      <div class="model-type" :style="{'height': $parent.fullscreen ? height : '250px'}">
        <p class="content-title">人脸广告机型号占比</p>
        <div>
          <div id="modelType" style="height: 230px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 自定义排名轮播
export default {
  name: 'DeviceDataPreview',

  data () {
    return {

    }
  },

  mounted () {

  },
  
}
</script>
