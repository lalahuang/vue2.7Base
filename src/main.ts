import Vue from 'vue'
import Cookies from 'js-cookie'
import '@/assets/styles/normalize.css' // A modern alternative to CSS resets
// import '@/assets/styles/element-variables.scss';
// import 'element-ui/packages/theme-chalk/src/index.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // global css
import 'windi.css'
// import '@/assets/styles/mixin.scss';
// import '@/assets/styles/variables.scss';
import Element from 'element-ui'
// import '@/assets/styles/index.scss' // global css
// import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App.vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Router from 'vue-router'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'
import 'virtual:svg-icons-register'
import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
} from '@/utils/ruoyi'
// 分页组件
import Pagination from '@/components/Pagination/index.vue'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar/index.vue'
// 富文本组件
import Editor from '@/components/Editor/index.vue'
// 文件上传组件
import FileUpload from '@/components/FileUpload/index.vue'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload/index.vue'
// 图片预览组件
import ImagePreview from '@/components/ImagePreview/index.vue'
// 字典标签组件
import DictTag from '@/components/DictTag/index.vue'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})

Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
// Router 必须在pinia之后
Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

new Vue({
  el: '#app',
  pinia,
  router,
  render: (h) => h(App),
})
