/*
 * @Author: hzm
 * @Date: 2022-04-12 15:47:13
 * @Description:
 */

import {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  HeadersDefaults,
} from 'axios';

interface RequestHeadersType extends AxiosRequestHeaders {
  isToken?: boolean;
  repeatSubmit?: boolean;
  Authorization?: string;
}
interface RequestDefaultsHeadersType extends HeadersDefaults {
  'Content-Type'?: string;
}

interface RequestType extends AxiosRequestConfig {
  url?: string;
  method?: string;
  data?: ObjType;
  params?: ObjType;
  headers?: RequestHeadersType;
  module?: string;
}

interface ResponseConfig<T = any> {
  list?: T[];
  code?: number;
  msg?: string;
  data?: T;
  rows?: T[];
  total?: number;
}
