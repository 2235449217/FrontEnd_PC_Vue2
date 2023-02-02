<template>
  <div class="user">
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules">
        <el-form-item label="原密码" prop="oldpassword">
          <el-input v-model="ruleForm.oldpassword" type="text" />
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
    <base-nav />
    <div class="main-container">
      <div class="info-container team-container">
        <div class="team-info-detail">
          <div class="fx-row-info-panel">
            <div class="label">通讯录头像</div>
            <div class="content">
              <div class="x-avatar">
                <img :src="'https://www.cppwnn.top/api/'+personal.headerImg" alt="">
              </div>
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :http-request="handleFileUpload"
              >
                <span>修改</span>
              </el-upload>
            </div>
          </div>
          <div class="fx-row-info-panel">
            <div class="label">通讯录姓名</div>
            <div class="content">
              <span class="content-row">{{ personal.userName }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="info-container user-container">
        <div class="team-info-detail">
          <div class="fx-row-info-panel">
            <div class="label">手机</div>
            <div class="content">
              <span class="content-row">{{ personal.phone }}</span>
              <el-popover
                v-model="phone"
                trigger="click"
                placement="bottom-start"
                popper-class="monitor-yt-popover"
              >
                <div class="x-popup">
                  <input ref="phone" maxlength="11" type="search">
                  <div>
                    <button @click="phone=false">取消</button>
                    <button @click="changePersonal('phone')">确定</button>
                  </div>
                </div>
                <span slot="reference" @click="getpersonal('phone')">修改</span>
              </el-popover>
            </div>
          </div>
          <div class="fx-row-info-panel">
            <div class="label">邮箱</div>
            <div class="content">
              <span class="content-row">{{ personal.email }}</span>
              <el-popover
                v-model="email"
                trigger="click"
                placement="bottom-start"
                popper-class="monitor-yt-popover"
              >
                <div class="x-popup">
                  <input ref="email" type="search">
                  <div>
                    <button @click="email=false">取消</button>
                    <button @click="changePersonal('email')">确定</button>
                  </div>
                </div>
                <span slot="reference" @click="getpersonal('email')">修改</span>
              </el-popover>
            </div>
          </div>
          <div class="fx-row-info-panel">
            <div class="label">密码</div>
            <div class="content">
              <span style="cursor: pointer; color:#10b4a7" @click="changePersonal('password')">修改</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import BaseNav from '@/components/BaseNav';
import { getUserInfo, changePassword, change, getupload } from '@/api/System/user';
import { encrypt } from '@/utils/rsaEncrypt';
export default {
  inject: ['reload'],
  name: 'UserSetting',
  components: { BaseNav },

  data() {
    var checkoldpassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      imageUrl: '',
      ruleForm: {
        'pass': '',
        'oldpassword': '',
        'checkPass': '',
        'username': ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        oldpassword: [{ validator: checkoldpassword, trigger: 'blur' }]
      },
      // 待修改值
      value: '',
      // 接收用户信息
      personal: {
      },
      name: false,
      phone: false,
      email: false,
      password: false,
      base: '',
      dialogFormVisible: false
      //
    };
  },
  created() {
    getUserInfo().then(res => {
      this.personal = res.data.userInfo;
      console.log(this.personal);
      const filterarr = ['CreateBy', 'CreatedAt', 'UpdateBy', 'UpdatedAt', 'activeColor',
        'authority', 'authorityId', 'baseColor', 'dept', 'sideMode'];
      for (var key in (this.personal)) {
        filterarr.find((item) => {
          if (key === item) {
            delete this.personal[key];
          }
        });
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 校验成功判断后端密码是否一致
        if (valid) {
          const data = {};
          data.newPassword = encrypt(this.ruleForm.pass);
          data.username = this.personal.userName;
          data.Password = encrypt(this.ruleForm.oldpassword);
          console.log(data);
          changePassword(data).then(() => {
            console.log(data);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    message(msg, type, that) {
      console.log(that);
      that.$message({
        message: msg,
        type: type
      });
    },
    modifyPicture(command) {
      console.log(command);
    },
    getpersonal(val) {
      this.$refs[val].value = this.personal[val];
      // console.log(this.value);
    },
    // 确定后调用=修改接口逻辑
    changePersonal(val) {
      // console.log(this.$refs[val].value);
      const data = {};
      data.ID = this.personal.ID;
      data.uuid = this.personal.uuid;
      console.log(data);
      console.log(val);

      if (val === 'password') {
        // 此方法仅显示修改密码框
        this.dialogFormVisible = true;
      } else if (val === 'phone') {
        data.phone = this.$refs[val].value;
        if (data.phone.length === 11) {
          change(data).then(res => {
            this.reload();
          });
          console.log(this.$options.methods);
          const that = this;
          this.$options.methods.message('修改成功', 'success', that);
        } else {
          const that = this;
          this.$options.methods.message('格式错误', 'error', that);
        }
      } else if (val === 'email') {
        data.email = this.$refs[val].value;
        change(data).then(res => {
          this.reload();
        });
        const that = this;
        this.$options.methods.message('修改成功', 'success', that);
        console.log(data);
      } else if (val === 'token') {
        console.log('11');
      }
    },
    // 上传成功的函数
    handleAvatarSuccess(res, file) {
    },
    beforeAvatarUpload(file) {
      console.log('11');
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleFileUpload(fileObject) {
      console.log(fileObject);
      const fd = new FormData();
      fd.append('file', fileObject.file);
      fd.forEach((key, value) => {
        console.log('key %s: value %s', key, value);
      });
      getupload(fd).then((uploadRes) => {
        const res = uploadRes.data.file.url;
        const data = {};
        data.ID = this.personal.ID;
        data.uuid = this.personal.uuid;
        data.headerImg = res;
        console.log(data);
        change(data).then(res => {
          this.reload();
        });
      });
    }
  }
};
</script>
<style lang="scss">
@import '@/styles/color.scss';
 .user{
    display: flex;
    flex-direction: column;
      background-color:#f7f7f7;
    height:100vh;
  .footer {
    width: 100%;
    height: 60px;
      border-bottom: 1px solid #e9e9e9;
    background-color:rgb(255, 255, 255);
  }
  .main-container{
    font-size: 14px;;
    width: 1205px;
    margin: 20px auto 0;
    .info-container{
      margin-bottom: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 3px 0 rgb(0 0 0 / 5%);
      .team-info-detail{
        padding: 10px;
        .fx-row-info-panel{
          display: flex;
          min-height: 70px;
          border-bottom: 1px solid #e9e9e9;
          .label{
            flex: none;
            width: 130px;
            padding: 25px 0;
            line-height:20px;
            font-size:14px;
            text-align: center;
            background-color: #f9f9f9;
          }
          .content{
            display: flex;
            align-items: center;
            line-height:36px;
            flex: auto;
            padding: 17px 20px;
            span:nth-child(2){
              display: inline-block;
              text-align: left;
              cursor: pointer;
              color: $address_btn_color;
            }
            .x-avatar{
              width: 40px;
              height: 40px;
              line-height:40px;
              font-size: 20px;
              background: #fff;
              display: inline-block;
              overflow: hidden;
              color: #fff;
              text-align: center;
              vertical-align: middle;
              border-radius: 50%;
              img{
                width: 40px;height: 40px;
              }
            }
            .avatar-uploader{
              display:flex;
              align-items: center;
              .el-upload--text{
                margin-left: 15px;;
                color: $address_btn_color;
                border: none;
              }
            }
            .content-row{
              line-height:36px;
              margin-right: 15px;
            }
            .x-button{
              color: $address_btn_color;
              background: transparent;
              border-color: transparent;
              height: 32px;
              padding: 0 20px;
              line-height: 30px;
              font-weight: 400;
              font-size: 14px;
              text-align: center;
              border-radius: 3px;
              outline: none;
              cursor: pointer;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              label{
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
//修改框样式
.monitor-yt-popover{

   display:flex;
   justify-content: center;
   min-width: 200px;
   max-width: 300px;
   background-color: #fff;
   border: 1px solid #d9d9d9;
   transition: border-color .2s;
   transition:0.5s;

   .x-popup{

      box-sizing: content-box;
     width: 100%;
     input{
      border-radius: 2px;
      text-indent: 5px;
      border: 1px solid #d9d9d9;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      outline: none;
      color: #1f2d3d;
      background: transparent;
      padding: 4px 8px;
      font-size: 12px;
      line-height: 14px;
     }
     div{
       margin-top:10px;
       text-align: right;
       button{
        height: 24px;
        padding: 0 16px;
        font-size: 12px;
        line-height: 22px;
        border-radius: 3px;
        cursor: pointer;
         transition: background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
         transition: box-shadow .3s ease,background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
       }
       button:nth-child(1){
        border: 1px solid #d9d9d9;
        color: #1f2d3d;
        background: #fff;
        border-color: #d9d9d9;
        &:hover{
         background-color: rgba(233, 233, 233)
        }
       }
        button:nth-child(2){
        color: white;
        border: 1px solid #d9d9d9;
        background: $address_btn_color;
        border-color: $address_btn_color;
         &:hover{
         background-color:#56cac1;

        }
       }
     }
   }
}
.el-dialog{
  width: 400px;
  height: 470px;
  .el-dialog__header{
    border-bottom: 1px solid #e9e9e9;
    .el-dialog__title{
      font-size: 16px;
      font-weight: 600;
    }
  }
  .el-dialog__body{
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
    .el-form{
      .el-form-item{
            margin-bottom: 10px;
            .el-form-item__label{
              color:#343435;
              height: 30px;
              }
            .el-form-item__content{
              .el-input{
                .el-input__inner{
                  height:36px;
                }
              }
            }
      }
    }
  }
  .el-dialog__footer{
    position:absolute;
    bottom: 0px;
    right: 0px;
    .dialog-footer{
       button:nth-child(1){

          &:hover{
          background-color:  rgb(233, 233, 233);
          border-color:rgb(233, 233, 233) ;
          color: #1f2d3d;
          }
        }
         button:nth-child(2){
           border-color: rgb( 86, 202, 193);
          //  color: #1f2d3d;
           background-color:$address_btn_color;
           color: white;
          &:hover{
          background-color: rgb( 86, 202, 193);

          }
        }
    }
  }
}
//用户选择头像
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
