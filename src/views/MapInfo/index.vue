<template>
  <div class="home-container">
    <img src="../../assets/mapInfo.jpg" alt="" width="100%" @click="goHome" />
  </div>
</template>
<script>
export default {
  name: "MapInfo",
  data() {
    return {};
  },
  methods: {
    goHome(e) {
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (e.clientX / width > 0.5) {
        this.$router.push("/home");
      } else {
        this.$router.push("/");
      }

      //   this.$router.push("/home");
    },
  },
};
</script>
<style scoped>
img {
  cursor: pointer;
}
</style>