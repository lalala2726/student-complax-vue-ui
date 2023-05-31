import request from '@/utils/request'

// 查询成绩列表
export function listRating(query) {
  return request({
    url: '/school/complex/student/ratings/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询成绩详细信息
export function getRating(Rating) {
  return request({
    url: '/school/complex/student/ratings/' + Rating,
    method: 'get'
  })
}

// 新增成绩信息
export function addRating(data) {
  return request({
    url: '/school/complex/student/ratings',
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

// 删除成绩信息
export function delPost(studentId) {
  return request({
    url: '/school/complex/student/ratings/' + studentId,
    method: 'delete'
  })
}

//状态修改
export function submitChange(status) {
  return request({
    url: '/school/complex/student/ratings/submitChange/' + status,
    method: 'put'
  })
}

//重置所有的分数
export function resetScore() {
  return request({
    url: '/school/complex/student/ratings/resetScore',
    method: 'put'
  })
}
