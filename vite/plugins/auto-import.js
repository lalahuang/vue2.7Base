import autoImport from 'unplugin-auto-import/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      {
        vuex: ['useStore'],
        '@/plugins/modal': [['default', 'modal']],
        '@/plugins/cache': [['default', 'cache']],
        '@/plugins/mitt': [['default', 'mitt']],
        '@/utils/ruoyi': [
          ['resetForm', 'resetForm'],
          'addDateRange',
          'formatDictValue',
          'handleTree',
          'splitStr',
          'handleDateRange',
        ],
        '@/utils/request': ['download'],
        '@/utils/dict': ['useDict'],
      },
    ],
    eslintrc: {
      enabled: true, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    dts: true, //auto generation auto-imports.d.ts file
    // resolvers: [ElementPlusResolver()],
  });
}
