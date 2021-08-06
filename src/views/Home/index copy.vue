<template>
  <div class="home-container">
    <!-- loading -->
    <div class="loading" v-if="isLoading">
      <dv-loading>Loading...</dv-loading>
    </div>
    <!-- 头部 -->
    <header>
      <!-- <div class="header-back">
        <div>
          <img class="img" src="@/assets/home_back.png" alt="">
        </div>
        <img class="full-img" @click="showFullScreen" src="@/assets/fullscreen.png" alt="">
      </div> -->
      <!-- <div class="header-city">
        <p>大屏</p>
        <dv-decoration-5 style="width: 300px; height: 40px" />
      </div> -->
      <!-- <div class="right">
        <div>
          <p :class="{'active': active === 2}" @click="handleChangeType(2)">用户分析</p>
          <p :class="{'active': active === 1}" @click="handleChangeType(1)">设备统计</p>
        </div>
        <dv-decoration-3 style="width:250px;height:30px;" />
      </div> -->
    </header>
    <dv-decoration-10 style="width: 100%; height: 5px" />

    <section ref="sectionRef">
      <!-- 地图 -->
      <div id="userMap" style="height: 100%"></div>
      <!-- 杭州用户数据 -->
      <!-- <div class="data-info">
        <ul>
          <li v-for="item in cityInfoList" :key="item.id"
              :class="[{'u-iotdoor': item.id === 'u-iotdoor'}, {'u-city': item.id === 'u-city'}, {'u-community': item.id === 'u-community'}]">
            <div>
              <span :class="[{'flop-figure': !isNaN(ls)}, {'flop-comma': isNaN(ls)}]" v-for="(ls, index) in item.valueArr" :key="item.id + index">
                <i v-if="!isNaN(ls)">0123456789</i>
                <span v-else>{{ls}}</span>
              </span>
              <div class="percentage">
                <img :src="item.type === 0 ? riseImage : declineImage" alt="">
                <span class="span" :class="{'decline': item.type === 1}">{{item.percentage}}</span>
              </div>
            </div>
            <div>{{item.name}}</div>
          </li>
        </ul>
      </div> -->
      <!-- <keep-alive>
        <UserDataPreview 
          ref="user"
          :height="height"
          :fullscreen="fullscreen"
          v-if="active === 2"
          :riseImage="riseImage"
          :declineImage="declineImage"
        ></UserDataPreview> 
        <DeviceDataPreview
          v-if="active === 1"
          :height="height"
          :fullscreen="fullscreen"
          :riseImage="riseImage"
          :declineImage="declineImage"
        ></DeviceDataPreview>
      </keep-alive> -->
    </section>
    <!-- 气泡详情 -->
    <!-- <div ref="popover" class="city-popover">
      <p class="popover-title">区域： {{ bubbleData.cityName }}</p>
      <div>
        <div>
          <canvas id="cityPopover" width="120px" height="120px"></canvas>
        </div>
        <div>
          <p>公司 &nbsp; {{ bubbleData.openUserCount }}</p>
          <p>数量 &nbsp; {{ bubbleData.communityCount }}</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// PointLayer, Popup
