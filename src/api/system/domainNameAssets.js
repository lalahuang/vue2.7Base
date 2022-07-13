import request from '@/utils/request'

// 查询域名资产列表
export function listDomainNameAssets(query) {
  return request({
    url: '/system/domainNameAssets/list',
    method: 'get',
    params: query
  })
}

// 查询域名资产详细
export function getDomainNameAssets(id) {
  return request({
    url: '/system/domainNameAssets/' + id,
    method: 'get'
  })
}

// 新增域名资产
export function addDomainNameAssets(data) {
  return request({
    url: '/system/domainNameAssets',
    method: 'post',
    data: data
  })
}

// 修改域名资产
export function updateDomainNameAssets(data) {
  return request({
    url: '/system/domainNameAssets',
    method: 'put',
    data: data
  })
}

// 删除域名资产
export function delDomainNameAssets(id) {
  return request({
    url: '/system/domainNameAssets/' + id,
    method: 'delete'
  })
}
