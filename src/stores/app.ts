/*
 * @Author: hzm
 * @Date: 2022-07-12 13:08:58
 * @Description:
 */
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false,
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium',
  }),
  getters: {},
  actions: {
    TOGGLE_SIDEBAR() {
      const self = this as any
      self.sidebar.opened = !self.sidebar.opened
      self.sidebar.withoutAnimation = false
      if (self.sidebar.opened) {
        Cookies.set('sidebarStatus', '1')
      } else {
        Cookies.set('sidebarStatus', '0')
      }
    },
    CLOSE_SIDEBAR(withoutAnimation) {
      const self = this as any
      Cookies.set('sidebarStatus', '0')
      self.sidebar.opened = false
      self.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE(device) {
      const self = this as any
      self.device = device
    },
    SET_SIZE(size) {
      const self = this as any
      self.size = size
      Cookies.set('size', size)
    },
    toggleSideBar() {
      const self = this as any
      self.TOGGLE_SIDEBAR()
    },
    closeSideBar({ withoutAnimation }) {
      const self = this as any
      self.CLOSE_SIDEBAR(withoutAnimation)
    },
    toggleDevice(device) {
      const self = this as any
      self.TOGGLE_DEVICE(device)
    },
    setSize(size) {
      const self = this as any
      self.SET_SIZE(size)
    },
  },
})
