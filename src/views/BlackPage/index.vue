<template>
  <div class="home-container">
    <img src="../../assets/bankPage.jpg" alt=""  width = "100%" @click="goMapInfo">
  </div>
</template>
<script>
export default {
  name: "BlackPage",
  data() {
    return {};
  },
  methods:{
      goMapInfo(){
          this.$router.push('/MapInfo')
      }
  }
};
</script>
<style scoped>
img{
    cursor: pointer;
}
</style>