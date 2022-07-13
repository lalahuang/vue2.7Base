<template>
  <el-menu :default-active="activeMenu"
           class="top-menu"
           mode="horizontal"
           @select="handleSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item :index="item.path"
                    :key="index"
                    v-if="index < visibleNumber">
       
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-submenu index="more"
                v-if="topMenus.length > visibleNumber">
      <template slot="title"><span>更多</span></template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item :index="item.path"
                      :key="index"
                      v-if="index >= visibleNumber">
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
import { constantRoutes } from '@/router';
import { usePermissionStore  } from '@/stores/permission';
// 不需要激活的路由
const noactiveList = ['/user/profile', '/dict/type', '/gen/edit', '/job/log'];

export default {
  name:"TopName",
  data() {
    return {
      // 顶部栏初始数
      visibleNumber: 7,
      // 是否为首次加载
      isFrist: false,
      // 当前激活菜单的index
      currentIndex: undefined,
    };
  },
  computed: {
    // 顶部显示菜单
    topMenus() {
      let topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.path === '/') {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
      });
      return topMenus;
    },
    // 所有的路由信息
    routers() {
      return usePermissionStore().topbarRouters;
    },
    // 设置子路由
    childrenMenus() {
      var childrenMenus = [];
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            if (router.path === '/') {
              router.children[item].path =
                '/redirect/' + router.children[item].path;
            } else {
              router.children[item].path =
                router.path + '/' + router.children[item].path;
            }
            router.children[item].parentPath = router.path;
          }
          childrenMenus.push(router.children[item]);
        }
      });
      return constantRoutes.concat(childrenMenus);
    },
    // 默认激活的菜单
    activeMenu() {
      const path = this.$route.path;
      let activePath = this.routers[0].path;
      if (path.lastIndexOf('/') > 0) {
        const tmpPath = path.substring(1, path.length);
        activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'));
      } else if ('/index' == path || '' == path) {
        if (!this.isFrist) {
          this.isFrist = true;
        } else {
          activePath = 'index';
        }
      }
      var routes = this.activeRoutes(activePath);
      if (routes.length === 0) {
        activePath = this.currentIndex || this.routers[0].path;
        this.activeRoutes(activePath);
      }
      return activePath;
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.setVisibleNumber);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setVisibleNumber);
  },
  mounted() {
    this.setVisibleNumber();
  },
  methods: {
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = parseInt(width / 85);
    },

    // 菜单选择事件
    handleSelect(key, keyPath) {
      this.currentIndex = key;
      if (key.indexOf('http://') !== -1 || key.indexOf('https://') !== -1) {
        // http(s):// 路径新窗口打开
        window.open(key, '_blank');
      } else if (key.indexOf('/redirect') !== -1) {
        // /redirect 路径内部打开
        this.$router.push({ path: key.replace('/redirect', '') });
      } else {
        // 显示左侧联动菜单
        this.activeRoutes(key);
      }
    },

    // 当前激活的路由
    activeRoutes(key) {
      var routes = [];
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key == item.parentPath || (key == 'index' && '' == item.path)) {
            routes.push(item);
          }
        });
      }
      if (routes.length > 0) {
         usePermissionStore().SET_SIDEBAR_ROUTERS(routes)
        // this.$store.commit('SET_SIDEBAR_ROUTERS', routes);
      }
      return routes;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item,
.el-menu--horizontal > .el-submenu {
  float: left;
  height: $navBarHeight;
  line-height: $navBarHeight;
  margin: 0;
  border-bottom: 3px solid transparent;
  color: $gray-9;
  padding: 0 4px;
  margin: 0 10px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid $color-primary;
  color: $color-primary;
}
</style>

<style lang="scss">
.top-menu {
  .el-submenu {
    .el-submenu__title {
      height: $navBarHeight;
      line-height: $navBarHeight;
      border-bottom: 3px solid transparent;
      span,
      i {
        color: $gray-9;
      }
    }
  }
}
</style>
