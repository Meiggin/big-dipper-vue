<template>
  <div class="dv-scroll-board">
    <img class="statusImg1" src="../../assets/border1.png" alt="" />
    <img class="statusImg2" src="../../assets/border2.png" alt="" />
    <img class="statusImg3" src="../../assets/border3.png" alt="" />
    <img class="statusImg4" src="../../assets/border4.png" alt="" />
    <slot name="sideBorderData"></slot>
  </div>
</template>

<script>
export default {
  /* eslint-disable */
  name: "DvScrollBoard",

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

  .statusImg1 {
    position: absolute;
    left: 0;
    top: 0;
    width: 122px;
    height: 109px;
  }

  .statusImg2 {
    position: absolute;
    right: 0;
    top: 0;
    width: 122px;
    height: 109px;
  }

  .statusImg3 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 122px;
    height: 109px;
  }

  .statusImg4 {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 122px;
    height: 109px;
  }
}
</style>
