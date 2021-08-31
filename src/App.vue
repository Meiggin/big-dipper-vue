<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: "",
    };
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
      if (to.meta.index > from.meta.index) this.transitionName = "slide-left";
      if (to.meta.index < from.meta.index) this.transitionName = "slide-right";
      if (to.meta.index == 1 && from.meta.index == 3) {
        this.$router.go(0);
      }
    },
  },
  methods: {},
};
</script>
<style lang="stylus">
* {
  padding: 0;
  margin: 0;
  list-style: none;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 12px;
  padding: 0;
  margin: 0;
  font-family: SourceHanSansCN;
  caret-color: rgba(0, 0, 0, 0);
  cursor: default;
}

.slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate(-100%);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-enter {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
