/*
 * @Author: hzm
 * @Date: 2022-07-12 10:15:14
 * @Description:
 */

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
