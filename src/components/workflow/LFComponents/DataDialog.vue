<template>
  <div>
    <vue-json-pretty :path="'res'" :data="graphData" />
  </div>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  components: {
    VueJsonPretty
  },
  props: {
    graphData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
<style scoped>
</style>
