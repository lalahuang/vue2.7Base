<template>
  <div class="drawer-container">

    <!-- <div class="drawer-item">
      <span>Theme Color</span>
      <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;"
                    @change="themeChange" />
    </div> -->

    <!-- <div class="drawer-item">
      <span>主题色</span>
      <el-switch v-model="tagsView"
                 class="float-right" />
    </div> -->

    <!-- <div class="drawer-item">
      <span>开启Tags-View</span>
      <el-switch v-model="fixedHeader"
                 class="float-right" />
    </div> -->

    <!-- <div class="drawer-item">
      <span>开启平铺模式</span>
      <el-switch v-model="fullScreen"
                 class="float-right" />
    </div> -->

    <!-- <div class="drawer-item">
      <span>侧边栏</span>
      <el-switch v-model="sidebarLogo"
                 class="float-right" />
    </div> -->
    <div class="drawer-item">
      <span>居中模式</span>
      <el-switch v-model="centerLayout"
                 class="float-right" />
    </div>
    <div class="drawer-item">
      <span>显示状态栏</span>
      <el-switch v-model="statusBar"
                 class="float-right" />
    </div>
    <div class="drawer-item">
      <span>开启标签</span>
      <el-switch v-model="tagsView"
                 class="float-right" />
    </div>
    <!-- <div class="drawer-item">
      <span>迷你菜单</span>
      <el-switch v-model="openSilebar"
                 class="float-right" />
    </div> -->
    <!-- <div class="drawer-item">
      <span>皮肤</span>
      <el-select v-model="skin"
                 class="float-right"
                 placeholder="请选择">
        <el-option v-for="item in skins"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
          <span style="float: left">{{ item.name }}</span>
          <span class="item-color"
                :style="{background:item.color}"></span>
        </el-option>
      </el-select>
    </div> -->

    <div class="drawer-item">
      <el-button size="small"
                 type="primary"
                 plain
                 icon="el-icon-document-add"
                 @click="saveSetting">保存配置</el-button>
      <el-button size="small"
                 plain
                 icon="el-icon-refresh"
                 @click="resetSetting">重置配置</el-button>
    </div>
  </div>
</template>

<script>
import defaultSettings from '@/settings';

export default {
  data() {
    return {
      skins: defaultSettings.skins || {},
    };
  },
  computed: {
    centerLayout: {
      get() {
        return this.$store.state.settings.centerLayout;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'centerLayout',
          value: val,
        });
      },
    },
    statusBar: {
      get() {
        return this.$store.state.settings.statusBar;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'statusBar',
          value: val,
        });
      },
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val,
        });
      },
    },
    // openSilebar: {
    //   get() {
    //     return !this.$store.state.app.sidebar.opened;
    //   },
    //   set() {
    //     this.$store.dispatch('app/toggleSideBar');
    //   },
    // },
    skin: {
      get() {
        return this.$store.state.settings.skin;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'skin',
          value: val,
        });
      },
    },
  },
  methods: {
    saveSetting() {
      const loading = this.$loading({
        lock: true,
        fullscreen: false,
        text: '正在保存到本地，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      localStorage.setItem(
        'layout-setting',
        `{
            "centerLayout":${this.centerLayout},
            "statusBar":${this.statusBar},
            "tagsView":${this.tagsView},
            "skin":"${this.skin}"
          }`
      );
      setTimeout(() => {
        loading.close();
        this.msgSuccess('保存成功!');
      }, 1000);
      // setTimeout(loading.close(), 1000);
    },
    resetSetting() {
      this.$loading({
        lock: true,
        fullscreen: false,
        text: '正在清除设置缓存并刷新，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      localStorage.removeItem('layout-setting');
      setTimeout('window.location.reload()', 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    span {
      height: 40px;
      line-height: 40px;
    }
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .float-right {
    float: right;
  }
}
</style>

<style lang="scss">
.item-color {
  margin-top: 11px;
  float: right;
  width: 20px;
  height: 12px;
  border-radius: 2px;
}
</style>