import request from '@/utils/request'

// 查询子域名与IP资产列表
export function listSubdomainNameIpAssets(query) {
  return request({
    url: '/system/subdomainNameIpAssets/list',
    method: 'get',
    params: query
  })
}

// 查询子域名与IP资产详细
export function getSubdomainNameIpAssets(id) {
  return request({
    url: '/system/subdomainNameIpAssets/' + id,
    method: 'get'
  })
}

// 新增子域名与IP资产
export function addSubdomainNameIpAssets(data) {
  return request({
    url: '/system/subdomainNameIpAssets',
    method: 'post',
    data: data
  })
}

// 修改子域名与IP资产
export function updateSubdomainNameIpAssets(data) {
  return request({
    url: '/system/subdomainNameIpAssets',
    method: 'put',
    data: data
  })
}

// 删除子域名与IP资产
export function delSubdomainNameIpAssets(id) {
  return request({
    url: '/system/subdomainNameIpAssets/' + id,
    method: 'delete'
  })
}