import { Scene } from "@antv/l7";
// import { WorldLayer } from "@antv/l7-district";
import { GaodeMap } from "@antv/l7-maps";
import { CityLayer } from "@antv/l7-district";
// import UserDataPreview from './components/UserDataPreview'
// import DeviceDataPreview from './components/DeviceDataPreview'
// import { cityData } from "../../utils/jsonData";
export default {
  name: "DataPreview",
  // components: { UserDataPreview, DeviceDataPreview },
  data() {
    return {
      active: 2,
      isLoading: false,
      fullscreen: false,
      height: "",
      cityInfoList: [],
      updateTime: "",
      riseImage: require("@/assets/rise.png"),
      declineImage: require("@/assets/decline.png"),
      bubbleData: {
        cityCode: "",
        cityName: "",
        proportion: "",
        communityCount: "",
        openUserCount: "",
        iotDoorControlCount: "",
      },
      colors: ["#B8E1FF", "#7DAAFF", "#3D76DD", "#0047A5", "#001D70"],
    };
  },
  mounted() {
    this.initUserMap();
    this.showLoading();
    this.setElementHeight();
    window.addEventListener("resize", this.setElementHeight);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this.setElementHeight);
    });
  },
  methods: {
    // 用户地图
    async initUserMap() {
      const response = await fetch(
        "https://gw.alipayobjects.com/os/bmw-prod/149b599d-21ef-4c24-812c-20deaee90e20.json"
      );
      const provinceData = await response.json();
      const dataValue = Object.keys(provinceData).map((key) => {
        return {
          code: key,
          name: provinceData[key][0],
          pop: provinceData[key][2] * 1,
        };
      });
      const scene = new Scene({
        id: "userMap",
        map: new GaodeMap({
          center: [120.19, 30.26],
          pitch: 0,
          style: "dark",
          mapStyle: "amap://styles/darkblue",
          zoom: 13,
          token: "ced0d726cd96553ba8b5b3521671aaf4",
        }),
      });
      scene.on("loaded", () => {
        const layer = new CityLayer(scene, {
          data: dataValue,
          joinBy: ["adcode", "code"],
          adcode: ["330000", "330100"],
          depth: 3,
          provinceStroke: "#fff",
          provinceStrokeWidth: 2,
          cityStroke: "#EBCCB4",
          cityStrokeWidth: 1,
          label: {
            color: "#fff",
            size: 12,
            field: "NAME_CHN",
            textAllowOverlap: false,
            stroke: "#000",
            strokeWidth: 0.5,
          },
          autoFit: true,
          fill: {
            color: { field: "pop", values: this.colors },
            activeColor: "#fff",
            style: {
              opacity: 0.2,
            },
          },
          // popup: {
          //   enable: true,
          //   Html: (props) => {
          //     console.log(props);
          //     return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`;
          //   },
          // },
        });
        
        layer.setActive(id);
        let row = layer.get('point');
        console.log(row);
        // const interval = setInterval( () =>{
        //   layer.updateLayerAttribute('fill', 'color', 'red');
        //   //do whatever here..
        // }, 1000);
        // layer.updateLayerAttribute('fill', 'color', 'red');
        // layer.on("click", (e) => {
        //   console.log(e);
        //   layer.updateDistrict(e.lngLat);
        //   layer.updateLayerAttribute("fill", "color", "red");
        // });
      });
    },
    // 用户城市气泡
    initUserPopover(arrList) {
      let canvas = document.getElementById("cityPopover");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //填充画布
      ctx.lineWidth = 8;
      let beginDeg = Math.PI * 1.5;
      let endDeg = Math.PI * 1.5;
      arrList.forEach((t, index) => {
        t.percentageData.forEach((l) => {
          endDeg = beginDeg + 2 * Math.PI * l.value;
          ctx.beginPath();
          ctx.strokeStyle = l.color;
          ctx.arc(60, 60, t.radius, beginDeg, endDeg, false);
          ctx.stroke();
          beginDeg = endDeg;
          ctx.closePath();

          ctx.moveTo(0, 0); //移动笔触到原点
          ctx.fillStyle = "white"; //文本颜色
          ctx.font = "12px normal ";
          ctx.textAlign = "right";
          ctx.fillText(`${(t.value * 100).toFixed(1)}%`, 55, (index + 1) * 16);
        });
      });
    },
    // 视图切换
    handleChangeType(val) {
      if (this.active === val) return;
      this.active = val;
      this.showLoading();
    },
    // 关闭延时器
    showLoading() {
      this.isLoading = true;
      this.timer = setTimeout(() => {
        this.isLoading = false;
        window.clearTimeout(this.timer);
      }, 1500);
    },
    // 全屏
    showFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 数字3位数加分隔符
    formatter(str) {
      let reg = /(?=(?!\b)(\d{3})+$)/g;
      return str.toString().replace(reg, ",");
    },
    // 设置DOM高度
    setElementHeight() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showLoading();
        this.height = `${(this.$refs.sectionRef.offsetHeight - 30) / 3}px`;
      }, 100);
    },
    // 设置文字滚动
    setNumberTransform(item) {
      const numberItems = document.querySelectorAll(`.${item.id}  i`);
      // const numberItems = this.$refs[`${item.id}`]
      const numberArr = item.valueArr.filter((item) => !isNaN(item));
      numberItems.forEach((t) => {
        t.style.transition = "transform 0s ease-in-out";
        t.style.transform = `translateY(-0%)`;
      });
      setTimeout(() => {
        numberItems.forEach((ls, index) => {
          ls.style.transition = "transform 0.8s ease-in-out";
          ls.style.transform = `translateY(-${numberArr[index] * 10}%)`;
        });
      }, 15);
    },
    // 定时
    initInterval(targetList, time) {
      const { setNumberTransform } = this;
      return setInterval(
        (function fn() {
          targetList.forEach((t) => {
            setTimeout(() => {
              setNumberTransform(t);
            }, 50);
          });
          return fn;
        })(),
        time
      );
    },
    // 定时刷新数字翻牌器
    timedRefresh(targetList, type) {
      let cityTimer;
      let userTimer;
      let deviceTimer;
      if (type === "city") {
        cityTimer = this.initInterval(targetList, 8000);
      } else if (type === "user") {
        userTimer = this.initInterval(targetList, 10000);
      } else if (type === "device") {
        deviceTimer = this.initInterval(targetList, 8000);
      }
      this.$once("hook:beforeDestroy", () => {
        clearInterval(cityTimer);
        clearInterval(userTimer);
        clearInterval(deviceTimer);
        userTimer = null;
        cityTimer = null;
        deviceTimer = null;
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl';
</style>
