<script >
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];
    if (icon&&!icon.includes("#")) {
      console.log('icon: ', icon);
      if (icon.includes('el-icon')) {
        vnodes.push(h("i", {class:[icon, 'sub-el-icon']}));
      } else {
        vnodes.push(h("svg-icon", {
           props: {
            iconClass: icon 
          }
        }));
      }
    }
    if (title) {
      vnodes.push(h("span",{slot:"title"},title));
      // <span slot="title">{title}</span>
    }
    return vnodes;
  },
};
</script>
