/*
 * @Author: hzm
 * @Date: 2022-07-12 15:56:00
 * @Description:
 */

import { defineStore } from 'pinia'
export const useTagsStore = defineStore('tag', {
  state: () => ({
    visitedViews: [],
    cachedViews: [],
  }),
  getters: {},
  actions: {
    ADD_VISITED_VIEW(view) {
      const self = this as any
      if (self.visitedViews.some((v) => v.path === view.path)) return
      self.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        })
      )
    },
    ADD_CACHED_VIEW(view) {
      const self = this as any
      if (self.cachedViews.includes(view.name)) return
      if (view.meta && !view.meta.noCache) {
        self.cachedViews.push(view.name)
      }
    },

    DEL_VISITED_VIEW(view) {
      const self = this as any
      for (const [i, v] of self.visitedViews.entries()) {
        if (v.path === view.path) {
          self.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW(view) {
      const self = this as any
      const index = self.cachedViews.indexOf(view.name)
      index > -1 && self.cachedViews.splice(index, 1)
    },

    DEL_OTHERS_VISITED_VIEWS(view) {
      const self = this as any
      self.visitedViews = self.visitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_OTHERS_CACHED_VIEWS(view) {
      const self = this as any
      const index = self.cachedViews.indexOf(view.name)
      if (index > -1) {
        self.cachedViews = self.cachedViews.slice(index, index + 1)
      } else {
        self.cachedViews = []
      }
    },

    DEL_ALL_VISITED_VIEWS() {
      // keep affix tags
      const self = this as any
      const affixTags = self.visitedViews.filter((tag) => tag.meta.affix)
      self.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS() {
      const self = this as any
      self.cachedViews = []
    },

    UPDATE_VISITED_VIEW(view) {
      const self = this as any
      for (let v of self.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },

    DEL_RIGHT_VIEWS(view) {
      const self = this as any
      const index = self.visitedViews.findIndex((v) => v.path === view.path)
      if (index === -1) {
        return
      }
      self.visitedViews = self.visitedViews.filter((item, idx) => {
        if (idx <= index || (item.meta && item.meta.affix)) {
          return true
        }
        const i = self.cachedViews.indexOf(item.name)
        if (i > -1) {
          self.cachedViews.splice(i, 1)
        }
        return false
      })
    },

    DEL_LEFT_VIEWS(view) {
      const self = this as any
      const index = self.visitedViews.findIndex((v) => v.path === view.path)
      if (index === -1) {
        return
      }
      self.visitedViews = self.visitedViews.filter((item, idx) => {
        if (idx >= index || (item.meta && item.meta.affix)) {
          return true
        }
        const i = self.cachedViews.indexOf(item.name)
        if (i > -1) {
          self.cachedViews.splice(i, 1)
        }
        return false
      })
    },
    addView(view) {
      const self = this as any
      self.addVisitedView(view)
      self.addCachedView(view)
    },
    addVisitedView(view) {
      const self = this as any
      self.ADD_VISITED_VIEW(view)
    },
    addCachedView(view) {
      const self = this as any
      self.ADD_CACHED_VIEW(view)
    },

    delView(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.delVisitedView(view)
        self.delCachedView(view)
        resolve({
          visitedViews: [...self.visitedViews],
          cachedViews: [...self.cachedViews],
        })
      })
    },
    delVisitedView(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_VISITED_VIEW(view)
        resolve([...self.visitedViews])
      })
    },
    delCachedView(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_CACHED_VIEW(view)
        resolve([...self.cachedViews])
      })
    },

    delOthersViews(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.delOthersVisitedViews(view)
        self.delOthersVisitedViews(view)
        resolve({
          visitedViews: [...self.visitedViews],
          cachedViews: [...self.cachedViews],
        })
      })
    },
    delOthersVisitedViews(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_OTHERS_VISITED_VIEWS(view)
        resolve([...self.visitedViews])
      })
    },
    delOthersCachedViews(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_OTHERS_CACHED_VIEWS(view)
        resolve([...self.cachedViews])
      })
    },

    delAllViews(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.delAllVisitedViews(view)
        self.delAllCachedViews(view)
        resolve({
          visitedViews: [...self.visitedViews],
          cachedViews: [...self.cachedViews],
        })
      })
    },
    delAllVisitedViews() {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_ALL_VISITED_VIEWS()
        resolve([...self.visitedViews])
      })
    },
    delAllCachedViews() {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_ALL_CACHED_VIEWS()
        resolve([...self.cachedViews])
      })
    },

    updateVisitedView(view) {
      const self = this as any
      self.UPDATE_VISITED_VIEW(view)
    },

    delRightTags(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_RIGHT_VIEWS(view)
        resolve([...self.visitedViews])
      })
    },

    delLeftTags(view) {
      const self = this as any
      return new Promise((resolve) => {
        self.DEL_LEFT_VIEWS(view)
        resolve([...self.visitedViews])
      })
    },
  },
})
