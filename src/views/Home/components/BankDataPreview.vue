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
            <span>2家⬆</span>
          </p>
        </div>
        <div class="status-details">
          <div class="dataSiderList">
            <sideBorder :sideTitle="`${bankAddList.sideTitle}增长趋势`">
              <div slot="sideBorderData" class="bankAddLine-charts chartsBlock">
                <chart-block
                  :option="bankAddList"
                  ref="bankAddList"
                ></chart-block>
              </div>
            </sideBorder>
            <sideBorder sideTitle="各区银行分布情况" v-if="actionFlow == 0">
              <div
                slot="sideBorderData"
                class="bankDistributed-charts chartsBlock"
              >
                <chart-block
                  :option="bankDistributed"
                  ref="bankDistributed"
                ></chart-block>
              </div>
            </sideBorder>
            <sideBorder sideTitle="各银行概况" v-if="actionFlow == 1">
              <div slot="sideBorderData" class="bankKind-charts chartsBlock">
                <chart-block :option="bankKind"></chart-block>
              </div>
            </sideBorder>
            <sideBorder sideTitle="各类银行占比情况">
              <div
                slot="sideBorderData"
                class="bankProportion-charts chartsBlock"
              >
                <chart-block :option="bankProportion"></chart-block>
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
            <sideBorder sideTitle="企业总览">
              <div slot="sideBorderData" class="firmOverview">
                <div class="firmOverview-left">
                  <div class="firmOverview-num-wrap">
                    <p class="line-title">企业总数（杭州市）</p>
                    <p class="firmOverview-num">
                      {{ firmOverview.companyNum }}
                      <span>所</span>
                    </p>
                  </div>
                  <div class="firmOverview-echart-wrap">
                    <div class="firmOverview-num-wrap">
                      <p class="line-title">注册资本占比</p>
                    </div>
                    <div class="firmOverview-echart">
                      <chart-block
                        :option="firmOverview.firmPercentageList"
                      ></chart-block>
                    </div>
                  </div>
                </div>
                <div class="firmOverview-right">
                  <p>TOP10企业</p>
                  <div class="firmOverview-right-table">
                    <table>
                      <thead>
                        <tr>
                          <th class="rank">排名</th>
                          <th>名称</th>
                          <th class="score">评分</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in frimData" :key="index">
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="企业开户行占比">
              <div slot="sideBorderData" class="firmProBank-charts chartsBlock">
                <chart-block :option="firmProBank"></chart-block>
              </div>
            </sideBorder>
            <sideBorder sideTitle="企业资本规模">
              <div
                slot="sideBorderData"
                class="capitalScale-charts chartsBlock"
              >
                <chart-block :option="capitalScale"></chart-block>
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
import {
  getBankNumByStartTime,
  getAreaBankNumber,
  getBankNumRate,
  getCompanyOverview,
  getCompanyAccountRate,
} from "@/api/index.js";
export default {
  name: "BankDataPreview",
  components: { sideBorder },
  data() {
    return {
      actionFlow: 0,
      bankStr: "杭州市银行",
      //搜索集合
      searchList: {
        bankType: null,
      },
      //银行增长
      bankAddList: {
        sideTitle: "杭州市银行",
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#343434",
            },
          },

          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        itemStyle: {
          // 阴影的大小
          shadowBlur: 200,
          // 阴影水平方向上的偏移
          shadowOffsetX: 0,
          // 阴影垂直方向上的偏移
          shadowOffsetY: 0,
          // 阴影颜色
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#343434",
              type: "solid",
            },
          },
        },
        grid: {
          left: 30,
          top: 10,
          right: 0,
          bottom: 30,
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
      //银行分布情况
      bankDistributed: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["国有银行", "村镇银行", "股份银行", "城市银行"],
          orient: "horizontal",
          right: 0,
          width: 209,
          itemWidth: 33,
          itemHeight: 16,
          itemStyle: {
            width: "50px",
            opacity: "0.6",
          },
          textStyle: {
            color: "#b3b3b3",
            fontSize: "13px",
          },
        },
        grid: {
          left: "0",
          right: "0",
          top: "4%",
          bottom: "0",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: "#343434",
                type: "solid",
              },
            },
          },
        ],
        series: [
          {
            name: "国有银行",
            type: "bar",
            stack: "广告",
            emphasis: {
              focus: "series",
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "村镇银行",
            type: "bar",
            stack: "广告",
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "股份银行",
            type: "bar",
            stack: "广告",
            emphasis: {
              focus: "series",
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "城市银行",
            type: "bar",
            stack: "广告",
            emphasis: {
              focus: "series",
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
        ],
      },
      //各银行概况
      bankKind: {
        grid: {
          left: "1%",
          right: "1%",
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
            barWidth: 10,
            itemStyle: {
              emphasis: {
                barBorderRadius: 7,
              },
              normal: {
                barBorderRadius: 7,
              },
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
            data: [220, 182, 191, 234, 290, 330, 310, 123, 442],
          },
        ],
      },
      //银行占比情况
      bankProportion: {
        grid: {
          left: "0",
          right: "0",
          top: 0,
          bottom: "0",
          containLabel: true,
        },

        tooltip: {
          trigger: "item",
        },

        visualMap: {
          show: false,
          min: 80,
          max: 2000,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            type: "pie",
            radius: "80%",
            data: [
              { value: 335, name: "国有银行" },
              { value: 310, name: "股份银行" },
              { value: 274, name: "城市银行" },
              { value: 235, name: "村镇银行" },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "angle",
            label: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      },
      //企业总览注册资本占比
      firmOverview: {
        companyNum: "1500",
        firmPercentageList: {
          tooltip: {
            trigger: "item",
            confine: true,
          },
          grid: {
            left: "0",
            right: "0",
            bottom: "0",
            top: 0,
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 1048 },
                { value: 735 },
                { value: 580 },
                { value: 484 },
                { value: 300 },
              ],
            },
          ],
        },
      },
      //企业开户行占比
      firmProBank: {
        legend: {
          left: 0,
          orient: "vertical",
          itemWidth: 33,
          itemHeight: 16,
          textStyle: {
            color: "#b3b3b3",
            fontSize: "13px",
          },
        },
        series: [
          {
            type: "pie",
            radius: "90%",
            roseType: "area",
            label: {
              show: false,
            },
            right: "0",
            itemStyle: {
              borderRadius: 8,
            },
            data: [
              { value: 40, name: "国有银行" },
              { value: 38, name: "股份银行" },
              { value: 22, name: "城市银行" },
              { value: 18, name: "村镇银行" },
            ],
          },
        ],
      },
      //资本规模
      capitalScale: {
        tooltip: {
          position: "top",
        },
        title: [],
        singleAxis: [],
        series: [],
      },
      capitalScalehours: [
        "12a",
        "1a",
        "2a",
        "3a",
        "4a",
        "5a",
        "6a",
        "7a",
        "8a",
        "9a",
        "10a",
        "11a",
        "12p",
        "1p",
        "2p",
        "3p",
        "4p",
        "5p",
        "6p",
        "7p",
        "8p",
        "9p",
        "10p",
        "11p",
      ],
      capitalScaleDays: ["1", "2", "3", "4", "5", "6", "7"],
      capitalScaleData: [
        [0, 0, 5],
        [0, 1, 1],
        [0, 2, 0],
        [0, 3, 0],
        [0, 4, 0],
        [0, 5, 0],
        [0, 6, 0],
        [0, 7, 0],
        [0, 8, 0],
        [0, 9, 0],
        [0, 10, 0],
        [0, 11, 2],
        [0, 12, 4],
        [0, 13, 1],
        [0, 14, 1],
        [0, 15, 3],
        [0, 16, 4],
        [0, 17, 6],
        [0, 18, 4],
        [0, 19, 4],
        [0, 20, 3],
        [0, 21, 3],
        [0, 22, 2],
        [0, 23, 5],
        [1, 0, 7],
        [1, 1, 0],
        [1, 2, 0],
        [1, 3, 0],
        [1, 4, 0],
        [1, 5, 0],
        [1, 6, 0],
        [1, 7, 0],
        [1, 8, 0],
        [1, 9, 0],
        [1, 10, 5],
        [1, 11, 2],
        [1, 12, 2],
        [1, 13, 6],
        [1, 14, 9],
        [1, 15, 11],
        [1, 16, 6],
        [1, 17, 7],
        [1, 18, 8],
        [1, 19, 12],
        [1, 20, 5],
        [1, 21, 5],
        [1, 22, 7],
        [1, 23, 2],
        [2, 0, 1],
        [2, 1, 1],
        [2, 2, 0],
        [2, 3, 0],
        [2, 4, 0],
        [2, 5, 0],
        [2, 6, 0],
        [2, 7, 0],
        [2, 8, 0],
        [2, 9, 0],
        [2, 10, 3],
        [2, 11, 2],
        [2, 12, 1],
        [2, 13, 9],
        [2, 14, 8],
        [2, 15, 10],
        [2, 16, 6],
        [2, 17, 5],
        [2, 18, 5],
        [2, 19, 5],
        [2, 20, 7],
        [2, 21, 4],
        [2, 22, 2],
        [2, 23, 4],
        [3, 0, 7],
        [3, 1, 3],
        [3, 2, 0],
        [3, 3, 0],
        [3, 4, 0],
        [3, 5, 0],
        [3, 6, 0],
        [3, 7, 0],
        [3, 8, 1],
        [3, 9, 0],
        [3, 10, 5],
        [3, 11, 4],
        [3, 12, 7],
        [3, 13, 14],
        [3, 14, 13],
        [3, 15, 12],
        [3, 16, 9],
        [3, 17, 5],
        [3, 18, 5],
        [3, 19, 10],
        [3, 20, 6],
        [3, 21, 4],
        [3, 22, 4],
        [3, 23, 1],
        [4, 0, 1],
        [4, 1, 3],
        [4, 2, 0],
        [4, 3, 0],
        [4, 4, 0],
        [4, 5, 1],
        [4, 6, 0],
        [4, 7, 0],
        [4, 8, 0],
        [4, 9, 2],
        [4, 10, 4],
        [4, 11, 4],
        [4, 12, 2],
        [4, 13, 4],
        [4, 14, 4],
        [4, 15, 14],
        [4, 16, 12],
        [4, 17, 1],
        [4, 18, 8],
        [4, 19, 5],
        [4, 20, 3],
        [4, 21, 7],
        [4, 22, 3],
        [4, 23, 0],
        [5, 0, 2],
        [5, 1, 1],
        [5, 2, 0],
        [5, 3, 3],
        [5, 4, 0],
        [5, 5, 0],
        [5, 6, 0],
        [5, 7, 0],
        [5, 8, 2],
        [5, 9, 0],
        [5, 10, 4],
        [5, 11, 1],
        [5, 12, 5],
        [5, 13, 10],
        [5, 14, 5],
        [5, 15, 7],
        [5, 16, 11],
        [5, 17, 6],
        [5, 18, 0],
        [5, 19, 5],
        [5, 20, 3],
        [5, 21, 4],
        [5, 22, 2],
        [5, 23, 0],
        [6, 0, 1],
        [6, 1, 0],
        [6, 2, 0],
        [6, 3, 0],
        [6, 4, 0],
        [6, 5, 0],
        [6, 6, 0],
        [6, 7, 0],
        [6, 8, 0],
        [6, 9, 0],
        [6, 10, 1],
        [6, 11, 0],
        [6, 12, 2],
        [6, 13, 1],
        [6, 14, 3],
        [6, 15, 4],
        [6, 16, 0],
        [6, 17, 0],
        [6, 18, 0],
        [6, 19, 0],
        [6, 20, 1],
        [6, 21, 2],
        [6, 22, 2],
        [6, 23, 6],
      ],
      frimData: [
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
      ],
    };
  },
  mounted() {
    // this.$refs.bankAddLine.setOption(this.option);
    this.getData();
    this.capitalScaleDays.forEach((day, idx) => {
      this.capitalScale.title.push({
        textBaseline: "middle",
        top: ((idx + 0.5) * 100) / 7 + "%",
        text: day,
      });
      this.capitalScale.singleAxis.push({
        left: 100,
        type: "category",
        boundaryGap: false,
        data: this.capitalScalehours,
        top: (idx * 100) / 7 + 5 + "%",
        height: 100 / 7 - 10 + "%",
        axisLabel: {
          interval: 2,
        },
      });
      this.capitalScale.series.push({
        singleAxisIndex: idx,
        coordinateSystem: "singleAxis",
        type: "scatter",
        data: [],
        symbolSize: (dataItem) => {
          return dataItem[1] * 2;
        },
      });
    });
    let data = this.capitalScaleData;
    data.forEach((dataItem) => {
      this.capitalScale.series[dataItem[0]].data.push([
        dataItem[1],
        dataItem[2],
      ]);
    });
  },
  methods: {
    ifBankTitle(value) {
      if (value == 0) {
        this.bankStr = "国有银行";
      } else if (value == 1) {
        this.bankStr = "股份银行";
      } else if (value == 2) {
        this.bankStr = "城市银行";
      } else if (value == 3) {
        this.bankStr = "村镇银行";
      }
    },
    getData() {
      this.bus.$on("bankType", (val) => {
        if (val != null) {
          if (this.searchList.bankType != val) {
            this.searchList.bankType = val;
            this.ifBankTitle(this.searchList.bankType);
            this.bankAddList.sideTitle = this.bankStr;
            this.getBankNumByStartTime();
            this.getAreaBankNumber();
            this.getBankNumRate();
            // 右侧
            this.getCompanyOverview();
            this.getCompanyAccountRate();
          } else {
            this.searchList.bankType = val;
          }
        } else {
          this.bankAddList.sideTitle = "杭州市银行";
        }
      });
      this.bus.$on("actionFlow", (val) => {
        this.actionFlow = val;
      });
      // 左侧
      this.getBankNumByStartTime();
      this.getAreaBankNumber();
      this.getBankNumRate();
      // 右侧
      this.getCompanyOverview();
      this.getCompanyAccountRate();
    },
    getBankNumByStartTime() {
      let data = this.searchList;
      getBankNumByStartTime(data).then((res) => {
        this.bankAddList.xAxis = res.data.xAxis;
        this.bankAddList.series = res.data.series;
        this.bankAddList.series[0].type = "line";
        this.bankAddList.sideTitle = this.bankStr + "增长趋势";
      });
    },
    getAreaBankNumber() {
      let data = this.searchList;
      getAreaBankNumber(data).then((res) => {
        this.bankDistributed.xAxis = res.data.xAxis;
        this.bankDistributed.series = res.data.series;
      });
    },
    getBankNumRate() {
      getBankNumRate().then((res) => {
        // bankProportion;
        this.bankProportion.series[0].data = res.data.data.sort(function (
          a,
          b
        ) {
          return a.value - b.value;
        });
      });
    },
    getCompanyOverview() {
      getCompanyOverview().then((res) => {
        // this.firmOverview.companyNum.number = [];
        this.firmOverview.companyNum = res.data.companyNum;
        for (let i in res.data.rate) {
          res.data.rate[i].value = res.data.rate[i].num;
        }
        this.firmOverview.firmPercentageList.series[0].data = res.data.rate;
      });
    },
    getCompanyAccountRate() {
      getCompanyAccountRate().then((res) => {
        console.log(res);
        for (let i in res.data) {
          res.data[i].value = res.data[i].num;
        }
        this.firmProBank.series[0].data = res.data;
      });
    },
  },
  beforeDestroy() {
    this.bus.$off(["isLeft"]);
  },
};
</script>

