import request from '@/utils/request'

// 查询岗位列表
export function listRating(query) {
  return request({
    url: '/complex/student/manage/group/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getRating(Rating) {
  return request({
    url: '/complex/student/manage/group/' + Rating,
    method: 'get'
  })
}

// 新增岗位
export function addRating(data) {
  return request({
    url: '/complex/student/manage/group/',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateRating(data) {
  return request({
    url: '/complex/student/manage/group/',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function deleteRating(studentId) {
  return request({
    url: '/complex/student/manage/group/' + studentId,
    method: 'delete'
  })
}
