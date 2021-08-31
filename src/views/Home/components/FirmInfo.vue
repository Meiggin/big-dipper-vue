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
                  <p>社会信用代码:</p>
                  <p>联系电话:</p>
                  <p>所属行业:</p>
                </div>
                <div class="info">
                  <p>{{ companyInfo.entname }}</p>
                  <p>{{ companyInfo.regaddr }}</p>
                  <p>{{ companyInfo.regno }}</p>
                  <p>{{ companyInfo.telephone }}</p>
                  <p>{{ companyInfo.industry }}</p>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="企业潜力分析">
              <div slot="sideBorderData" class="enterprise-potential-analysis">
                <div class="firmPotential-top">
                  <div class="relation-echarts">
                    <chart-block :option="relationEchart"></chart-block>
                  </div>
                  <div class="relation-gauge">
                    <div class="relation-gauge-top">
                      <p class="line-title">行业资本排名</p>
                      <chart-block :option="industryEchart"></chart-block>
                    </div>
                    <div class="relation-gauge-bottom">
                      <p class="line-title">全市资本排名</p>
                      <chart-block :option="urbanEchart"></chart-block>
                    </div>
                  </div>
                </div>

                <div class="firmPotential-center">
                  <div class="firmPotential-center-top">
                    <p class="line-title">融资情况</p>
                    <table>
                      <thead>
                        <tr>
                          <th>融资轮次</th>
                          <th>融资金额</th>
                          <th>融资方</th>
                        </tr>
                      </thead>
                      <p v-if="financingData.length == 0">暂无信息</p>
                      <tbody v-else>
                        <tr v-for="(item, index) in financingData" :key="index">
                          <td>{{ item.dimension }}</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="firmPotential-center-bottom">
                    <p class="line-title">同业地位</p>
                    <div class="firmPotential-center-bottom-echart">
                      <chart-block :option="statusEchart"></chart-block>
                    </div>
                  </div>
                </div>

                <div class="firmPotential-bottom">
                  <p class="line-title">股东认缴出资占比排名</p>
                  <div class="firmPotential-bottom-echarts">
                    <chart-block :option="potentialEcharts"></chart-block>
                  </div>
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
              <div slot="sideBorderData">
                <div class="firmScore">
                  <div class="firmScore-left-wrap">
                    <div class="firmScore-left">
                      <chart-block :option="firmScoreEcharts"></chart-block>
                    </div>
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
                          <tr
                            v-for="(item, index) in dimensionData"
                            :key="index"
                          >
                            <td>{{ item.newName }}</td>
                            <td>{{ item.indicatorData }}</td>
                            <td>{{ item.random }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
                        <td v-if="item.name != '暂无数据'">{{ index + 1 }}</td>
                        <td v-if="item.name != '暂无数据'">{{ item.name }}</td>
                        <td v-if="item.name != '暂无数据'">{{ item.value }}</td>
                        <td rowspan="3" v-if="item.name == '暂无数据'">
                          {{ item.name }}
                        </td>
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
                    经营范围是指国家允许企业生产和经营的商品类别、品种及服务项目，是企业业务活动范围的法律界限，体现企业民事权利能力和行为能力的核心内容。
                  </p>
                  <p>
                    简单来说，经营范围是指企业可以从事的生产经营与服务项目，是进行公司注册申请时的必填项。
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
import axios from "axios";
const echarts = require("echarts");
import {
  getShareHolder,
  getCompanyInfoByRegNo,
  getCompanyAnalysis,
  getRealTimeIndex,
  getCompanyItem,
  getCompanyScore,
} from "@/api/index";
export default {
  name: "FirmInfo",
  props: ["frimData", "companyDetail"],
  components: { sideBorder },
  data() {
    return {
      financingData: [],
      dimensionData: [
        { name: "1", value: "100", dimension: "规模" },
        { name: "1", value: "100", dimension: "风险" },
        { name: "1", value: "100", dimension: "实力" },
        { name: "1", value: "100", dimension: "行业" },
        { name: "1", value: "100", dimension: "潜力" },
        { name: "1", value: "100", dimension: "综合" },
      ],
      ROOT_PATH:
        "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/les-miserables.json",
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
              width: 10,
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
                width: 10,
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
              fontSize: 12,
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
      statusEchart: {
        grid: {
          left: "0",
          right: "0",
          bottom: "0",
          top: 0,
        },
        series: [
          {
            label: {
              show: false,
            },
            type: "pie",
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: [
              { value: 40, name: "rose 1" },
              { value: 40, name: "rose 2" },
              { value: 40, name: "rose 3" },
              { value: 40, name: "rose 4" },
              { value: 40, name: "rose 5" },
              { value: 40, name: "rose 6" },
              { value: 40, name: "rose 7" },
              { value: 50, name: "rose 8" },
            ],
          },
        ],
      },
      firmScoreEcharts: {
        grid: {
          left: "0",
          right: "1%",
          top: "0",
          bottom: "0",
          containLabel: true,
        },
        radar: [
          {
            indicator: [
              { text: "规模", max: 100 },
              { text: "实力", max: 100 },
              { text: "潜力", max: 100 },
              { text: "行业", max: 100 },
              { text: "风险", max: 100 },
            ],
            radius: 80,
          },
        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "item",
            },
            areaStyle: {},
            data: [
              {
                value: [60, 73, 85, 40],
                name: "某软件",
              },
            ],
          },
        ],
      },
      potentialEcharts: {
        grid: {
          left: "1%",
          right: "3%",
          top: "0",
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          type: "value",

          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          type: "category",
          data: ["A", "B", "C", "D", "E"],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: [
          {
            type: "bar",
            showBackground: true,
            barWidth: 5,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
            data: [220, 182, 191, 234, 290],
          },
        ],
      },
      relationEchart: {},
      urbanEchart: {
        series: [
          {
            startAngle: 180, // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            endAngle: 0,
            splitNumber: null,
            type: "gauge",
            progress: {
              show: true,
              width: 10,
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
                width: 10,
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
              fontSize: 12,
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
      search: {
        regNo: "",
      },
      companyInfo: {},
    };
  },
  mounted() {
    this.getData();
    axios({
      method: "get",
      url: this.ROOT_PATH,
      dataType: "json",
      crossDomain: true,
      cache: false,
    }).then((res) => {
      res.data.nodes.forEach((node) => {
        node.symbolSize = node.symbolSize / 5;
      });
      this.relationEchart = {
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            name: "Les Miserables",
            type: "graph",
            layout: "none",
            data: res.data.nodes,
            links: res.data.links,
            categories: res.data.categories,
            roam: true,
            label: {
              normal: {
                show: false, // 是否显示标签
              },
            },
            edgeLabel: {
              // 连接两个关系对象的线上的标签
              normal: {
                show: false,
              },
            },
            lineStyle: {
              color: "source",
              curveness: 0.3,
            },
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 5,
              },
            },
          },
        ],
      };
    });
  },
  methods: {
    getData() {
      this.search = this.frimData;
      this.getCompanyInfoByRegNo();
      this.getCompanyAnalysis();
      this.getRealTimeIndex();
      this.getShareHolder();
      this.getCompanyScore();
      this.getCompanyItem();
      this.bus.$on("getCompanyDetail", (val) => {
        console.log(val);
      });
    },
    getCompanyInfoByRegNo() {
      getCompanyInfoByRegNo(this.search).then((res) => {
        this.companyInfo = res.data;
      });
    },

    getCompanyAnalysis() {
      getCompanyAnalysis(this.search).then((res) => {
        // this.companyInfo = res.data;
        this.industryEchart.series[0].data[0].value =
          res.data.industry.companyRegCapital;
        this.industryEchart.series[0].min = res.data.industry.index[0];
        this.industryEchart.series[0].max = res.data.industry.index[3];

        this.urbanEchart.series[0].data[0].value =
          res.data.city.companyRegCapital;
        this.urbanEchart.series[0].min = res.data.city.index[0];
        this.urbanEchart.series[0].max = res.data.city.index[3];
      });
    },
    getRealTimeIndex() {
      getRealTimeIndex(this.search).then((res) => {
        if (res.data.financing.length != 0) {
          this.financingData = res.data.financing;
        } else {
          this.financingData = [];
        }
      });
    },

    getShareHolder() {
      getShareHolder(this.search).then((res) => {
        this.potentialEcharts.yAxis.data = res.data.y;
        this.potentialEcharts.series.data = res.data.x;
      });
    },
    getCompanyScore() {
      getCompanyScore(this.search).then((res) => {
        res.data.indicator.map((item) => {
          item.text = item.name;
          let newName = item.name;
          item.newName = newName.split("(")[0];
        });
        for (let i in res.data.indicator) {
          res.data.indicator[i].indicatorData = res.data.data[i];
          let random = Math.round(Math.random() * 1000);
          res.data.indicator[i].random = random;
        }
        this.firmScoreEcharts.radar[0].indicator = res.data.indicator;
        this.firmScoreEcharts.series[0].data[0].value = res.data.data;
        this.dimensionData = res.data.indicator;
      });
    },
    getCompanyItem() {
      getCompanyItem(this.search).then((res) => {
        if (res.data.length == 0) {
          this.firmProductData = [
            {
              name: "暂无数据",
            },
          ];
        } else {
          this.firmProductData = res.data;
        }
      });
    },
  },
  watch: {
    companyDetail: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue); //父组件param对象改变会触发此函数
      },
      deep: true,
      immediate: true,
    },
  },
  beforeDestroy() {
    // this.bus.$off("clickCompany");
  },
};
</script>

