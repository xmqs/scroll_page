<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import './assets/css/mescroll.min.css'
  import './assets/css/swiper-3.3.1.min.css'
  import './assets/css/news_list.css'

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body{
  margin: 0;
}
html{
  font-size: 62.5%;
}
</style>
