<template>
  <div class="nopadding-container">
    <div class="login-container">
      <div class="login-banner">
        <div class="login-banner-title">{{ title }}</div>
      </div>
      <transition name="el-fade-in-linear">
        <el-form ref="loginForm"
                 :model="loginForm"
                 :rules="loginRules"
                 class="login-form"
                 auto-complete="on"
                 label-position="left"
                 show-message>
          <div class="title-container">
            <h3 class="title">登录</h3>
          </div>

          <el-form-item class=""
                        prop="username">
            <span class="svg-container">
              <i class="el-icon-user"></i>
              <!-- <svg-icon icon-class="user" /> -->
            </span>
            <el-input ref="username"
                      size="small"
                      v-model="loginForm.username"
                      placeholder="用户名"
                      type="text"
                      tabindex="1"
                      auto-complete="on" />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <i class="el-icon-lock"></i>
              <!-- <svg-icon icon-class="password" /> -->
            </span>
            <el-input :key="passwordType"
                      ref="password"
                      size="small"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="密码"
                      name="password"
                      tabindex="2"
                      auto-complete="on"
                      @keyup.enter.native="handleLogin" />
            <span class="show-pwd"
                  @click="showPwd">
              <!-- <svg-icon :icon-class="passwordType==='password'?'eye':'eye-open'" /> -->
              <i :class="
                  passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'"></i>
            </span>
          </el-form-item>

          <el-form-item prop="code"
                        class="code-row">
            <el-input ref="code"
                      size="small"
                      v-model="loginForm.code"
                      placeholder="验证码"
                      name="code"
                      @keyup.enter.native="handleLogin" />
            <div class="login-code">
              <img :src="codeUrl"
                   @click="getCode"
                   class="login-code-img" />
            </div>
          </el-form-item>

          <div class="login-item">
            <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
            <span class="item-right">忘记密码?</span>
          </div>
          <el-button :loading="loading"
                     class="btn-inline btn-login"
                     type="primary"
                     @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import defaultSettings from '@/settings.js';

export default {
  name: 'Login',
  data() {
    return {
      title: defaultSettings.title || '',
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: true,
        code: '',
        uuid: '',
      },
      loginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        code: [
          { required: true, trigger: 'change', message: '验证码不能为空' },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    };
  },
  computed: {
    ...mapState(useUserStore,{
      name: (state) => state.name,
    }),
  },
  created() {
    this.getCode();
    this.getCookie();
  },

  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = 'data:image/gif;base64,' + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },

    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    // 登录
    handleLogin() {
      // eslint-disable-next-line consistent-return
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          // console.log('useUserStore().Login(this.loginForm): ', useUserStore().Login(this.loginForm));
          useUserStore().Login(this.loginForm).then(() => {
            
            console.log(this)
              this.$router.push({ path: this.redirect || '/' }).catch(() => {});
          }).catch(() => {
              this.loading = false;
              this.getCode();
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nopadding-container {
  // margin-left: #{-$sideBarWidth};
  // height: 500px;
  margin: 0;
  padding: 0;
  height: 500px;
}

.login-container {
  // min-height: 100%;
  margin-left: 20px;
  margin-right: 20px;
  // width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  background-size: cover;
  height: 600px;

  .login-form {
    width: 400px;
    padding: 36px;
    height: 100%;
    z-index: 9;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    display: inline-block;
    padding: 0 16px;
    color: $gray-7;
    vertical-align: middle;
    width: 30px;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
  }

  .title-container {
    position: relative;
    margin: 48px 0;
    .title {
      font-size: 20px;
      color: $gray-9;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $gray-6;
    line-height: 46px;
    cursor: pointer;
    user-select: none;
  }

  .btn-inline {
    width: 100%;
  }

  .login-banner {
    flex: 1;
    height: 100%;
    position: relative;
    text-align: center;
    background: -webkit-linear-gradient(
      45deg,
      rgba 0%,
      #1081f0 50%,
      #18ece5 100%
    );
    background: linear-gradient(45deg, rgba(1,166,83,1) 0%, rgba(1,166,83,1) 50%, rgba(153,234,59,1) 100%);
    color: white;
    &:before {
      position: absolute;
      content: ' ';
      width: 150%;
      height: 150%;
      bottom: -80%;
      left: 30%;
      // border-radius: 100%;
      transform: rotate(45deg);
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }
    &:after {
      position: absolute;
      content: ' ';
      width: 100%;
      top: 30%;
      left: 50%;
      height: 150%;
      transform: rotate(45deg);
      // border-radius: 100%;
      background: rgba(255, 255, 255, 0.05);
    }
    &-title {
      padding: 40px;
      font-size: 40px;
      font-weight: 800;
      text-align: left;
    }
  }
}
</style>

<style lang="scss">
.center-wrapper {
  .login-container {
    margin-left: 0;
    margin-right: 0;
  }
}
.login-container {
  .el-input {
    display: inline-block;
    height: 46px;
    width: 85%;
    input {
      border: 0px;
      padding: 12px 5px 12px 15px;
      color: $gray-7;
      font-size: 14px;
      caret-color: $gray-8;
    }
  }

  .el-form-item {
    height: 48px;
    line-height: 48px;
    border: 1px solid $gray-5;
    // background: rgba(0, 0, 0, 0.1);
    background: #ffffff;
    border-radius: $--input-border-radius;
    color: #454545;
  }
  .btn-login {
    height: 48px;
  }
  .login-item {
    height: 24px;
    line-height: 24px;
    margin-bottom: 22px;
    .item-right {
      float: right;
      font-size: 14px;
      color: $--color-primary;
      cursor: pointer;
    }
  }
  .code-row {
    .el-input {
      padding: 0 16px;
      width: 200px;
      input {
        line-height: 46px;
        height: 46px;
        padding: 6px 0;
      }
    }
    .login-code {
      height: 46px;
      float: right;

      img {
        cursor: pointer;
        vertical-align: middle;
        height: 46px;
      }
    }
  }
}
</style>
