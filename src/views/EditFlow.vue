<template>
  <div>
    <SwitchNav
      :btn-list="btnList"
      :readonly="readonly"
      :app-name="appName"
      @getTitle="setTitle"
    />
    <router-view />
  </div>
</template>

<script>
import SwitchNav from '@/components/SwitchNav.vue';
export default {
  name: 'EditFlow',
  components: { SwitchNav },
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnList: [
        {
          title: '表单设计',
          path: 'form',
          fn: () => {
            const id = this.$route.params.id;
            this.$router.push(`/editflow/${id}/form`);
          }
        },
        {
          title: '流程设定',
          path: 'lf',
          fn: () => {
            const id = this.$route.params.id;
            this.$router.push(`/editflow/${id}/lf`);
          }
        },
        {
          title: '表单发布',
          path: 'publish',
          fn: () => {
            const id = this.$route.params.id;
            this.$router.push(`/editflow/${id}/publish`);
          }
        }
      ],
      appName: ''
    };
  },
  created() {
    this.appName = this.$route.query.appName;
    // console.log(this.$route);
  },
  methods: {
    setTitle(str) {
      console.log(str);
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
