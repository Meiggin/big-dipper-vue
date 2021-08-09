
<template>
  <div :style="{ width: width, height: height }">
    <div ref="echart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
const echarts = require("echarts")
var ChartBlock = {
  name: "ChartBlock",
  props: {
    option: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      id: "chart",
      myChart: null,
    };
  },
  methods: {
    resize() {
      this.myChart.resize();
    },
  },
  watch: {
    option: {
      deep: true,
      handler() {
        if (this.myChart) {
          this.$nextTick(() => this.resize());
          this.myChart.setOption(this.option, true);
        }
      },
    },
  },
  computed: {
    width() {
      return this.option.width1 ? this.option.width1 : "100%";
    },
    height() {
      return this.option.height1 ? this.option.height1 : "100%";
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.echart,'drak');
      this.myChart.setOption(this.option);
      this.myChart.on("click", (params) => {
        this.$emit("click", params);
      });
    });
    window.addEventListener("resize", () => {
      this.resize();
    });
  },
};
/* istanbul ignore next */
ChartBlock.install = function (Vue) {
  Vue.component(ChartBlock.name, ChartBlock);
};
export default ChartBlock;
</script>