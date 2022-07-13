/*
 * @Author: hzm
 * @Date: 2022-07-12 15:31:21
 * @Description:
 */

/*
 * @Author: hzm
 * @Date: 2022-07-12 13:23:35
 * @Description:
 */
import { defineStore } from 'pinia'
import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import InnerLink from '@/layout/components/InnerLink/index.vue'
// 匹配views里面所有的.vue文件

const modules = import.meta.glob('../views/**/*.vue')
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),
  getters: {},
  actions: {
    SET_ROUTES(routes) {
      const self = this as any
      self.addRoutes = routes
      self.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES(routes) {
      const self = this as any
      self.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES(routes) {
      const self = this as any
      // 顶部导航菜单默认添加统计报表栏指向首页
      // const index = [
      //   {
      //     path: 'index',
      //     meta: { title: '统计报表', icon: 'dashboard' },
      //   },
      // ]
      self.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS(routes) {
      const self = this as any
      self.sidebarRouters = routes
    },
    GenerateRoutes() {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          router.addRoutes(asyncRoutes)
          const self = this as any
          self.SET_ROUTES(rewriteRoutes)
          self.SET_SIDEBAR_ROUTERS(constantRoutes.concat(sidebarRoutes))
          self.SET_DEFAULT_ROUTES(sidebarRoutes)
          self.SET_TOPBAR_ROUTES(sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    },
  },
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  let children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = (lastRouter as any).path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  // console.log('view: ', view)
  // console.log('modules', modules)
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    // console.log('dir: ', dir)
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

// export const loadView = (view) => {
//   // if (process.env.NODE_ENV === 'development') {
//   //   return (resolve) => require([`@/views/${view}`], resolve)
//   // } else {
//   //   // 使用 import 实现生产环境的路由懒加载
//   //   return () => import(`@/views/${view}`)
//   // }
//   //@ts-ignore
//   return (resolve) => require([`@/views/${view}`], resolve)
// }
