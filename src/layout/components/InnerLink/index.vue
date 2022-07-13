<script >
export default {
  // data() {
  //   return {};
  // },
  // render() {
  //   const { $route: { meta: { link } }, } = this;
  //   if ({ link }.link === "") {
  //     return "404";
  //   }
  //   let url = { link }.link;
  //   const height = document.documentElement.clientHeight - 94.5 + "px";
  //   const style = { height: height };
    
  //   return (
  //     <div style={style}>
  //       <iframe
  //         src={url}
  //         frameborder="no"
  //         style="width: 100%; height: 100%"
  //         scrolling="auto"
  //       ></iframe>
  //     </div>
  //   );
  // },
  setup() {
    const route = getCurrentInstance().proxy.$route;
    const link = route.meta.link;
    if (link === '') {
      return '404';
    }
    let url = link;
    const height = document.documentElement.clientHeight - 94.5 + 'px';
    const style = { height: height };

    // 返回渲染函数
    return () =>
      h(
        'div',
        {
          style: style,
        },
        h('iframe', {
          src: url,
          frameborder: 'no',
          width: '100%',
          height: '100%',
          scrolling: 'auto',
        })
      );
  },
};
</script>
