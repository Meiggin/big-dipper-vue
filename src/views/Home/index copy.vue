<template>
  <div class="home-container">
    <!-- loading -->
    <div class="loading" v-if="isLoading">
      <dv-loading>Loading...</dv-loading>
    </div>
    <!-- 头部 -->
    <!-- <div class="header-back">
        <div>
          <img class="img" src="@/assets/home_back.png" alt="" />
        </div>
        <img
            class="full-img"
            @click="showFullScreen"
            src="@/assets/fullscreen.png"
            alt=""
          />
      </div> -->

    <section ref="sectionRef">
      <!-- 地图 -->
      <div id="userMap" class="markerClass" style="height: 100%"></div>
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
      <keep-alive>
        <p>杭州银行</p>
        <!-- <UserDataPreview
          ref="user"
          :height="height"
          :fullscreen="fullscreen"
          :riseImage="riseImage"
          :declineImage="declineImage"
        ></UserDataPreview> -->
        <!-- <DeviceDataPreview
          :height="height"
          :fullscreen="fullscreen"
          :riseImage="riseImage"
          :declineImage="declineImage"
        ></DeviceDataPreview> -->
      </keep-alive>
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
import AMapLoader from "@amap/amap-jsapi-loader";
// import UserDataPreview from "./components/UserDataPreview";
// import DeviceDataPreview from "./components/DeviceDataPreview";
import axios from "axios";
import { Scene, PointLayer } from "@antv/l7";
export default {
  name: "DataPreview",
  // components: { UserDataPreview },
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
      colors: {},
      overlaysList: [],
      AMap: null,
    };
  },
  mounted() {
    this.initUserMap();
    this.setElementHeight();
    this.showLoading();
    window.addEventListener("resize", this.setElementHeight);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this.setElementHeight);
    });
  },
  methods: {
    // 关闭延时器
    showLoading() {
      this.isLoading = true;
      this.timer = setTimeout(() => {
        this.isLoading = false;
        window.clearTimeout(this.timer);
      }, 1500);
    },
    // 设置DOM高度
    setElementHeight() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showLoading();
        this.height = `${(this.$refs.sectionRef.offsetHeight - 50) / 3}px`;
      }, 100);
    },
    // 用户地图

    async initUserMap() {
      AMapLoader.load({
        key: "7613cd9072618326abc496f33fa660f1",
        version: "2.0",
        plugins: ["AMap.Geocoder,AMap.DistrictLayer"],
        AMapUI: {
          version: "1.1",
          plugins: ["overlay/SimpleMarker"],
        },
        Loca: {
          // 是否加载 Loca， 缺省不加载
          version: "2.0.0", // Loca 版本，缺省 1.3.2
        },
      })
        .then((AMap) => {
          this.AMap = AMap;
          this.mapValue = new this.AMap.Map("userMap", {
            center: [120.19, 30.26],
            mapStyle: "amap://styles/2ed665608ffdc0b14627b0eeb7c5b68c",
            // viewMode: '3D'
            resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
            expandZoomRange: true, // 是否支持可以扩展最大缩放级别,和zooms属性配合使用设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
            // gestureHandling: "greedy",//谷歌里面的// hybrid包含卫星和地名
            // zooms: 8,
            // zooms: [9, 20],
            defaultCursor: "pointer", // 变成小手 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
            showLabel: true, // 显示地图文字标记
          });
          this.AMap.plugin("AMap.DistrictSearch", () => {
            this.district = new this.AMap.DistrictSearch({
              extensions: "all",
              level: "city",
            });
            this.districtPolygon();
          });

          this.mapValue.on("zoomend", (e) => {
            let currentZoom = this.mapValue.getZoom();
            console.log(e.pixel);
            if (currentZoom <= 10) {
              // this.mapValue.clearMap();
              // this.districtPolygon();
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    districtPolygon() {
      this.district.search("杭州市", (status, result) => {
        const [bounds, mask] = [result.districtList[0].boundaries, []];
        if (bounds) {
          for (let x = 0, l = bounds.length; x < l; x++) {
            let polygon = new this.AMap.Polygon({
              map: this.mapValue,
              strokeWeight: 5,
              strokeOpacity: 1,
              strokeColor: "#4d4d4d",
              path: bounds[x],
              fillOpacity: 0,
              fillColor: "#000",
              id: x,
            });
            this.polygon = polygon;
            // polygon.on("mouseover", (e) => {
            //   console.log(e);
            //   let px = e.pixel;
            //   // 拾取所在位置的行政区
            //   let props = disProvince.getDistrictByContainerPos(px);
            //   console.log(props);
            //   if (props) {
            //     let SOC = props.SOC;
            //     if (SOC) {
            //       // 重置行政区样式
            //       disProvince.setStyles({
            //         // 国境线
            //         //nation-stroke': nationStroke,
            //         // 海岸线
            //         //'coastline-stroke': '',
            //         // fill: function (props)=> {
            //         //   return props[];
            //         // },
            //       });
            //     }
            //   }
            // });
            mask.push(polygon);
          }
          this.mapValue.add(mask);
          this.mapValue.setFitView(); //视口自适应
        }
        const map = this.mapValue;
        // const disProvince = new AMap.DistrictLayer.Province({
        //   adcode: ["330100"],
        //   depth: 2,
        //   styles: {
        //     fill: function (properties) {
        //       let adcode = properties.adcode;
        //       return getColorByAdcode(adcode);
        //     },
        //     "province-stroke": "#09b8bf",
        //     "city-stroke": "#09b8bf",
        //     "county-stroke": "#4d4d4d", //线条颜色
        //   },
        // });
        // this.disProvince = disProvince;
        // disProvince.setMap(map);
        // const getColorByAdcode = (adcode) => {
        //   if (!this.colors[adcode]) {
        //     this.colors[adcode] = "rgba(0,0,0,0)";
        //   }
        //   return this.colors[adcode];
        // };
        const layer = new Loca.PolygonLayer({
          map: map,
        });

        let citys = [
          { lnglat: [116.486409, 39.921489], name: "朝阳区", style: 2 },
          { lnglat: [116.286968, 39.863642], name: "丰台区", style: 2 },
          { lnglat: [116.195445, 39.914601], name: "石景山区", style: 2 },
          { lnglat: [116.310316, 39.956074], name: "海淀区", style: 2 },
          { lnglat: [116.105381, 39.937183], name: "门头沟区", style: 2 },
        ];

        layer.setData(citys, {
          lnglat: "lnglat",
        });

        layer.setOptions({
          style: {
            color: "#4FC2FF",
            borderColor: "#4FC2FF",
            borderWidth: 1,
            opacity: 0.9,
          },
        });

        // 渲染
        layer.render();
        //散点
        // var loca = new Loca.Container({
        //   map,
        // });

        // var pl = (window.pl = new Loca.PointLayer({
        //   zIndex: 100,
        //   opacity: 1,
        //   blend: "normal",
        // }));

        // var geo = new Loca.GeoJSONSource({
        //   url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/gdp.json",
        // });
        // pl.setSource(geo);
        // var colors = [
        //   "rgba(254,255,198,0.95)",
        //   "rgba(255,238,149,0.95)",
        //   "rgba(255,217,99,0.95)",
        //   "rgba(255,175,43,0.95)",
        //   "rgba(255,135,24,0.95)",
        //   "rgba(234,10,0,0.95)",
        //   "rgba(195,0,0,0.95)",
        //   "rgba(139,0,0,0.95)",
        // ];

        // var style = {
        //   unit: "meter",
        //   radius: (index, f) => {
        //     var n = f.properties["人口"];
        //     return n * 10;
        //   },
        //   color: (index, f) => {
        //     var n = Math.min(7, ~~(f.properties["人均GDP"] / 10000));
        //     return colors[n];
        //   },
        //   borderWidth: 0,
        //   blurRadius: -1,
        // };

        // pl.setStyle(style);
        // loca.add(pl);

        // // 动画
        // map.on("complete", function () {
        //   pl.addAnimate({
        //     key: "radius",
        //     value: [0, 1],
        //     duration: 2000,
        //     easing: "ElasticOut",
        //     // yoyo: false,
        //     // repeat: 1,
        //   });
        //   pl.show(600);
        // });

        // map.on("mousemove", (e) => {
        //   const feat = pl.queryFeature(e.pixel.toArray());
        //   if (feat) {
        //     pl.setStyle({
        //       unit: "meter",
        //       radius: (index, f) => {
        //         var n = f.properties["人口"] * 100;
        //         if (f === feat) {
        //           return n + 3;
        //         }
        //         return n;
        //       },
        //       color: (index, f) => {
        //         var n = Math.min(7);
        //         return colors[n];
        //       },
        //       borderWidth: (index, f) => {
        //         return f === feat ? 100 : 0;
        //       },
        //       blurWidth: -1,
        //     });
        //   }
        // });
      });
    },
    regeoCode() {
      // this.mapValue = new this.AMap.Geocoder
    },
    polygonClick() {
      this.polygon.on("click", (e) => {
        // const { lng, lat } = e.lnglat;
        // let currentZoom = this.mapValue.getZoom();
        // let overlaysList = this.mapValue.getAllOverlays("polygon");
        let overlaysList = this.mapValue.getAllOverlays("polygon");
        console.log(overlaysList);
        // if (overlaysList.length != 1) {
        //   this.mapValue.clearMap();
        // }
        // let geocoder = new this.AMap.Geocoder();
        // geocoder.getAddress(e.lnglat, (status, result) => {
        //   if (status === "complete" && result.regeocode) {
        //     console.log(result.regeocode.addressComponent.district);
        //     let item = [{ str: result.regeocode.addressComponent.district }];
        //     this.districtPolygon();
        //   }
        // });
        // this.mapValue.setFitView([e.target]);
      });
    },
    polygonMouse(disProvince) {
      disProvince.on("mouseover", () => {
        disProvince.setOptions({
          fillOpacity: 0.2,
          fillColor: "#3779fd",
        });
      });
      disProvince.on("mouseout", () => {
        disProvince.setOptions({
          fillOpacity: 0.2,
          fillColor: "#000",
        });
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl';
</style>
