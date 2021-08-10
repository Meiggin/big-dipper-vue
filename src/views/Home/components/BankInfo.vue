<template>
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="live-status-wrap left-layout">
      <div class="live-status">
        <div class="status-details">
          <div class="dataSiderList">
            <sideBorder sideTitle="各区银行分布情况">
              <div
                slot="sideBorderData"
                class="bankDistributed-charts chartsBlock"
              ></div>
            </sideBorder>
            <sideBorder sideTitle="各类银行占比情况">
              <div
                slot="sideBorderData"
                class="bankProportion-charts chartsBlock"
              ></div>
            </sideBorder>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧状态 -->
    <div class="live-status-wrap right-layout">
      <div class="live-status">
        <div class="status-details">
          <div class="dataSiderList">
            <sideBorder sideTitle="企业总览">
              <div slot="sideBorderData" class="firmOverview"></div>
            </sideBorder>
            <sideBorder sideTitle="企业开户行占比">
              <div
                slot="sideBorderData"
                class="firmProBank-charts chartsBlock"
              ></div>
            </sideBorder>
            <sideBorder sideTitle="企业资本规模">
              <div
                slot="sideBorderData"
                class="capitalScale-charts chartsBlock"
              ></div>
            </sideBorder>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sideBorder from "@/components/sideBorder/index";
export default {
  name: "BankInfo",
  components: { sideBorder },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  beforeDestroy() {
    this.bus.$off(["isLeft"]);
  },
};
</script>

