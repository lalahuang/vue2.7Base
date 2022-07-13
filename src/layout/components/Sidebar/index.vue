<template>
  <div class=""
       id="right_menu">
    <div class="sidebar-header">
      <div class="sidebar-mini-logo">
        <div class="logo-image"></div>
        <!-- <img :src="logoMini"> --> -->
      </div>
      <div class="sidebar-logo">
        <!-- <img :src="logo"> -->
        <div class="logo-image"></div>
      </div>
    </div>
    <el-scrollbar warp-class="scrollbar-wrapper">
      <!--:collapse="isCollapse"-->
      <el-menu :default-active="activeMenu"
               :collapse="isCollapse"
               :unique-opened="true"
               :collapse-transition="false"
               mode="vertical">
        <sidebar-item v-for="(route,index) in sidebarRouters"
                      :key="route.path+index"
                      :item="route"
                      :base-path="route.path"
                      :disabled="true">
        </sidebar-item>
      </el-menu>
    </el-scrollbar>
    <el-tooltip effect="dark"
                :content="isCollapse ? '展开' : '收起'">
      <div class="menu-bottom"
           @click="toggleSideBar">
        <i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<script>

// import variables from '@/assets/styles/variables.scss';
import LogoMini from '@/assets/images/logo_chint_mini.png';
import Logo from '@/assets/images/logo.png';
import SidebarItem from './SidebarItem.vue';
import { useAppStore } from '@/stores/app';
import { usePermissionStore } from '@/stores/permission';

export default {
  components: {
    SidebarItem,
  },
  data() {
    return {
      logoMini: LogoMini,
      logo: Logo,
    };
  },
  created() {
    // this.$store.dispatch('permission/generateRoutes', this.userid)
    //   .then(() => {
    //     // 显示菜单后
    //   });
  },

  computed: {
    sidebar() {
      return useAppStore().sidebar
    },
    sidebarRouters() {
      return usePermissionStore().sidebarRouters
    },
    // ...mapGetters(['permission_routes', 'sidebar']),
    // routes () {
    //   return this.$router.options.routes;
    // },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },

    // variables() {
    //   return variables;
    // },

    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    toggleSideBar() {
      useAppStore().toggleSideBar()
    }
  },

};
</script>

<style lang="scss" scoped>
.menu-bottom {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
  z-index: 12;
  width: 24px;
  height: 24px;
  align-items: flex-end;
  justify-content: flex-end;
  cursor: pointer;
  // padding: 8px 17px;
  i {
    padding-right: 2px;
    padding-bottom: 2px;
    font-size: 12px;
    color: $--color-primary;
  }
}
.menu-bottom::before {
  content: ' ';
  position: absolute;
  right: -24px;
  bottom: -24px;
  width: 48px;
  height: 48px;
  // transform: rotate(45deg);
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(0, 0, 0, 0.06);
  box-shadow: $--box-shadow-light;
  z-index: 10;
}
</style>