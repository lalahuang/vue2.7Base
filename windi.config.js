// const { themeVariants } = require("tailwindcss-theme-variants");
module.exports = {
  // important: true,

  preflight: false,
  // mode: 'jit',
  // purge: [
  //   './public/**/*.html',
  //   './src/**/*.{js,vue}',
  // ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: {
          b85: 'rgba(0,0,0,.85)',
          b45: 'rgba(0,0,0,.45)',
          b25: 'rgba(0,0,0,.25)',
          b15: 'rgba(0,0,0,.15)',
          b6: 'rgba(0,0,0,0.06)',
          b4: 'rgba(0,0,0,0.04)',
          b2: 'rgba(0,0,0,0.02)',
        },
        white: {
          w85: 'rgba(255,255,255,.85)',
          w45: 'rgba(255,255,255,.45)',
          w25: 'rgba(255,255,255,.25)',
          w15: 'rgba(255,255,255,.15)',
          w6: 'rgba(255,255,255,0.06)',
          w4: 'rgba(255,255,255,0.04)',
          w2: 'rgba(255,255,255,0.02)',
        },
        success: '#00B578',
        warning: '#FFB71F',
        danger: '#D93026',
      },
    },

    boxShadow: {
      "shadow-1-up":"0px -1px  2px -2px  rgba(0, 0, 0, 0.16),0px -3px 6px 0px rgba(0, 0, 0, 0.12),0px  -5px 12px 4px rgba(0, 0, 0, 0.09)",
      "shadow-1-down":"0px 1px  2px -2px  rgba(0, 0, 0, 0.16),0px 3px 6px 0px rgba(0, 0, 0, 0.12),0px  5px 12px 4px rgba(0, 0, 0, 0.09)",
      "shadow-1-left":"-1px 0px  2px -2px  rgba(0, 0, 0, 0.16),-3px 0px 6px 0px rgba(0, 0, 0, 0.12),-5px  0px 12px 4px rgba(0, 0, 0, 0.09)",
      "shadow-1-right":"1px 0px  2px -2px  rgba(0, 0, 0, 0.16),3px 0px 6px 0px rgba(0, 0, 0, 0.12),5px  0px 12px 4px rgba(0, 0, 0, 0.09)",
      "shadow-2-up":"0px -3px  6px -4px  rgba(0, 0, 0, 0.12),0px -6px 16px 0px rgba(0, 0, 0, 0.8),0px  -9px 28px 8px rgba(0, 0, 0, 0.05)",
      "shadow-2-down":"0px 3px  6px -4px  rgba(0, 0, 0, 0.12),0px 6px 16px 0px rgba(0, 0, 0, 0.8),0px  9px 28px 8px rgba(0, 0, 0, 0.05)",
      "shadow-2-left":"-3px 0px  6px -4px  rgba(0, 0, 0, 0.12),-6px 0px 16px 0px rgba(0, 0, 0, 0.8),-9px 0px 28px 8px rgba(0, 0, 0, 0.05)",
      "shadow-2-right":"3px 0px   6px -4px  rgba(0, 0, 0, 0.12),6px 0px  16px 0px rgba(0, 0, 0, 0.8),9px 0px 28px 8px rgba(0, 0, 0, 0.05)",
      "shadow-3-up":"0px -6px  16px -8px  rgba(0, 0, 0, 0.08),0px -9px 28px 0px rgba(0, 0, 0, 0.05),0px  -12px 48px 16px rgba(0, 0, 0, 0.03)",
      "shadow-3-down":"0px 6px  16px -8px  rgba(0, 0, 0, 0.08),0px 9px 28px 0px rgba(0, 0, 0, 0.05),0px  12px 48px 16px rgba(0, 0, 0, 0.03)",
      "shadow-3-left":"-6px 0px   16px -8px  rgba(0, 0, 0, 0.08),-9px 0px  28px 0px rgba(0, 0, 0, 0.05), -12px 0px  48px 16px rgba(0, 0, 0, 0.03)",
      "shadow-3-right":"6px 0px   16px -8px  rgba(0, 0, 0, 0.08),9px 0px  28px 0px rgba(0, 0, 0, 0.05), 12px 0px  48px 16px rgba(0, 0, 0, 0.03)",
    },
    
  },

  plugins: [
    // require('@tailwindcss/line-clamp'),
    // themeVariants({
    //   themes: {
    //     old: {
    //       selector: ".zjzwOLD",
    //     },
    //   },
    // }),
   
    require('windicss/plugin/line-clamp'),
  ],
};
