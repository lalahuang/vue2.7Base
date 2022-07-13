import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { usePermissionStore } from '@/stores/permission'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/login/index', '/auth-redirect', '/bind', '/register', '/que']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const settingStore = useSettingsStore()
  const permissionStore = usePermissionStore()
  NProgress.start()
  if (getToken()) {
    to.meta.title && settingStore.setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login' || to.path === '/login/index') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (userStore.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        userStore
          .GetInfo()
          .then(() => {
            permissionStore.GenerateRoutes().then((accessRoutes) => {
              router.addRoutes(accessRoutes as any)
              next({ ...to, replace: true })
            })
          })
          .catch((err) => {
            userStore.LogOut().then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      userStore.SET_NAME('')
      userStore.SET_ROLES([])
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
