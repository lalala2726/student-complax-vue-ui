import request from '@/utils/request'

// 查询成绩列表
export function listRating(query) {
  return request({
    url: '/school/complex/student/last/ratings/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询成绩详细信息
export function getRating(Rating) {
  return request({
    url: '/school/complex/student/last/ratings/' + Rating,
    method: 'get'
  })
}

// 修改岗位
export function updateRating(data) {
  return request({
    url: '/school/complex/student/last/ratings',
    method: 'put',
    data: data
  })
}

