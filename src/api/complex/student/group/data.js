import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

// 查询小组列表
export function getData(groupId) {
  return request({
    url: '/complex/student/group/' + groupId,
    method: 'get'
  })
}

export function searchData(query) {
  return request(({
    url: '/school/complex/student/data/list',
    method: 'get',
    params: query
  }))
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delUser(postId) {
  return request({
    url: '/school/complex/student/data/' + postId,
    method: 'delete'
  })
}
