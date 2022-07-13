export default  {
  title: '智电云管理系统',

  // /**
  //  * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
  //  */
  // sideTheme: 'theme-dark',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: true,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  // fixedHeader: false,

  /**
   * 是否显示logo
   */
  // sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,


  
  /**
   * @type {boolean}
   * @description
   */
   centerLayout: false,

   /**
    * @type {boolean}
    * @description
    */
   statusBar: false,
 
   /**
    * @type {string}
    * @description
    */
   skin: '',
/**
   * @type {Object}
   * @description
   */
 skins: [
  {
    name: '默认',
    value: '',
    color: '#FFF',
  },
  {
    name: '深色菜单',
    value: 'skin-dark',
    color: '#041b3d',
  },
  {
    name: '蓝色头部栏',
    value: 'skins-chint-blue',
    color: '#1E54AC',
  },

  // {
  //   name: '工业蓝', value: 'skin-chint-blue', color: '#237ae4',
  // },
  // {
  //   name: '能源绿', value: 'skin-chint-green', color: '#00a653',
  // },
],

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
