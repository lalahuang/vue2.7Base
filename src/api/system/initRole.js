import request from '@/utils/request'

// 查询租户初始角色信息列表
export function listInitRole(query) {
  return request({
    url: '/system/initRole/list',
    method: 'get',
    params: query
  })
}

// 查询租户初始角色信息详细
export function getInitRole(roleId) {
  return request({
    url: '/system/initRole/' + roleId,
    method: 'get'
  })
}

// 新增租户初始角色信息
export function addInitRole(data) {
  return request({
    url: '/system/initRole',
    method: 'post',
    data: data
  })
}

// 修改租户初始角色信息
export function updateInitRole(data) {
  return request({
    url: '/system/initRole',
    method: 'put',
    data: data
  })
}

// 删除租户初始角色信息
export function delInitRole(roleId) {
  return request({
    url: '/system/initRole/' + roleId,
    method: 'delete'
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/initRole/changeStatus',
    method: 'put',
    data: data
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/initRole/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}
