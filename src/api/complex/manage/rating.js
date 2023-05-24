import request from '@/utils/request'

// 查询岗位列表
export function listRating(query) {
  return request({
    url: '/school/complex/student/ratings/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getRating(Rating) {
  return request({
    url: '/school/complex/student/ratings/' + Rating,
    method: 'get'
  })
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
export function updateRating(data) {
  return request({
    url: '/school/complex/student/ratings',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}
