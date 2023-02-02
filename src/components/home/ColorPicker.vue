<template>
  <div
    class="color-picker"
    :style="`background-image:linear-gradient(${from},${to})`"
  />
</template>
<script>
export default {
  props: {
    from: {
      type: String,
      default: () => {
        return `#f4cf54`;
      }
    },
    to: {
      type: String,
      default: () => {
        return `#e89121`;
      }
    }
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.color-picker{
  box-sizing: border-box;
  display: inline-block;
  width: 34px;
  height: 34px;
  margin: 0 6px;
  border-radius: 17px;
  cursor: pointer;
  &:hover{
    border: 2px solid #b6e8e4;
  }
  &[selected=selected] {
    border: 2px solid #b6e8e4;
  }
}

</style>
