<template>
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="live-status-wrap left-layout">
      <div class="live-status">
        <div class="status-details">
          <div class="dataSiderList">
            <sideBorder sideTitle="企业基本信息">
              <div slot="sideBorderData" class="bank-info">
                <div>
                  <p>企业名称:</p>
                  <p>地址:</p>
                  <p>统一社会信用代码:</p>
                  <p>联系电话:</p>
                  <p>所属行业:</p>
                </div>
                <div class="info">
                  <p>中国工商银行</p>
                  <p>西湖区文二路391号西湖国际科技大厦</p>
                  <p>周一至周五</p>
                  <p>13056874512</p>
                  <p>2008年</p>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="企业潜力分析">
              <div slot="sideBorderData" class="enterprise-potential-analysis">
                <div class="firmPotential-top">
                  <div class="relation-echarts"></div>
                  <div class="relation-gauge">
                    <div class="relation-gauge-top">
                      <p class="line-title">注册资本排名(同行业)</p>
                      <chart-block :option="industryEchart"></chart-block>
                    </div>
                    <div class="relation-gauge-bottom">
                      <p class="line-title">注册资本排名(全市)</p>
                      <chart-block :option="urbanEchart"></chart-block>
                    </div>
                  </div>
                </div>

                <div class="firmPotential-center">
                  <div class="firmPotential-center-top">
                    <p class="line-title">融资情况</p>
                  </div>
                  <div class="firmPotential-center-bottom">
                    <p class="line-title">同业地位</p>
                  </div>
                </div>

                <div class="firmPotential-bottom">
                  <p class="line-title">股东认缴出资占比排名</p>
                </div>
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
            <sideBorder sideTitle="企业评分">
              <div slot="sideBorderData" class="firmScore">
                <div class="firmScore-left-wrap">
                  <div class="firmScore-left"></div>
                  <p>浙江康旭科技评分表</p>
                </div>

                <div class="firmScore-right">
                  <div class="firmOverview-right-table">
                    <table>
                      <thead>
                        <tr>
                          <th class="rank">维度</th>
                          <th>评分</th>
                          <th class="score">排名</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in dimensionData" :key="index">
                          <td>{{ item.dimension }}</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="企业产品信息">
              <div slot="sideBorderData" class="firmProduct">
                <div class="firmProduct-table">
                  <table>
                    <thead>
                      <tr>
                        <th>公司名称</th>
                        <th>项目名称</th>
                        <th>成立时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in firmProductData" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="企业经营范围信息">
              <div slot="sideBorderData" class="business-scope">
                <div class="business-block">
                  <p>
                    经营范围是指国家允许企业生产和经营的商品类别、品种及服务项目，反映企业业务活动的内容和生产经营方向，是企业业务活动范围的法律界限，体现企业民事权利能力和行为能力的核心内容。
                    简单来说，经营范围是指企业可以从事的生产经营与服务项目，是进行公司注册申请时的必填项。
                    经营范围是指国家允许企业生产和经营的商品类别、品种及服务项目，反映企业业务活动的内容和生产经营方向。
                  </p>
                </div>
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
const echarts = require("echarts");
export default {
  name: "FirmInfo",
  components: { sideBorder },
  data() {
    return {
      dimensionData: [
        { name: "1", value: "100", dimension: "规模" },
        { name: "1", value: "100", dimension: "风险" },
        { name: "1", value: "100", dimension: "实力" },
        { name: "1", value: "100", dimension: "行业" },
        { name: "1", value: "100", dimension: "潜力" },
        { name: "1", value: "100", dimension: "综合" },
      ],
      firmProductData: [
        { name: "1", value: "100", dimension: "规模" },
        { name: "1", value: "100", dimension: "风险" },
        { name: "1", value: "100", dimension: "实力" },
        { name: "1", value: "100", dimension: "行业" },
        { name: "1", value: "100", dimension: "潜力" },
        { name: "1", value: "100", dimension: "综合" },
      ],
      industryEchart: {
        series: [
          {
            startAngle: 180, // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            endAngle: 0,
            splitNumber: null,
            type: "gauge",
            progress: {
              show: true,
              width: 18,
            },
            itemStyle: {
              color: "#d06c1d",
              shadowColor: "rgba(0,138,255,0.45)",
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            axisLine: {
              lineStyle: {
                width: 18,
              },
            },
            axisTick: {
              show: false,
            },

            pointer: {
              // 仪表盘指针。
              show: false, // 是否显示指针,默认 true。
            },
            detail: {
              show: true,
              fontSize: 20,
              offsetCenter: [0, 0],
            },
            data: [
              {
                value: 70,
              },
            ],
          },
        ],
      },
      urbanEchart: {
        series: [
          {
            startAngle: 180, // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            endAngle: 0,
            splitNumber: null,
            type: "gauge",
            progress: {
              show: true,
              width: 18,
            },
            itemStyle: {
              color: "#c04bd0",
              shadowColor: "rgba(0,138,255,0.45)",
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            axisLine: {
              lineStyle: {
                width: 18,
              },
            },
            axisTick: {
              show: false,
            },

            pointer: {
              // 仪表盘指针。
              show: false, // 是否显示指针,默认 true。
              length: "70%", // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
              width: 5, // 指针宽度,默认 8。
            },

            detail: {
              show: true,
              fontSize: 20,
              offsetCenter: [0, 0],
            },
            data: [
              {
                value: 60,
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {},
  beforeDestroy() {},
};
</script>

