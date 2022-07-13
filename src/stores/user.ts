/*
 * @Author: hzm
 * @Date: 2022-07-12 14:07:35
 * @Description:
 */

import { defineStore } from 'pinia'
import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    isAdmin: undefined,
  }),
  getters: {},
  actions: {
    SET_TOKEN(token) {
      const self = this as any
      self.token = token
    },
    SET_EXPIRES_IN(time) {
      const self = this as any
      self.expires_in = time
    },
    SET_NAME(name) {
      const self = this as any
      self.name = name
    },
    SET_AVATAR(avatar) {
      const self = this as any
      self.avatar = avatar
    },
    SET_ROLES(roles) {
      const self = this as any
      self.roles = roles
    },
    SET_PERMISSIONS(permissions) {
      const self = this as any
      self.permissions = permissions
    },
    SET_ISADMIN(isAdmin) {
      const self = this as any
      self.isAdmin = isAdmin
    },
    // 登录
    Login(userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const self = this as any
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            const data = res.data
            console.log('res.data: ', res.data)
            setToken(data.access_token)
            self.SET_TOKEN(data.access_token)
            setExpiresIn(data.expires_in)
            self.SET_EXPIRES_IN(data.expires_in)
            resolve('')
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo() {
      const self = this as any
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            // @ts-ignore
            const user = res?.user ?? {}
            const avatar = user.avatar == '' ? require('@/assets/images/profile.jpg') : user.avatar
            // @ts-ignore
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              // @ts-ignore
              self.SET_ROLES(res.roles)
              // @ts-ignore
              self.SET_PERMISSIONS(res.permissions)
            } else {
              self.SET_ROLES(['ROLE_DEFAULT'])
            }
            self.SET_NAME(user.userName)
            self.SET_ISADMIN(user.userId)
            self.SET_AVATAR(avatar)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 刷新token
    RefreshToken() {
      return new Promise((resolve, reject) => {
        const self = this as any
        refreshToken()
          .then((res) => {
            setExpiresIn(res.data)
            self.SET_EXPIRES_IN(res.data)
            resolve(void 0)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut() {
      return new Promise((resolve, reject) => {
        const self = this as any
        logout()
          .then(() => {
            self.SET_TOKEN('')
            self.SET_ROLES([])
            self.SET_PERMISSIONS([])
            removeToken()
            resolve(void 0)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      const self = this as any
      return new Promise((resolve) => {
        self.SET_TOKEN('')
        removeToken()
        resolve(void 0)
      })
    },
  },
})
