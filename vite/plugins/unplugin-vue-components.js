/*
 * @Author: hzm
 * @Date: 2022-04-29 09:43:06
 * @Description:
 */
import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default function createUnpluginVueComponents() {
  return Components({
    dirs: ['src/components'],
    extensions: ['vue', 'md'],
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    directoryAsNamespace: true,
    // resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    //为true时在项目根目录自动创建
    dts: true,
    //引入element plus自动组件支持
  });
}
