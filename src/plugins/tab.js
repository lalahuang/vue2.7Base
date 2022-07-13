import router from '@/router';
import { useTagsStore } from '@/stores/tagsView';

export default {
  // 刷新当前tab页签
  refreshPage(obj) {
    const { path, matched } = router.currentRoute;
    if (obj === undefined) {
      matched.forEach((m) => {
        if (m.components && m.components.default && m.components.default.name) {
          if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
            obj = { name: m.components.default.name, path: path };
          }
        }
      });
    }
   
    return  useTagsStore().delCachedView(obj).then(() => {
      const { path } = obj
      router.replace({
        path: '/redirect' + path
      })
    })
  },
  // 关闭当前tab页签，打开新页签
  closeOpenPage(obj) {
    useTagsStore().delView(router.currentRoute);
    if (obj !== undefined) {
      return router.push(obj);
    }
  },
  // 关闭指定tab页签
  closePage(obj) {
    if (obj === undefined) {
      return useTagsStore().delView(router.currentRoute).then(({ lastPath }) => {
        return router.push(lastPath || '/');
      });
    }
    return useTagsStore().delView(obj);
  },
  // 关闭所有tab页签
  closeAllPage() {
    return useTagsStore().delAllViews(obj);
   
  },
  // 关闭左侧tab页签
  closeLeftPage(obj) {
     return useTagsStore().delLeftTags(obj || router.currentRoute);
  },
  // 关闭右侧tab页签
  closeRightPage(obj) {
     return useTagsStore().delRightTags(obj || router.currentRoute);
  },
  // 关闭其他tab页签
  closeOtherPage(obj) {
      return useTagsStore().delOthersViews(obj || router.currentRoute);
  },
  // 添加tab页签
  openPage(title, url) {
    var obj = { path: url, meta: { title: title } }
    useTagsStore().addView(obj)
    return router.push(url);
  },
  // 修改tab页签
  updatePage(obj) {
    return  useTagsStore().updateVisitedView(obj);
  }
}
