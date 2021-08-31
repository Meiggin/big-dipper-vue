<template>
  <div class="home-container">
    <!-- loading -->
    <div class="loading" v-if="isLoading">
      <dv-loading>Loading...</dv-loading>
    </div>
    <section ref="sectionRef">
      <!-- 地图 -->
      <div id="userMap" class="markerClass" style="height: 100%"></div>
      <div class="backDisplay" @click="backBlock"></div>
      <!-- 边 -->
      <transition name="fade">
        <BankDataPreview
          v-if="action == 0"
          @loading="titleLoading"
        ></BankDataPreview>
      </transition>
      <transition name="fade">
        <BankInfo v-if="action == 1"></BankInfo>
      </transition>
      <transition name="fade">
        <FirmInfo
          v-if="action == 2"
          :frimData="frimData"
          :companyDetail="companyDetail"
        ></FirmInfo>
      </transition>
      <!-- 地图标题 -->
      <transition name="fade">
        <BankBakingPreview
          :isLoading="isLoading"
          @loading="titleLoading"
          v-if="action == 0"
        ></BankBakingPreview>
      </transition>
    </section>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import BankDataPreview from "./components/BankDataPreview";
import BankBakingPreview from "./components/BankBakingPreview";
import BankInfo from "./components/BankInfo";
import FirmInfo from "./components/FirmInfo";
import cityJson from "@/utils/jsonData.json";
import { getBankNetwork, getCompanyByRange } from "@/api/index";
export default {
  name: "DataPreview",
  components: { BankDataPreview, BankBakingPreview, BankInfo, FirmInfo },
  data() {
    return {
      bankOutlets: {
        type: "FeatureCollection",
        features: [],
      },
      texts: [],
      apiData: {},
      action: 0,
      isLoading: false,
      height: "",
      colors: {},
      overlaysList: [],
      district: null,
      AMap: null,
      circle: null,
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
      lnglat: null,
      companyByRange: null,
      searchList: {
        bankType: null,
        bankName: null,
        area: null,
      },
      frimData: {},
      companyDetail: [],
      mapPolygonValue: null,
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
    this.busMent();
    console.log(111111111);
  },
  methods: {
    backBlock() {
      this.$router.push("/");
    },
    busMent() {
      this.bus.$on("actionFlow", (val) => {
        if (val == 0) {
          this.mapValue.setZoom(10);
        }
      });
      this.bus.$on("clickCompany", (val) => {
        if (val) {
          this.action = 2;
          this.frimData = val;
        }
      });
      this.bus.$on("bankType", (val) => {
        if (val != null) {
          if (this.searchList.bankType != val) {
            this.searchList.bankType = val;
            this.searchList.bankName = this.ifBankTitle(
              this.searchList.bankType
            );
          } else {
            this.searchList.bankType = val;
          }
        } else {
          this.searchList.bankType = null;
          this.searchList.bankName = null;
        }
      });
    },
    titleLoading() {
      this.showLoading();
    },
    showLoading() {
      this.isLoading = true;
      this.timer = setTimeout(() => {
        this.isLoading = false;
        window.clearTimeout(this.timer);
      }, 600);
    },
    // 设置DOM高度
    setElementHeight() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showLoading();
        this.height = `${this.$refs.sectionRef.offsetHeight}px`;
      }, 300);
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
            viewMode: "3D",
            resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
            expandZoomRange: true, // 是否支持可以扩展最大缩放级别,和zooms属性配合使用设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
            // gestureHandling: "greedy",//谷歌里面的// hybrid包含卫星和地名
            // zooms: 8,
            // zooms: [9, 20],
            defaultCursor: "pointer", // 变成小手 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
            showLabel: true, // 显示地图文字标记
          });
          this.mapValue.clearMap();
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
          this.mapZoomend();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //地图缩放事件
    mapZoomend() {
      this.mapValue.on("zoomend", (e) => {
        let currentZoom = this.mapValue.getZoom();
        console.log(currentZoom);
        if (currentZoom <= 10) {
          this.mapValue.clearMap();
          this.districtPolygon(this.ADlist);
          this.loca.remove(this.bankBranch);
          this.action = 0;
          this.bus.$emit("area", 99);
          if (!this.searchList.bankType) {
            this.bus.$emit("showSpan", false);
          }
        }
        if (currentZoom >= 16) {
          this.mapValue.add(this.texts);
        } else if (12 < currentZoom < 16) {
          this.mapValue.remove(this.texts);
          // this.action = 1
        }
      });
    },
    //画线
    mapPolyline(bounds, x, polygons) {
      let polyline = new this.AMap.Polyline({
        map: this.mapValue,
        strokeWeight: 2,
        strokeOpacity: 1,
        strokeColor: "#a0ddf9",
        cursor: "pointer",
        path: bounds[x],
        fillOpacity: 0.3,
        fillColor: "#67ccfb",
        strokeStyle: "",
      });
      polygons.push(polyline);
    },
    //多个行政区
    mapPolygon(bounds, x, polygons) {
      let polygon = new this.AMap.Polygon({
        map: this.mapValue,
        strokeWeight: 2,
        strokeOpacity: 1,
        strokeColor: "#a0ddf9",
        cursor: "pointer",
        path: bounds[x],
        fillOpacity: 0.3,
        fillColor: "#67ccfb",
        id: x,
        strokeStyle: "",
        zIndex: 9,
      });
      polygons.push(polygon);
      // this.polygonMouse(polygon);
      this.polygonClick(polygon);
    },
    //搜索行政区生成行政区划polygon
    districtPolygon(item) {
      if (item.length == 1) {
        this.district.search(item[0].str, (status, result) => {
          let bounds = result.districtList[0].boundaries;
          let polygons = [];
          if (bounds) {
            for (let x = 0, l = bounds.length; x < l; x++) {
              this.mapPolyline(bounds, x, polygons);
            }
          }
        });
      } else {
        for (let i in item) {
          this.district.search(item[i].str, (status, result) => {
            let bounds = result.districtList[0].boundaries;
            let polygons = [];
            if (bounds) {
              for (let x = 0, l = bounds.length; x < l; x++) {
                this.mapPolygon(bounds, x, polygons);
              }
            }
          });
        }
        this.bus.$emit("area", 99);
      }

      this.mapValue.setFitView();
    },
    //生成银行网点5公里范围地图
    fiveCircle(e) {
      const feat = this.bankBranch.queryFeature(e.pixel.toArray());
      if (feat != undefined) {
        this.loca.remove(this.bankBranch);
        this.circle = new AMap.Circle({
          center: e.lnglat, // 圆心位置
          radius: 5000, // 圆半径
          fillColor: "#67ccfb", // 圆形填充颜色
          fillOpacity: 0.3,
          strokeColor: "#fff", // 描边颜色
          strokeWeight: 4, // 描边宽度
          zIndex: 15,
        });
        this.mapValue.add(this.circle);
        this.mapValue.setZoomAndCenter(13, e.lnglat);
        this.action = 1;
        let data = {
          latitude: e.lnglat.lat,
          longitude: e.lnglat.lng,
          name: feat.properties.name,
        };
        getCompanyByRange(data).then((res) => {
          const companyCircleList = [];
          this.bus.$emit("bankName", feat.properties.name);
          this.bus.$emit("latLong", e.lnglat);
          res.data.companys.map((item) => {
            const companyCircle = new AMap.Circle({
              center: item.geometry.coordinates, // 圆心位置
              radius:
                item.properties.num * 10 > 500
                  ? "500"
                  : item.properties.num * 10, // 圆半径
              fillColor: "#fff", // 圆形填充颜色
              fillOpacity: 0.3,
              strokeColor: "#fff", // 描边颜色
              strokeWeight: 2, // 描边宽度
            });
            companyCircleList.push(companyCircle);
            companyCircle.on("mouseover", () => {
              companyCircle.setOptions({
                fillOpacity: 0.6,
                radius: item.properties.num * 100,
                fillColor: "#fff",
              });
            });
            companyCircle.on("click", () => {
              this.companyDetail = companyCircle._opts.center;
              // console.log(this.companyDetail);
              // let companyDetail = this.companyDetail;
              // this.bus.$emit("getCompanyDetail", companyDetail);
              this.mapValue.clearMap();
              this.mapValue.setZoom(10);
              // console.log(this.mapPolygonValue)
              // this.polygonClick(this.mapPolygonValue)
              // let geocoder = new this.AMap.Geocoder();
              // geocoder.getAddress(this.companyDetail, (status, result) => {
              //   let item = [{ str: result.regeocode.addressComponent.district }];
              //   console.log(item)
              //   this.districtPolygon(item)
              // })
            });

            companyCircle.on("mouseout", () => {
              companyCircle.setOptions({
                radius: item.properties.num * 50,
                fillOpacity: 0.3,
                fillColor: "#fff",
              });
            });
          });

          this.mapValue.add(companyCircleList);
          // const companyByRange = new Loca.PointLayer({
          //   zIndex: 16,
          //   opacity: 0.7,
          //   blend: "normal",
          // });
          // const geo = new Loca.GeoJSONSource({
          //   data: res.data.companys,
          // });

          // companyByRange.setSource(geo);
          // companyByRange.setStyle({
          //   unit: "meter",
          //   radius: (index, f) => {
          //     console.log(f.num);
          //     var n = f.num;
          //     return n * 5;
          //   },
          //   color: "#fff",
          //   borderWidth: 10,
          //   borderColor: "#fff",
          // });
          // this.loca.add(companyByRange);
        });
      }
    },
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
    //polygon点击生成loca
    polygonClick(polygon) {
      if (this.mapPolygonValue != null || this.mapPolygonValue != polygon) {
        this.mapPolygonValue = polygon;
      }
      polygon.on("click", (e) => {
        let overlaysList = this.mapValue.getAllOverlays("polygon");
        if (overlaysList.length != 1) {
          this.mapValue.clearMap();
        }
        let geocoder = new this.AMap.Geocoder();
        this.bus.$emit("showSpan", true);
        geocoder.getAddress(e.lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            let item = [{ str: result.regeocode.addressComponent.district }];
            this.districtPolygon(item);

            this.searchList.area = result.regeocode.addressComponent.district;

            this.bus.$emit("area", result.regeocode.addressComponent.district);
            this.resultBus = result.regeocode.addressComponent.district;
            getBankNetwork(this.searchList).then((res) => {
              if (res.code == 200) {
                this.bankOutlets.features = [];
                this.texts = [];
                res.data.map((item) => {
                  item.type = "Feature";
                  item.geometry = {
                    type: "Point",
                    coordinates: [item.longitude, item.latitude],
                  };
                  item.properties = item;
                  this.text = new AMap.Text({
                    position: item.geometry.coordinates,
                    text: item.name,
                    anchor: "top", // 设置文本标记锚点
                    draggable: false,
                    cursor: "pointer",
                    offset: [0, 0],
                    style: {
                      padding: "5px 10px",
                      "margin-bottom": "1rem",
                      "background-color": "rgba(0,0,0,0.5)",
                      // 'width': '12rem',
                      "border-width": 0,
                      "text-align": "center",
                      "font-size": "16px",
                      color: "#fff",
                    },
                  });
                  this.texts.push(this.text);
                });
                this.bankOutlets.features = res.data;
                const geo = new Loca.GeoJSONSource({
                  data: this.bankOutlets,
                });
                this.bankBranch = new Loca.PointLayer({
                  zIndex: 10,
                  opacity: 0.7,
                  blend: "normal",
                });
                this.bankBranch.setSource(geo);
                this.bankBranch.setStyle({
                  radius: 5,
                  color: "#e407b3",
                  borderWidth: 10,
                  borderColor: "#890481",
                });
                this.loca.add(this.bankBranch);
                this.mapValue.setFitView([e.target]);

                this.mapValue.on("click", (value) => {
                  this.mapBank = value;
                  this.fiveCircle(value);
                });
              }
            });
          }
        });

        // geocoder.getAddress(feat.coordinates, (status, result) => {
        //   if (status === "complete" && result.regeocode) {
        //     console.log(result);
        //   }
        // });
      });
    },
    polygonMouse(polygon) {
      polygon.on("mouseover", () => {
        polygon.setOptions({
          fillOpacity: 0.6,
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

.backDisplay {
  height: 1rem;
  width: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  opacity: 0;
  cursor: pointer;
}
</style>