<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="stylus">
* {
  padding: 0;
  margin: 0;
  list-style: none;
}

html, #app {
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}

body {
  width: 7680px;
  height: 3240px;
}
</style>
