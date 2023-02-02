<template>
  <div id="container">
    <header><h1>工作流平台LOGO</h1></header>
    <div id="login-container">
      <div id="login-container-banner">
        <img class="banner-background" src="https://images.jdycdn.com/3406d294-f491-4256-b78f-1b679930a063" alt="">
      </div>
      <div id="login-container-form">
        <span class="form-tittle">欢迎使用工作流平台</span>
        <div class="form-container">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="top" label-width="80px">
            <el-form-item prop="username">
              <span>账号</span>
              <el-input v-model="loginForm.username" />
            </el-form-item>
            <el-form-item prop="password">
              <span>密码</span>
              <el-input v-model="loginForm.password" :show-password="true" />
            </el-form-item>
            <span class="item-label">验证码</span>
            <div class="login-code">
              <el-input v-model="loginForm.captcha" />
              <img :src="codeUrl" @click="getCode">
            </div>
            <div class="container-row-items">
              <el-checkbox v-model="loginForm.rememberMe">下次自动登录</el-checkbox>
              <!-- <a class="forget-password">忘记密码了?</a> -->
            </div>
          </el-form>
          <el-button type="primary" :loading="loading" @click="submit">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
// import { encrypt } from '@/utils/rsaEncrypt';
import Config from '@/settings';
import { getCodeImg } from '@/api/login';
export default {
  data() {
    return {
      codeUrl: require('@/assets/start.png'),
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        captcha: '',
        captchaId: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        captcha: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined
    };
  },
  created() {
    this.getCode();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.data.picPath;
        this.loginForm.captchaId = res.data.captchaId;
      });
    },
    getCookie() {
      const username = Cookies.get('username');
      let password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password;
      password = password === undefined ? this.loginForm.password : password;
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        captcha: ''
      };
    },
    submit() {
      this.$refs.loginForm.validate(valid => {
        // 校验成功
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          captcha: this.loginForm.captcha,
          captchaId: this.loginForm.captchaId
        };
        // if (user.password !== this.cookiePass) {
        //   // 加密密码
        //   user.password = encrypt(user.password);
        // }
        if (valid) {
          this.loading = true;
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Config.passCookieExpires });
            Cookies.set('password', user.password, { expires: Config.passCookieExpires });
            Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch('Login', user).then(() => {
            this.loading = false;
            this.$router.push({ path: this.redirect || '/' });
          }).catch(() => {
            this.loading = false;
            this.getCode();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/button.scss";
$container-bg:#f7f7f7;
$form-bg:#fff;
$text:#1f2d3d;
$base:#0db3a6;
#container {
  overflow-x:hidden;
  width: 100vw;
  height: 100vh;
  background: $container-bg;
  header {
    h1 {
      margin: 0;
      position: absolute;
    }
  }
  #login-container {
    position:absolute;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
    display:flex;
    box-shadow: 0 2px 8px 0 hsl(0deg 0% 86% / 50%);
    #login-container-banner {
      width:360px;
      height: 478px;
      .banner-background {
        width: 100%;
        height: 100%;
        border-radius: 2px 0 0 2px;
      }
    }
    #login-container-form{
      width:400px;
      color:$text;
      background:$form-bg;
      .form-tittle{
        text-align: center;
        display: block;
        height: 60px;
        color: $base;
        font-size:20px;
        font-weight: bold;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%);
        &::before{
            display: inline-block;
            content: "";
            height: 100%;
            vertical-align: middle;
        }
      }
      .form-container{
        padding: 50px 40px 0;
        .container-row-items{
          display: flex;
          justify-content:space-between;
          align-items: baseline;
          font-size: 12px;
          margin-top: 12px;
          >>>.el-checkbox__label{
            font-size: 12px;
          }
          >>>.el-checkbox__input.is-checked+.el-checkbox__label{
            color:$base;
          }
          >>>.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
            background-color: $base;
            border-color: $base;
          }
          >>>.el-checkbox__input.is-focus .el-checkbox__inner{
            border-color: $base;
          }
        }
        .forget-password{
          color:$base;
        }
        >>>.el-form-item__content{
          line-height:normal;
        }
        .login-code {
          width: 100%;
          height: 38px;
          display:flex;
          justify-content:space-between;
          img{
            cursor: pointer;
            vertical-align:middle;
            width:100%;
            height:100%;
          }
        }
      }
    }
  }

  .item-label {
    font-size: 14px;
  }
  .el-button--primary{
    width:100%;
    margin-top: 40px;
  }
  >>>.el-input.is-active .el-input__inner, >>>.el-input__inner:focus{
    border-color: $base;
  }
}
</style>
