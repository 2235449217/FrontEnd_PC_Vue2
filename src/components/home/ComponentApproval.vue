<template>
  <div>
    <!-- <el-button type="primary" style="margin-left: 16px;" @click="drawer = true">
      点我打开
    </el-button> -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :class="{ myDrawer:scssType, myDrawer2:!scssType }"
      :with-header="false"
      @closed="closeDrawer()"
    >
      <div class="drawerHeader">
        <div class="drawerHeader_title">{{ formName }}&nbsp;——&nbsp;{{ jiedianName }}</div>
        <div class="drawerHeader_iconAll">
          <div class="drawerHeader_icon"><i :class="fanye" @click="sidebarIcon" /></div>
          <div class="drawerHeader_icon"><el-divider direction="vertical" /></div>
          <div class="drawerHeader_icon"><i :class="kuosuo" @click="changeBigger" /></div>
          <div class="drawerHeader_icon"><i class="iconfont icon-wf-close" @click="closeDrawer" /></div>
        </div>
      </div>
      <!-- 表单数据部分 -->
      <div class="formData">
        <div class="formData_left">
          <div v-for="item in forms" :key="item.__config__.tag">
            <div class="formData_leftItem formData_leftItem_title">{{ item.__config__.label }}</div>
            <div class="formData_leftItem">{{ item.__config__.defaultValue }}</div>
            <el-divider />
          </div>
        </div>
        <div v-if="formDataRight" class="formData_right" style="overflow:auto">
          <div class="formData_rightTitle">
            <el-button size="mini" round type="info">流程动态</el-button>
            <el-button size="mini" round>评论</el-button>
            <el-button class="iconfont icon-wf-liuchengtu" type="text">流转图</el-button>
          </div>
          <div class="iconfont xianshineirong icon-wf-liuchengtu" type="text">显示内容</div>
          <div class="formData_rightBody">
            <div class="formData_rightBody_header">
              <div class="iconfont shenpi icon-wf-liuchengtu" type="text">流程结束</div>
            </div>
            <div class="formData_rightBody_content_finish">
              <div class="giveColor">累计耗时：100000000秒{{ isend }}</div>
            </div>
          </div>
          <div v-for="item in dynamics" :key="item.id" class="formData_rightBody">
            <div class="formData_rightBody_header">
              <div class="iconfont shenpi icon-wf-liuchengtu" type="text">{{ item.currentNode }}</div>
              <div class="shijian">{{ item.createdAt }}</div>
            </div>
            <div class="formData_rightBody_content">
              <div class="userAvatar"><el-avatar size="small"> user </el-avatar></div>
              <div class="userContent">
                <div class="name"><span>{{ item.applicant }}</span><span>{{ item.checkState }}</span></div><br>
                <div class="giveColor">开始处理：{{ item.inspectAt }}</div><br>
                <div class="giveColor">处理耗时：{{ item.consumeTime }}秒</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['forms', 'dynamics', 'isend'],
  data() {
    return {
      drawerTitle: '题目',
      drawer: true,
      direction: 'rtl',
      formName: '请假',
      jiedianName: '审批节点',
      formDataRight: 'true',
      scssType: 'true',
      fanye: 'iconfont icon-wf-youfanye-xue',
      kuosuo: 'iconfont icon-wf-expand'
      // forms: [
      //   {
      //     key: 1,
      //     value: 11
      //   },
      //   {
      //     key: 2,
      //     value: 22
      //   }
      // ]
    };
  },
  methods: {
    sidebarIcon() {
      this.formDataRight = !this.formDataRight;
      this.formDataRight === true ? this.fanye = 'iconfont icon-wf-youfanye-xue' : this.fanye = 'iconfont icon-wf-zuofanye';
    },
    changeBigger() {
      this.scssType = !this.scssType;
      this.scssType === true ? this.kuosuo = 'iconfont icon-wf-expand' : this.kuosuo = 'iconfont icon-wf-contract';
    },
    closeDrawer() {
      this.drawer = false;
      this.$emit('close');
      console.log('关闭可以');
    }
  }
};
</script>
<style lang="scss" scoped>
    .myDrawer ::v-deep .el-drawer__container .el-drawer{
        right: 313px;
        // 这里加!important的原因是该类的内置内敛样式优先级较高，需要加上!important来覆盖它。
        // width: 100% !important
        width: 1080px !important;
    }
    .myDrawer2 ::v-deep .el-drawer__container .el-drawer{
      right: 0px;
      width: 100% !important;
    }
    .drawerHeader{
      width:100%;
      height:60px;
      line-height:50px;
      background-color:rgb(13,179,166);
      color:white;
      padding:0 0px 0 24px;
    }
    .drawerHeader_title{
      display: inline-block;
      width: 900px
    }
    .drawerHeader_iconAll{
      display: inline-block;
      width:140px;
      position: absolute;
      right:1px;
      top: 8px;
    }
    .drawerHeader_icon{
      display: inline-block;
      width:30px;
    }
    .formData_leftItem{
      height:10px;
      padding: 10px 10px 10px 15px;
    }
    .formData_leftItem_title{
      color:rgb(149,164,186)
    }
    .formData_right{
      font-size:12px;
      width:300px;
      padding:0 15px;
      height:100%;
      background-color:rgb(244,246,249);
      position:absolute;
      right:0;
      top:60px;
      border: 1px rgb(233,233,233) solid;
    }
    .formData_rightTitle{
      font-size:12px;
      height:49px;
      line-height:49px;
      // background-color:rgb(208, 195, 195);
      border: 1px rgb(233,233,233) solid;
    }
    .formData_rightTitle .icon-wf-liuchengtu{
      font-size:12px;
      color: rgb(77,198,189);
      margin-left:60px
    }
    .xianshineirong{
      font-size:12px;
      height: 40px;
      line-height:40px;
      color: rgb(145,156,171);
      margin-left:200px;
    }
    .formData_rightBody_header{
      height: 40px;
      line-height: 40px;
      .shijian{
      display:inline-block;
      width:135px;
      color:rgb( 145, 161 ,183);
    }
    .shenpi{
      font-size:12px;
      display:inline-block;
      width: 145px;
    }
    }
    .formData_rightBody_content_finish{
       width:280px;
      margin: 0 auto;
      background-color:white;
      height: 20px;
      border-radius:5px;
      padding:10px;
    }
    .formData_rightBody_content{
      width:280px;
      margin: 0 auto;
      background-color:white;
      height: 100px;
      border-radius:5px;
      padding:10px;
      .userContent{
      float:right;
      // border:1px #000 solid;
      width:235px;
      height:39px;
      margin-top:8px;
      // margin-left:10px;
      // margin-top:15px;
      .name{
        display: flex;
        justify-content: space-between;
      }
    }
    .userAvatar{
      float:left;
      width:35px;
      height:35px;
      // position: relative;
      // top:15px;
      // left:15px;
    }
    .giveColor{
      color:rgb(149,164,186)
    }
    }
</style>
