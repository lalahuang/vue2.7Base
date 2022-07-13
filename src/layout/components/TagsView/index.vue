<template>
  <div id="tags-view-container"
       class="tags-view-container">
    <div class="tags-view">
      <!--添加左移箭头-->
      <el-tabs v-model="currPath"
               class="tags-view-tabs"
               type="card"
               @tab-click="routerTo"
               @tab-remove="closeSelectedTag">
        <el-tab-pane v-for="tag in visitedViews"
                     ref="tag"
                     :title="tag"
                     :tag="tag"
                     :key="tag.path"
                     :class="isActive(tag)?'active':''"
                     :label="tag.title"
                     :name="tag.path"
                     :closable="!isAffix(tag)">
          <template slot="label">
            <div class="tab-label-desc"
                 @contextmenu.prevent="openMenu($event,tag)">{{tag.title}}</div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <ul v-show="visible"
          :style="{left:left+'px',top:top+'px'}"
          class="contextmenu">
        <li @click="refreshSelectedTag(selectedTag)">刷新</li>
        <li v-if="!isAffix(selectedTag)"
            @click="closeSelectedTag(selectedTag.path)">关闭</li>
        <li @click="closeOthersTags">关闭其他</li>
        <li @click="closeAllTags(selectedTag)">关闭所有</li>
      </ul>
    </div>
  </div>
</template>

<script >
// import ScrollPane from './ScrollPane.vue';
import { useTagsStore } from '@/stores/tagsView';
import { usePermissionStore } from '@/stores/permission';
import { getNormalPath } from '@/utils/ruoyi';
export default {
  // components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: { meta: {}, path: '' },
      affixTags: [],
      tabsValue: 1,
      currPath: '',
    };
  },

  computed: {
    visitedViews() {
      return useTagsStore().visitedViews;
    },
    routes() {
      return usePermissionStore().routes;
    },
  },
  watch: {
    $route(to, from) {
      this.addTags();
      this.moveToCurrentTag();
      this.currPath = this.$route.path;
      if (from.path === '/login/index') {
        this.closeSelectedTag('/login/index');
      }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
  },
  mounted() {
    this.initTags();
    this.addTags();
    this.currPath = this.$route.path;
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = '') {
      let tags = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = getNormalPath(basePath + '/'+ route.path); 
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          useTagsStore().addVisitedView(tag)
          // this.$store.dispatch('tagsView/addVisitedView', tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        useTagsStore().addView(this.$route)
        // this.$store.dispatch('tagsView/addView', this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          const tagData = tag.$attrs.tag;
          if (tagData.path === this.$route.path) {
            // this.$refs.scrollPane.moveToTarget(tag);
            this.currPath = this.$route.path;
            // when query is different then update
            if (tagData.fullPath !== this.$route.fullPath) {
              useTagsStore().updateVisitedView(this.$route)
              // this.$store.dispatch('tagsView/updateVisitedView', this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      
      useTagsStore().delCachedView(view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: `/redirect${fullPath}`,
          });
        });
      });
    },
    closeSelectedTag(tagName) {
      const index = this.visitedViews.findIndex(
        (item) => item.path === tagName
      );
      const itemData = this.visitedViews[index];
      useTagsStore().delView(itemData)
        .then(({ visitedViews }) => {
          if (itemData.path === this.currPath) {
            this.toLastView(visitedViews, itemData);
          }
          // if (this.isActive(view)) {
          //   this.toLastView(visitedViews, view);
          // }
        });
    },

    closeOthersTags() {
      this.$router.push(this.selectedTag);
   
        useTagsStore().delOthersViews(this.selectedTag).then(() => {
          this.moveToCurrentTag();
        });
    },

    closeAllTags(view) {
      useTagsStore().delAllViews(this.selectedTag).then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },

    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: `/redirect${view.fullPath}` });
        } else {
          this.$router.push('/');
        }
      }
    },

    openMenu(e, tag) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY - 72 + 10; // 头部header部分有72的高度 10为留白距离
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
    routerTo(tab) {
      const tag = tab.$attrs.tag;
      // if (this.currPath === tag.path) { return; }
      this.$router.push({
        path: tag.path,
        query: tag.query,
        fullPath: tag.fullPath,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  //左移箭头
  .tabs-control-prev {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 40px;
  }

  .tags-view-tabs {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: $tagviewBarHeight;
      line-height: $tagviewBarHeight;
      border: 1px solid $gray-4;
      border-top: 0px;
      color: $gray-7;
      background: #fff;
      padding: 0 28px;
      font-size: 12px;
      // margin-left: 5px;
      margin-left: -1px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: $gray-4;
        color: $gray-9;
        // border-color: #42b983;
        // 去掉圆点
        // &::before {
        //   content: "";
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 4px 0px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: $gray-8;
    box-shadow: $--box-shadow-base;
    li {
      margin: 0;
      padding: 7px 24px;
      cursor: pointer;
      &:hover {
        background: $--color-primary-lighter;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-tabs {
  .el-tabs__header {
    background: #f5f7fa;
    border-bottom: 1px solid $gray-4 !important;
    -webkit-box-shadow: $--box-shadow-light;
    -moz-box-shadow: $--box-shadow-light;
    box-shadow: $--box-shadow-light;
    .el-tabs__nav-wrap {
      &.is-scrollable {
        // 出现滑动条时
        padding: 0 40px;
        .el-tabs__nav {
          .el-tabs__item {
            &:first-child {
              // 有滚动时的给第一条加左边框
              border-left: 1px solid $gray-4 !important;
            }
          }
        }
        .el-tabs__nav-prev,
        .el-tabs__nav-next {
          width: 40px;
          text-align: center;
          line-height: $tagviewBarHeight;
          color: $gray-4;
          background: #fff !important;
          &.is-disabled {
            //其实是可用
            color: $gray-8;
          }
        }
      }
      .el-tabs__nav {
        border-top: none !important;
        border-left: none !important;
        border-bottom: none !important;
        border-radius: 0px !important;
        border-color: $gray-4;
        .el-tabs__item {
          position: relative;
          padding: 0px !important;
          outline: none;
          border-left: 1px solid $gray-4;
          &:first-child {
            border-left-width: 0;
          }
          .tab-label-desc {
            // display: inline;
            padding: 0 24px;
          }
          .el-icon-close {
            position: absolute;
            top: 13px;
            right: 8px;
          }
          &.is-active {
            color: #409eff;
            background-color: #fff;
            border-right-color: $gray-4;
            border-left-color: $gray-4;
            border-bottom: 1px solid $gray-4;
          }
        }
      }
    }
  }
  .el-tabs__content {
    padding: 0 !important;
  }
}
</style>
