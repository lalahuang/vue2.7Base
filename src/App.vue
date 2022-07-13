<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script >
import { useSettingsStore } from '@/stores/settings'
export default {
  name:  'App',
    metaInfo() {
        return {
            title: useSettingsStore().dynamicTitle && useSettingsStore().title,
            titleTemplate: title => {
                return title ? `${title} - ${import.meta.env.VITE_APP_TITLE}` : import.meta.env.VITE_APP_TITLE
            }
        }
    }
}
</script>
