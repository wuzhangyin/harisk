<template>
  <div id="app">
    <router-view />
    <!-- 缓存清理按钮 -->
    <CacheClearButton />
  </div>
</template>

<script setup>
import CacheClearButton from './components/CacheClearButton.vue'
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
