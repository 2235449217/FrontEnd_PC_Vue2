<template>
  <div class="container">
    <div class="manager-group-name">
      {{ role.authorityName }}(权限)
    </div>
    <div class="group-config">
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[0].base" :indeterminate="isIndeterminateList[0].base" @change="ChangeAll_baseStore">base</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['base']" @change="Change_baseStore">
            <el-checkbox v-for="(item,index) in allApi['base']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[1].jwt" :indeterminate="isIndeterminateList[1].jwt" @change="ChangeAll_jwtStore">jwt</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['jwt']" @change="Change_jwtStore">
            <el-checkbox v-for="(item,index) in allApi['jwt']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[2].user" :indeterminate="isIndeterminateList[2].user" @change="ChangeAll_userStore">用户</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['user']" @change="Change_userStore">
            <el-checkbox v-for="(item,index) in allApi['user']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[3].authority" :indeterminate="isIndeterminateList[3].authority" @change="ChangeAll_roleStore">角色</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['authority']" @change="Change_roleStore">
            <el-checkbox v-for="(item,index) in allApi['authority']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[4].department" :indeterminate="isIndeterminateList[4].department" @change="ChangeAll_deptStore">部门</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['department']" @change="Change_deptStore">
            <el-checkbox v-for="(item,index) in allApi['department']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[5].casbin" :indeterminate="isIndeterminateList[5].casbin" @change="ChangeAll_casbinStore">casbin</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['casbin']" @change="Change_casbinStore">
            <el-checkbox v-for="(item,index) in allApi['casbin']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item-left">
          <el-checkbox v-model="checkAlll[6].fileUploadAndDownload" :indeterminate="isIndeterminateList[6].fileUploadAndDownload" @change="ChangeAll_appStore">应用</el-checkbox>
        </div>
        <div class="line-item-right">
          <el-checkbox-group v-model="checkapi['fileUploadAndDownload']" @change="Change_appStore">
            <el-checkbox v-for="(item,index) in allApi['fileUploadAndDownload']" :key="index" :label="changevalue(item)">{{ item.description }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="button_bottom">
      <el-button size="medium" @click="submitAPI">确认</el-button>
    </div>
  </div>
</template>

<script>
import { UpdateCasbin } from '@/api/Casbin/casbin';
import { deepCopy } from '@/utils/deepCopy';
export default {
  name: 'Authapi',
  inject: ['reload'],
  props: {
    allApi: {
      type: Object,
      default() {
        return {};
      }
    },
    role: {
      type: Object,
      default() {
        return {};
      }
    },
    currentapi: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      // 全选状态
      checkAlll: [{ base: false }, { jwt: false }, { user: false }, { authority: false }, { department: false }, { casbin: false }, { fileUploadAndDownload: false }],
      // 待选中状态
      isIndeterminateList: [{ base: false }, { jwt: false }, { user: false }, { authority: false }, { department: false }, { casbin: false }, { fileUploadAndDownload: false }],
      // 当前角色选中的api
      checkapi: { base: [], jwt: [], user: [], authority: [], department: [], casbin: [], fileUploadAndDownload: [] },
      // 接口获取当前角色已有的apim,默认为第一个的
      // authApi: this.currentapi
      count: 0
    };
  },
  computed: {
    changevalue() {
      return function(item, n) {
        const data = deepCopy(item);
        for (var key in data) {
          if ((key !== 'path') && (key !== 'method')) {
            delete data['' + key];
          }
        }
        return JSON.stringify(data);
      };
    }
  },
  created() {
    this.checkapi = this.currentapi;
    // 渲染默认选中状态
    this.defaultStore();
  },
  methods: {
    // 封装多选判断方法
    ChangeAll(val, str, num) {
      // 转换后的JSON存储
      const data = [];
      // 拷贝对象
      const deep = deepCopy(this.allApi[str]);
      deep.forEach(res => {
        for (var key in res) {
          if ((key !== 'path') && (key !== 'method')) {
            delete res['' + key];
          }
        }
        data.push(JSON.stringify(res));
      });
      this.checkapi[str] = val ? data : [];

      this.isIndeterminateList[num][str] = false;
    },
    // 默认渲染选中状态
    defaultStore() {
      this.count = 0;
      for (var key in this.allApi) {
        if (this.allApi[key + ''].length === this.checkapi[key + ''].length) {
          this.checkAlll[this.count][key + ''] = true;
        } else if (this.checkapi[key + ''].length > 0 && this.checkapi[key + ''].length < this.allApi[key + ''].length) {
          this.isIndeterminateList[this.count][key + ''] = true;
        }
        this.count++;
      }
    },
    // 单选判断方法封装
    Channge_Store (num, str, value) {
      const checkedCount = value.length;
      this.checkAlll[num][str] = checkedCount === this.allApi[str].length;
      this.isIndeterminateList[num][str] = checkedCount > 0 && checkedCount < this.allApi[str].length;
    },
    ChangeAll_baseStore (val) {
      this.ChangeAll(val, 'base', 0);
    },
    ChangeAll_jwtStore (val) {
      this.ChangeAll(val, 'jwt', 1);
    },
    ChangeAll_userStore (val) {
      this.ChangeAll(val, 'user', 2);
    },
    ChangeAll_roleStore (val) {
      this.ChangeAll(val, 'authority', 3);
    },
    ChangeAll_deptStore (val) {
      this.ChangeAll(val, 'department', 4);
    },
    ChangeAll_casbinStore (val) {
      this.ChangeAll(val, 'casbin', 5);
    },
    ChangeAll_appStore (val) {
      this.ChangeAll(val, 'fileUploadAndDownload', 6);
    },
    Change_baseStore (value) {
      this.Channge_Store(0, 'base', value);
    },
    Change_jwtStore (value) {
      this.Channge_Store(1, 'jwt', value);
    },
    Change_userStore (value) {
      this.Channge_Store(2, 'user', value);
    },
    Change_roleStore (value) {
      this.Channge_Store(3, 'authority', value);
    },
    Change_deptStore (value) {
      this.Channge_Store(4, 'department', value);
    },
    Change_casbinStore (value) {
      this.Channge_Store(5, 'casbin', value);
    },
    Change_appStore (value) {
      this.Channge_Store(6, 'fileUploadAndDownload', value);
    },
    // 修改API
    submitAPI() {
      var data = {
        authorityId: this.role.authorityId,
        casbinInfos: []
      };
      for (var key in this.checkapi) {
        this.checkapi[key].forEach(res => {
          data['casbinInfos'].push(JSON.parse(res));
        });
      }
      console.log(data);
      UpdateCasbin(data).then((res) => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
    Noto Color Emoji;
  font-variant-numeric: tabular-nums;
}
.manager-group-name {
  color: black;
  height: 50px;
  padding: 0px 20px 0;
  font-weight: 600;
  line-height: 58px;
  border-bottom: 1px solid #eeecec;
  text-align: left;
  font-size: 14px;
}
.group-config {
  margin: 0 20px;
  // background-color:#dbadad;
}
.group-config .config-line {
  text-align: left;
  display: flex;
  position: relative;
}
.group-config .config-line:after {
  // background-color: #1f2d3d;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background: #eeecec;
  content: "";
}
.config-line{
  .line-item-left {
    // background-color:red;
    width: 100px;
    color: #1f2d3d;
    font-size: 14px;
    display: inline-block;
    padding: 20px 0;
    vertical-align: top;
  }
  .line-item-right {
  // width: 180px;
    flex: 1;
    color: #1f2d3d;
    font-size: 14px;
    display: inline-block;
    padding: 20px 0;
    vertical-align: top;
    .el-checkbox-group{
       display:flex;
       flex-wrap: wrap;
      .el-checkbox{
        margin-bottom: 5px;

      }
    }
}
}
//左侧
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #0db3a6;
  border-color: #0db3a6;
}
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0db3a6;
  border-color: #0db3a6;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0db3a6;
}
::v-deep .el-checkbox__inner {
  background-color: rgb(255, 255, 255);
}
.button_bottom{
  position: absolute;
  bottom: 20px;
  right: 20px;
  text-align: left;
  .el-button{
      background-color: #0db3a6;
      // padding: ;
      color: white;
      border: 1px solid #0db3a6;
  }
}
</style>
