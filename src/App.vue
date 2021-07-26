<template>
  <div id="app">
    <grid></grid>
  </div>
</template>

<script>
import Grid from '@/components/Grid.vue';

export default {
  name: 'App',
  components: {
    Grid,
  },
};
</script>

<style lang="scss">
  body {
    background-color: #8e8080 !important;
  }
</style>
