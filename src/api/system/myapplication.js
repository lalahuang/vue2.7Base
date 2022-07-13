import request from '@/utils/request'


export function listMyApplication(query) {
  return request({
    url: '/system/myapplication/list',
    method: 'get',
    params: query
  })
}
