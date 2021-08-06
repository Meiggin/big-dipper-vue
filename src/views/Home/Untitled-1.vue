/* 加载地图 */
async getMaps() {
  this.loading = true;
  await MapLoader().then(
    (AMap) => {
      const map = new AMap.Map("map_three", {
        showLabel: true,
        mapStyle: "amap://styles/ccab8afcf9c843aefac72ff71d705eb4",
        center: [114.085947, 22.547],
        viewMode: "3D",
        labelzIndex: 130,
        pitch: 30,
        zoom: 11.5,
        zooms: [11, 18],
        features: ["road", "point", "bg"],
      });
      const district = new AMap.DistrictSearch({
        subdistrict: 0,
        extensions: "all",
        level: "district",
      });
      district.search("宝安区", (status, result) => {
        const [bounds,mask] = [result.districtList[0].boundaries,[]]
        if (bounds) {
          for (let i = 0, l = bounds.length; i < l; i++) {
            //生成行政区划polygon
            let polygon = new AMap.Polygon({
              map: map,
              strokeWeight: 1,
              path: bounds[i],
              fillOpacity: 0.25,
              fillColor: "#09b8bf",
              strokeColor: "#09b8bf",
            });
            mask.push(polygon);
          }
        }
        map.add(mask);
        map.setFitView(mask); //视口自适应
       
        //插件：行政区图层、点聚合
        AMap.plugin(["AMap.DistrictLayer"], function () {
          const disProvince = new AMap.DistrictLayer.Province({
            zIndex: 12,
            depth: 2,
            styles: {
              fill: function (properties) {
                let adcode = properties.adcode;
                return getColorByAdcode(adcode);
              },
              "province-stroke": "#09b8bf",
              "city-stroke": "#09b8bf",
              "county-stroke": "#09b8bf", //线条颜色
            },
          });
          disProvince.setMap(map);
        });
        //随机颜色
        const getColorByAdcode = (adcode) => {
          const colors = {};
          if (!colors[adcode]) colors[adcode] = "rgba(7,111,142,0.7)";
          return colors[adcode];
        };
        map.on("click", () => {
          this.maps.infowindow.close();
        });
        this.maps.map = map;
        this.maps.AMap = AMap;
        this.drawStaion(AMap, map);
      });
    },
    (e) => {
      console.error("地图加载失败", e);
    }
  );
},

/* 生成地图点位 */
async drawStaion(AMap, map, pointList=this.maps.pointList) {
  const [data,markers] = [pointList,[]];
  let infowindow = null;
  for (let i in data) {
    const curPoint = data[i];
    //点位状态颜色
    const status = this.getStatus(curPoint.status);
    //点位模板
    const contents = this.setMapInfo(status, curPoint, curPoint.status);
    //弹窗模板
    const windowPopup = this.openPopup(curPoint, this);

    //点位实例
    const marker = new AMap.Marker({
      content: contents,
      position: [curPoint.longitude, curPoint.latitude],
    });
    //弹窗实例
    infowindow = new AMap.InfoWindow({
      isCustom: true,
      anchor: "bottom-center",
      offset: new AMap.Pixel(5, -12),
    });
    marker.on("click", (e) => {
      //防止每项变成遍历的最后一个
      infowindow.setContent(windowPopup.$el);
      infowindow.open(map, marker.getPosition());
    });
    markers.push(marker);
    this.maps.infowindow = infowindow;
    this.markers = markers;
  }

  /* 点聚合部分 */
  AMap.plugin(["AMap.MarkerClusterer"],()=>{
        new AMap.MarkerClusterer(map, markers, {
          gridSize: 80,
          renderClusterMarker: _renderClusterMarker,
        });
        const count = markers.length;
      var _renderClusterMarker = function (context) {
        var factor = Math.pow(context.count / count, 1 / 18);
        var div = document.createElement("div");
        var Hue = 180 - factor * 180;
        var bgColor = "hsla(" + Hue + ",100%,50%,0.7)";
        var fontColor = "hsla(" + Hue + ",100%,20%,1)";
        var borderColor = "hsla(" + Hue + ",100%,40%,1)";
        var shadowColor = "hsla(" + Hue + ",100%,50%,1)";
        div.style.backgroundColor = bgColor;
        var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + "px";
        div.style.border = "solid 1px " + borderColor;
        div.style.borderRadius = size / 2 + "px";
        div.style.boxShadow = "0 0 1px " + shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size + "px";
        div.style.color = fontColor;
        div.style.fontSize = "14px";
        div.style.textAlign = "center";
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        context.marker.setContent(div);
      };
  })

  //map.add(markers);//不用添加进map
  this.loading = false;
},