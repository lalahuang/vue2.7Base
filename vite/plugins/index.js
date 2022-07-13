// import vue from '@vitejs/plugin-vue';
import vue from '@vitejs/plugin-vue2';
import WindiCSS from 'vite-plugin-windicss';
import createAutoImport from './auto-import';
import createSvgIcon from './svg-icon';
import createCompression from './compression';
// import createSetupExtend from './setup-extend';
import createUnpluginVueComponents from './unplugin-vue-components';
import zipPack from 'vite-plugin-zip-pack';

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue(), WindiCSS(), zipPack()];
  vitePlugins.push(createUnpluginVueComponents());
  vitePlugins.push(createAutoImport());
  // vitePlugins.push(createSetupExtend());
  vitePlugins.push(createSvgIcon(isBuild));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
