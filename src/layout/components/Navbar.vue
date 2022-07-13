<template>
  <div class="navbar container-fluid"
       id="header_nav">
    <!--Logo-->
    <div class="logo"
         :class="sidebar.opened?'':'mini-logo'">
      <img :src="logo" class="logo-image"
           id="logo" />
      <!-- <div class="logo-image"></div> -->
    </div>

    <!--项目副Logo-->
    <div class="navbar-project"
        >
      <div class="navbar-project-title">{{title}}</div>
    </div>

    <!--面包屑-->
    <!-- <breadcrumb id="breadcrumb-container"
                class="breadcrumb-container" /> -->
    <top-nav id="topmenu-container"
             class="topmenu-container"
             v-if="topNav && topbarRouters.length > 0 && name" />

    <!--右侧栏-->
    <div class="right-menu">
      <!--设置-->
      <!-- <div class="right-menu-item hover-effect"
           id="opt_settings"
           @click="handleSettings()">
        <i class="el-icon-setting"></i>
      </div> -->
      <el-dropdown class="right-menu-item avatar-container hover-effect"
                   trigger="click"
                   v-if="name">
        <div class="avatar-wrapper">
          <el-avatar class="user-avatar" :src="avatar || defaultAvatar">
            <img :src="defaultAvatar" />
          </el-avatar>          
          <!-- <img :src="avatar||defaultAvatar"
               class="user-avatar" /> -->
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown"
                          class="user-dropdown">
          <!-- <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided
                            @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <div class="right-menu-item"
           id="opt_settings"
           @click="handleHelp()"
           v-if="name">
        <i class="el-icon-question"></i>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import Logo from '@/assets/images/logo.png';
import DefaultAvatar from '@/assets/images/avatar.png';
import defaultSettings from '@/settings';
import TopNav from './TopNav/index.vue';
// import Settings from './Settings/Index.vue';
// import Breadcrumb from '@/components/Breadcrumb/Index.vue'
import { useSettingsStore } from '@/stores/settings';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';
export default {
  components: {
    TopNav,
    // Breadcrumb,
    // Settings,
  },
  data() {
    return {
      logo: Logo,
      title: defaultSettings.title || '',
      defaultAvatar: DefaultAvatar,
      showSettingsPanel: false,
    };
  },
  computed: {
    // ...mapGetters([
    //   'sidebar',
    //   'avatar',
    //   'device',
    //   'name',
    //   'statusBar',
    // ]),
    ...mapState(useUserStore,{
      name: (state) => state.name,
      avatar:(state) => state.avatar,
    }),
    ...mapState(useAppStore,{
      sidebar: (state) => state.sidebar,
      device: (state) => state.device,
    }),
    ...mapState(useSettingsStore,{
      topNav: (state) => state.topNav,
    }),
    ...mapState(usePermissionStore,{
      topbarRouters: (state) => state.topbarRouters,
    }),
   
  },
  mounted() {},

  methods: {
    // 退出登录
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        
        useUserStore().LogOut().then(() => {
          location.reload();
          // location.href = '/index';
        });
      });
    },

    // 设置按钮
    handleSettings() {
      this.$emit('openChange');
    },

    handleHelp() {
      this.$message({
        showClose: true,
        message: '暂无帮助内容',
        type: 'error',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: $navBarHeight;
  position: relative;
  // box-shadow: $--box-shadow-light;
  // logo相关
  .logo {
    // position: relative;
    width: 120px;
    .logo-image {
      float: left;
      position: relative;
      margin-top: 23px;
      height: 26px;
    }
    // 侧边栏缩小图标的格式
    &.mini-logo {
      width: 100px;
      .logo-image {
        // position: absolute;
        // top: 6px;
        // left: -1px;
        // width: 80px;
        // height: 60px;
        // z-index: 99999;
      }
    }
  }

  // 顶部菜单
  .topmenu-container {
    float: left;
    margin-left: 24px;
    height: $navBarHeight;
    line-height: $navBarHeight;
    border-bottom-width: 0px;
    background: none;
  }

  // 右侧
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: $navBarHeight;
      line-height: $navBarHeight;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 14px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 100%;
          border: 1px solid $gray-3;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 16px;
          font-size: 12px;
          color: $gray-6;
        }
      }
    }
  }
}
</style>