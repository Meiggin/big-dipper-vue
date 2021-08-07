<template>
  <!-- 全国用户详情 -->
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="data-overview left-layout">
      <dv-border-box-1 class="status-details" :style="{ height: height }">
        <p class="content-title">杭州市银行增长趋势</p>
        <div
          ref="bankGrowth"
          :style="{ height: '100px', width: '100%' }"
          id="bankGrowth"
        ></div>
      </dv-border-box-1>
      <dv-border-box-1 class="status-details" :style="{ height: height }">
        <p class="content-title">各区银行分布情况</p>
      </dv-border-box-1>
      <dv-border-box-1 class="status-details" :style="{ height: height }">
        <p class="content-title">各类银行占比情况</p>
      </dv-border-box-1>
    </div>
    <!-- 右侧状态 -->
    <div class="live-status right-layout">
      <dv-border-box-8 class="status-details" :style="{ height: height }">
        <p class="content-title">111</p>
      </dv-border-box-8>
      <dv-border-box-8 class="portrait-crowd" :style="{ height: height }">
        <p class="content-title">1122</p>
        <div class="content">
          <div id="crowdCanvas"></div>
        </div>
      </dv-border-box-8>
      <dv-border-box-8 class="channel-proportion" :style="{ height: height }">
        <p class="content-title">111</p>
        <div class="content"></div>
      </dv-border-box-8>
    </div>
  </div>
</template>

<script>
// 自定义排名轮播
// import ScrollRankingBoard from '@/components/ScrollRankingBoard/src/index'
export default {
  name: "UserDataPreview",
  // components: { ScrollRankingBoard },
  props: {
    riseImage: {
      type: String,
    },
    declineImage: {
      type: String,
    },
    height: {
      type: String,
      default: "",
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  mounted() {
    // setTimeout(() => {}, 700);
    this.setMyEchart();
  },
  methods: {
    setMyEchart() {
      const bankGrowth = this.$refs.bankGrowth; //通过ref获取到DOM节点
      if (bankGrowth) {
        const thisChart = this.$echarts.init(bankGrowth); //利用原型调取Echarts的初始化方法
        const option = {
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: "line",
            },
          ],
        }; //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
        thisChart.setOption(option); //将编写好的配置项挂载到Echarts上
        window.addEventListener("resize", function () {
          thisChart.resize(); //页面大小变化后Echarts也更改大小
        });
      }
    },
  },
};
</script>

