<template>
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="live-status-wrap left-layout">
      <div class="live-status">
        <div class="status-details">
          <div class="dataSiderList">
            <sideBorder sideTitle="银行基本信息">
              <div slot="sideBorderData" class="bank-info">
                <div>
                  <p>银行名称:</p>
                  <p>地址:</p>
                  <p>营业时间:</p>
                  <p>联系电话:</p>
                  <p>成立时间:</p>
                </div>
                <div class="info">
                  <p>{{ BankInfoData.name }}</p>
                  <p>{{ BankInfoData.address }}</p>
                  <p>周一至周五</p>
                  <p>{{ BankInfoData.telephone }}</p>
                  <p>{{ BankInfoData.startdate }}</p>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="银行金融数据">
              <div slot="sideBorderData" class="bank-finance-info">
                <div class="bank-deposit">
                  <p class="bank-deposit-title">本月存款额</p>
                  <div class="bank-deposit-block-wrap">
                    <p>{{ bankData.ckqs[0] }}<span>万元</span></p>
                    <div class="bank-deposit-block"></div>
                  </div>
                  <p class="bank-deposit-info-title">
                    <span>本月存款增长额</span>
                    <span class="bank-deposit-info-title-raio"
                      >本月/上月占比</span
                    >
                  </p>
                  <div class="bank-deposit-info">
                    <p>
                      {{ bankData.ck }}
                      <span>万元</span>
                    </p>
                    <p>{{ bankData.ckRate }}<span></span></p>
                  </div>
                </div>
                <div class="bank-loan">
                  <p class="bank-loan-title">本月贷款额</p>
                  <div class="bank-loan-block-wrap">
                    <p>{{ bankData.dkqs[0] }}<span>万元</span></p>
                    <div class="bank-loan-block"></div>
                  </div>
                  <p class="bank-loan-info-title">
                    <span>本月贷款增长额</span>
                    <span class="bank-loan-info-title-raio">本月/上月占比</span>
                  </p>
                  <div class="bank-loan-info">
                    <p>
                      {{ bankData.dk }}
                      <span>万元</span>
                    </p>
                    <p>{{ bankData.dkRate }}<span> </span></p>
                  </div>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="近半年存款贷款趋势图">
              <div
                slot="sideBorderData"
                class="depositTrend-charts chartsBlock"
              >
                <chart-block :option="depositTrendEchart"></chart-block>
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
            <sideBorder sideTitle="周边企业总览">
              <div slot="sideBorderData" class="firmOverview">
                <div class="firmOverview-left">
                  <div class="firmOverview-num-wrap">
                    <p class="line-title">企业总数</p>
                    <p class="firmOverview-num">
                      {{ firmDatasum }}
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
                          <td class="tableFrimName">{{ item.entname }}</td>
                          <td>{{ item.avgScore }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </sideBorder>
            <sideBorder sideTitle="周边企业信息">
              <div slot="sideBorderData" class="surrounding-charts chartsBlock">
                <div class="surrounding-right-table">
                  <table>
                    <thead>
                      <tr>
                        <th>公司名称</th>
                        <th>所属行业</th>
                        <th>公司地址</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in frimSurrounding"
                        :key="index"
                        @click="companyClick(item)"
                      >
                        <td>{{ item.entName }}</td>
                        <td>{{ item.industry }}</td>
                        <td>{{ item.regAddr }}</td>
                      </tr>
                    </tbody>
                  </table>
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
import {
  getBankInfo,
  getCompanyInfo,
  getBankData,
  getCompanyOverview,
} from "@/api/index";
const echarts = require("echarts");
export default {
  name: "BankInfo",
  components: { sideBorder },
  data() {
    return {
      searchData: {
        name: "",
        latitude: "",
        longitude: "",
      },
      BankInfoData: {},
      firmDatasum: "",
      depositTrendEchart: {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
          left: "0",
          right: "3%",
          top: "5%",
          bottom: "0",
          containLabel: true,
        },
        series: [
          {
            name: "贷款",
            type: "line",
            stack: "总量",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(44, 97, 203, 1)" },
                  { offset: 0.5, color: "rgba(16, 35, 72, 1)" },
                  { offset: 1, color: "#000" },
                ]),
                borderColor: "#71df6f", //拐点边框颜色
                borderWidth: 2, //拐点边框大小
              },
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "存款",
            type: "line",
            stack: "总量",
            areaStyle: {},
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#501725" },
                  { offset: 0.5, color: "#461421" },
                  { offset: 1, color: "#000" },
                ]),
                borderColor: "#71df6f", //拐点边框颜色
                borderWidth: 2, //拐点边框大小
              },
            },
            emphasis: {
              focus: "series",
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      },
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
      frimData: [],
      frimSurrounding: [
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
        { name: "1", value: "100" },
      ],
      companyClick(e) {
        this.bus.$emit("clickCompany", e);
      },
      bankData: {},
    };
  },
  created() {},
  mounted() {
    this.bus.$on("bankName", (val) => {
      this.searchData.name = val;
      this.getBankInfo();
      this.getBankData();
    });
    this.bus.$on("latLong", (val) => {
      this.searchData.latitude = val.lat;
      this.searchData.longitude = val.lng;
      this.getCompanyInfo();
      this.getCompanyOverview();
    });
  },
  methods: {
    getBankInfo() {
      getBankInfo(this.searchData).then((res) => {
        this.BankInfoData = res.data;
      });
    },
    getCompanyInfo() {
      getCompanyInfo(this.searchData).then((res) => {
        console.log(res);
        this.firmDatasum = res.data.length;
        this.frimSurrounding = res.data;
      });
    },
    getBankData() {
      getBankData(this.searchData).then((res) => {
        this.bankData = res.data;
        this.depositTrendEchart.xAxis.data = res.data.month.reverse();
        this.depositTrendEchart.series[0].data = res.data.ckqs.reverse();
        this.depositTrendEchart.series[1].data = res.data.dkqs.reverse();
      });
    },
    getCompanyOverview() {
      getCompanyOverview(this.searchData).then((res) => {
        console.log(res.data.top);
        this.frimData = res.data.top;
      });
    },
  },
  beforeDestroy() {
    // this.bus.$off(["bankName", "latLong"]);
  },
};
</script>

