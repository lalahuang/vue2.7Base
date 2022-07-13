<template>
  <div class="app-wrapper"
       :class="[classObj, this.sidebarHidden ? 'app-noside' : '']">

    <!--状态栏-->
    <!-- <div class="statusbar-container"
         v-if="statusBar">
      <status-bar />
    </div> -->

    <!--导航栏-->
    <div class="navbar-container">
      <navbar @openChange="openChange" />
    </div>

    <!--侧边菜单栏-->
    <sidebar class="sidebar-container"
             v-if="name && !sidebarHidden" />

    <!--左内容区-->
    <div class="main-container">
      <tags-view v-if="needTagsView && name && !sidebarHidden" />
      <!-- <tags-view v-if="false" /> -->
      <breadcrumb id="breadcrumb-container"
                  class="tags-view-container"
                  v-if="!needTagsView && name && !sidebarHidden" />
      <app-main />
    </div>

    <!--抽屈-->
    <el-drawer title="设置"
               :visible.sync="showSettingsPanel"
               direction="rtl"
               :modal="false">
      <settings />
    </el-drawer>

  </div>
</template>

<script lang="ts">

import { Navbar, Sidebar, AppMain, TagsView,  } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import Settings from './components/Settings/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { useSettingsStore } from '@/stores/settings';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import {mapState } from "pinia"
export default defineComponent({
  name: 'Layout',
  
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Settings,
    Breadcrumb,
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showSettingsPanel: false,
      sidebarHidden: false,
    };
  },
  computed: {
    ...mapState(useUserStore,{
      name: (state) => state.name,
    }),
    ...mapState(useAppStore,{
      sidebar: (state) => state.sidebar,
      device: (state) => state.device,
    }),
     ...mapState(useSettingsStore,{
      showSettings: (state) => state.showSettings,
      needTagsView: (state) => state.tagsView,
    }),
    classObj() {
      return {
        'center-wrapper': this.centerLayout,
        'show-statusbar': this.statusBar,
        'hide-sidebar': !this.sidebar.opened,
        'open-silebar': this.sidebar.open,
        'app-noside': !this.name || this.sidebarHidden,
      };
    },
  },
  created() {
    // console.log('hidden', this.$route)
    this.sidebarHidden = this.$route.meta.sidebarHidden;
  },
  watch: {
    $route(route) {
      this.sidebarHidden = this.$route.meta.sidebarHidden;
    },
  },
  methods: {
    openChange() {
      this.showSettingsPanel = !this.showSettingsPanel;
    },
  },
}) ;
</script>

<style lang="scss">
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>