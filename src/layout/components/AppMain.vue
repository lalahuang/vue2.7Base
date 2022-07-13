<template>
  <section class="app-main"
           id="main_container">
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
    <!-- </transition> -->
  </section>
</template>

<script lang="ts">
import { useTagsStore } from '@/stores/tagsView';
import { mapState } from 'pinia';
export default {
  name: 'AppMain',
  computed: {
     ...mapState(useTagsStore,{
      cachedViews: (state) => state.cachedViews,
    }),
   
    key() {
      return this.$route.path;
      // return this.$route.fullPath
    },
  },
};
</script>
