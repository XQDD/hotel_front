<template>
  <router-view :class="randomAnimation"></router-view>
</template>

<script>
  import {mapState} from "vuex";
  export default {
    computed: mapState(["randomAnimation"])
  }
</script>
<style>
  html, body {
    height: 100%;
  }
</style>
