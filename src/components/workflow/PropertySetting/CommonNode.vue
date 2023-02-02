<template>
  <div>
    <el-form label-position="top" :rules="rules" label-width="80px" :model="form">
      <el-form-item label="节点名称" prop="name" size="small">
        <el-input v-model="form.name" @blur="saveData" />
      </el-form-item>
      <el-form-item v-if="nodeData.type !== 'start' && nodeData.type !=='end'" :label="itemLabel" prop="roles" size="small">
        <ul
          v-if="
            idArray.authorityIds || idArray.dept || idArray.memeber"
          class="x-memeber-value-pane"
          @click="Selectrole"
        >
          <li v-for="(item,index) in authorities" :key="'role'+index" class="select-item">
            <i class="iconfont-role">&#xe606;</i>
            <span>{{ item.authorityName }}</span>
          </li>
          <li v-for="(item,index) in dept" :key="'dept'+index" class="select-item">
            <i class="iconfont-role">&#xe606;</i>
            <span>{{ item.deptName }}</span>
          </li>
          <li v-for="(item,index) in memeber" :key="'memeber'+index" class="select-item">
            <i class="iconfont">&#xe604;</i>
            {{ item.nickName }}
          </li>
        </ul>
        <ul v-else class="x-memeber-value-pane" @click="Selectrole">
          <div class="checked_dept">
            + 点击选择角色
          </div>
        </ul>
      </el-form-item>
    </el-form>
    <Process
      v-if="show"
      :show.sync="show"
      :titles="titles"
      :deptlist="deptList"
      :authoritylist="authoritylist"
      :appinfo="appinfo"
      :allmember="allmember"
      @changeAppInfo="changeAppInfo"
      @confirmSend="confirmSend"
    />
  </div>
</template>

<script>
import Process from '@/components/common/Process';
import { getAuthorityList } from '@/api/System/authority';
import { getUserList } from '@/api/System/user';
import { getDeptList } from '@/api/System/dept';
import { findTree } from '@/utils/index';
export default {
  components: { Process },
  props: {
    nodeData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    lf: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        roles: []
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        roles: [
          { type: 'array', required: true, message: '请至少选择一个负责人', trigger: 'change' }
        ]
      },
      titles: ['组织架构', '角色', '成员'],
      authoritylist: [],
      deptList: [],
      appinfo: {
        'dept': [],
        'role': [],
        'memeber': []
      },
      allmember: [],
      show: false,
      data: {
        'page': 1,
        'pageSize': 1000
      },
      idArray: {
      },
      authorities: null,
      dept: null,
      memeber: null,
      selectRoleList: [],
      selectDeptList: [],
      selectmemeberList: []
    };
  },
  computed: {
    itemLabel: function(val) {
      if (this.nodeData.type === 'approve') {
        return '负责人';
      } else {
        return '抄送人';
      }
    }
  },
  watch: {
    nodeData: function(val) {
      if (val.type !== 'customEdge') {
        this.form = ({ ...val.properties });
      }
      // this.form.name = val.text.value;
    }
  },
  created() {
    // 获取全部成员
    getUserList(this.data).then((res) => {
      this.allmember = res.data.list;
    });
    getAuthorityList(this.data).then(res => {
      this.authoritylist = res.data.list;
    });
    getDeptList(this.data).then(res => {
      this.deptList = res.data.list;
    });
  },
  mounted() {
    const { properties } = this.$props.nodeData;
    if (properties) {
      this.$data.form = Object.assign({}, this.$data.form, properties);
    }
  },
  methods: {
    saveData() {
      const nodeData = this.$props.nodeData;
      nodeData.properties = this.$data.form;
      nodeData.text = this.form.name;
      this.$props.lf.getNodeModelById(nodeData.id).updateText(this.form.name);
      this.$props.lf.setProperties(nodeData.id, this.$data.form);
    },
    Selectrole() {
      this.show = true;
      this.appinfo['role'] = this.idArray.authorityIds || [];
      this.appinfo['dept'] = this.idArray.dept || [];
      this.appinfo['memeber'] = this.idArray.memeber || [];

      console.log(this.appinfo);
    },
    changeAppInfo(val) {
      this.appinfo = val;
      this.idArray.authorityIds = this.appinfo['role'];
      this.idArray.dept = this.appinfo['dept'];
      this.idArray.memeber = this.appinfo['memeber'].map(item => {
        return item.id;
      });
      // 选中数组清空
      this.selectRoleList = [];
      this.selectDeptList = [];
      this.selectmemeberList = [];
      // 在此添加
      this.authoritylist.forEach(res => {
        this.idArray.authorityIds.forEach(item => {
          if (res.authorityId === item) {
            this.selectRoleList.push(res);
          }
        });
      });

      const idSet = new Set(this.idArray.dept);
      findTree(this.deptList, idSet, this.selectDeptList);

      this.allmember.forEach(res => {
        this.idArray.memeber.forEach(item => {
          if (res.ID === item) {
            this.selectmemeberList.push(res);
          }
        });
      });
      this.authorities = this.selectRoleList;
      this.dept = this.selectDeptList;
      this.memeber = this.selectmemeberList;
    },
    confirmSend(value) {
      console.log(value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';
@import '@/styles/mixin.scss';
@font-face {
  font-family: 'iconfont';  /* Project id 3288768 */
  src: url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.woff2?t=1649420958600') format('woff2'),
      url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.woff?t=1649420958600') format('woff'),
      url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.ttf?t=1649420958600') format('truetype');
}
>>>.el-form-item__label{
  font-weight: 700;
  padding:0;
}

.x-memeber-value-pane{
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          align-items: flex-start;
          height: 80px;
          width: 295px;
          padding:0;
          overflow-x: hidden;
          overflow-y: auto;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          .checked_dept{
            width: 143px;
            height: 32px;
            line-height: 32px;
            color: $address_btn_color;
            margin: 25px auto;

      }
          .select-item{
            // width: 40px;
            // height: 20px;
            display: flex;
            align-items: center;
            margin: 5px 0 0 5px;
            padding: 5px 10px;
            background: #f3f6fc;
            border-radius: 1px;
            .iconfont{
              color: #fa0;
              margin-right: 4px;
              display: inline-block;
              vertical-align: middle;
            }
            .iconfont-role{
              @include iconfont;
                display: inline-block;
                margin-right: 4px;
                color: #248af9;
            }
            span{
              display:inline-block;
              line-height: 20px;
              vertical-align: middle;
              word-wrap: break-word;
              word-break: break-all;
            }
          }
        }
</style>
