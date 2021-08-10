<template>
  <div class="home-container">
    <!-- loading -->
    <div class="loading" v-if="isLoading">
      <dv-loading>Loading...</dv-loading>
    </div>
    <section ref="sectionRef">
      <!-- 地图 -->
      <div id="userMap" class="markerClass" style="height: 100%"></div>
      <!-- 边 -->
      <transition
        enter-active-class="animated fadeOut"
        leave-active-class="animated fadeOut"
      >
        <BankDataPreview v-if="action == 0"></BankDataPreview>
        <BankInfo v-if="action == 1"></BankInfo>
      </transition>
      <!-- 地图标题 -->
      <BankBakingPreview
        :isLoading="isLoading"
        @loading="titleLoading"
      ></BankBakingPreview>
    </section>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import BankDataPreview from "./components/BankDataPreview";
import BankBakingPreview from "./components/BankBakingPreview";
import BankInfo from "./components/BankInfo";

import cityJson from "@/utils/jsonData.json";

export default {
  name: "DataPreview",
  components: { BankDataPreview, BankBakingPreview, BankInfo },
  data() {
    return {
      action: 0,
      isLoading: false,
      height: "",
      colors: {},
      overlaysList: [],
      district: null,
      AMap: null,
      ADlist: [
        { str: "上城区" },
        { str: "拱墅区" },
        { str: "西湖区" },
        { str: "滨江区" },
        { str: "萧山区" },
        { str: "余杭区" },
        { str: "临平区" },
        { str: "钱塘区" },
        { str: "富阳区" },
        { str: "临安区" },
      ],
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
    titleLoading() {
      this.showLoading();
    },
    showLoading() {
      this.isLoading = true;
      this.timer = setTimeout(() => {
        this.isLoading = false;
        window.clearTimeout(this.timer);
      }, 500);
    },
    // 设置DOM高度
    setElementHeight() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showLoading();
        this.height = `${this.$refs.sectionRef.offsetHeight}px`;
      }, 100);
    },
    // 用户地图
    async initUserMap() {
      AMapLoader.load({
        key: "7613cd9072618326abc496f33fa660f1",
        version: "2.0",
        plugins: ["AMap.Geocoder"],
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
              level: "district",
            });
            this.districtPolygon(this.ADlist);
          });
          this.loca = new Loca.Container({
            map: this.mapValue,
          });
          this.mapValue.on("zoomend", (e) => {
            let currentZoom = this.mapValue.getZoom();
            if (currentZoom <= 10) {
              this.mapValue.clearMap();
              this.districtPolygon(this.ADlist);
              this.loca.remove(this.bankBranch);
              this.action = 0;
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    districtPolygon(item) {
      for (let i in item) {
        this.district.search(item[i].str, (status, result) => {
          let bounds = result.districtList[0].boundaries;
          let polygons = [];
          if (bounds) {
            for (let x = 0, l = bounds.length; x < l; x++) {
              //生成行政区划polygon
              let polygon = new this.AMap.Polygon({
                map: this.mapValue,
                strokeWeight: 4,
                strokeOpacity: 1,
                strokeColor: "#4d4d4d",
                cursor: "pointer",
                path: bounds[x],
                fillOpacity: 0.6,
                fillColor: "#38448e",
                id: i,
                strokeStyle: "",
              });
              polygons.push(polygon);

              // if (currentZoom > 11) {
              //   polygon.off("mouseover", this.polygonMouseover(polygon));
              //   polygon.off("mouseout", this.polygonMouseout(polygon));
              if (item.length == 1) {
                this.polygonClick(polygon);
                console.log('1');
              } else {
                this.polygonMouse(polygon);
                this.polygonClick(polygon);
              }
              // }
            }
          }
        });
      }
      this.mapValue.setFitView();
    },

    polygonClick(polygon) {
      polygon.on("click", (e) => {
        let overlaysList = this.mapValue.getAllOverlays("polygon");
        if (overlaysList.length != 1) {
          this.mapValue.clearMap();
        }
        let geocoder = new this.AMap.Geocoder();

        geocoder.getAddress(e.lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            let item = [{ str: result.regeocode.addressComponent.district }];
            this.districtPolygon(item);
          }
        });
        this.mapValue.setFitView([e.target]);

        const geo = new Loca.GeoJSONSource({
          data: cityJson,
        });
        this.bankBranch = new Loca.PointLayer({
          zIndex: 10,
          opacity: 1,
          blend: "normal",
        });
        this.bankBranch.setSource(geo);
        const colors = [
          "rgba(254,255,198,0.95)",
          "rgba(255,238,149,0.95)",
          "rgba(255,217,99,0.95)",
          "rgba(255,175,43,0.95)",
          "rgba(255,135,24,0.95)",
          "rgba(234,10,0,0.95)",
          "rgba(195,0,0,0.95)",
          "rgba(139,0,0,0.95)",
        ];
        this.bankBranch.setStyle({
          unit: "meter",
          radius: (index, f) => {
            var n = f.properties["人口"];
            return n * 100;
          },
          color: (index, f) => {
            var n = Math.min(7, ~~(f.properties["人均GDP"] / 10000));
            return colors[n];
          },
          borderWidth: 0,
          blurRadius: -1,
        });
        this.loca.add(this.bankBranch);
        console.log(this.bankBranch, this.loca);
        this.mapValue.on("click", (e) => {
          const feat = this.bankBranch.queryFeature(e.pixel.toArray());
          // geocoder.getAddress(feat.coordinates, (status, result) => {
          //   if (status === "complete" && result.regeocode) {
          //     console.log(result);
          //   }
          // });
          console.log(e);
          this.action = 1;
        });
      });
    },
    polygonMouse(polygon) {
      polygon.on("mouseover", () => {
        polygon.setOptions({
          fillOpacity: 0.3,
          fillColor: "#6f96db",
        });
      });
      polygon.on("mouseout", () => {
        polygon.setOptions({
          fillOpacity: 0.6,
          fillColor: "#38448e",
        });
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl';

.amap-logo {
  display: none !important;
}

.amap-copyright {
  opacity: 0;
}
</style>