<template>
  <div class="dv-scroll-board">
    <img class="statusImg1" src="../../assets/border1.png" alt="" />
    <img class="statusImg2" src="../../assets/border2.png" alt="" />
    <img class="statusImg3" src="../../assets/border3.png" alt="" />
    <img class="statusImg4" src="../../assets/border4.png" alt="" />
    <div class="sideBorderTitle-warp">
      <p class="sideBorderTitle1 clear">{{ sideTitle }}</p>
      <p class="sideBorderTitle2 clear">{{ sideTitle }}</p>
      <img class="sideBorderImg" src="../../assets/titleShadow.png" alt="" />
    </div>
    <slot name="sideBorderData"></slot>
  </div>
</template>

<script>
export default {
  /* eslint-disable */
  name: "DvScrollBoard",
  props: ["sideTitle"],
  data() {
    return {};
  },
};
</script>

<style lang="stylus">
.dv-scroll-board {
  position: relative;
  width: 908px;
  color: #fff;

  .sideBorderTitle-warp {
    // width: -webkit-fit-content;
    display: inline-block;
    height: 95px;
    min-width: 300px;
    position: relative;
    background-image: url('../../assets/titleBorder.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom left;
    margin-left: 52px;

    p {
      text-align: center;
      font-size: 32px;
      white-space: nowrap;
      width: 100%;
    }

    .sideBorderImg {
      width: 100%;
      position: absolute;
      bottom: 0px;
      z-index: 5;
    }
  }

  .sideBorderTitle1 {
    position: absolute;
    top: 36px;
    color: #fff;
    z-index: 2;
  }

  .sideBorderTitle2 {
    position: absolute;
    top: 42px;
    color: #203f82;
    z-index: 1;
  }

  .statusImg1 {
    position: absolute;
    left: 0;
    top: 0;
    width: 122px;
    height: 110px;
  }

  .statusImg2 {
    position: absolute;
    right: 0;
    top: 0;
    width: 122px;
    height: 110px;
  }

  .statusImg3 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 122px;
    height: 110px;
  }

  .statusImg4 {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 122px;
    height: 110px;
  }
}
</style>
