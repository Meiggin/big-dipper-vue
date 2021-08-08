<template>
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="live-status-wrap left-layout">
      <div class="live-status">
        <div class="titlePubilc">
          <img class="titlePubilc-img" src="../../../assets/title.png" alt="" />
          <p class="title-bank">
            杭州市银行总数
            <span>1125</span>
            家
          </p>
          <p class="title-bank-add">
            当年新增
            <span>2家👆</span>
          </p>
        </div>
        <div class="status-details">
          <div class="dataSiderList">
            <sideBorder>
              <div slot="sideBorderData">
                <p>111</p>
              </div>
            </sideBorder>
            <sideBorder>
              <div slot="sideBorderData">
                <p>222</p>
              </div>
            </sideBorder>
            <sideBorder>
              <div slot="sideBorderData">
                <p>333</p>
              </div>
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
            <sideBorder>
              <div slot="sideBorderData">
                <p>111</p>
              </div>
            </sideBorder>
            <sideBorder>
              <div slot="sideBorderData">
                <p>222</p>
              </div>
            </sideBorder>
            <sideBorder>
              <div slot="sideBorderData">
                <p>333</p>
              </div>
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
  name: "BankDataPreview",
  components: { sideBorder },
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

