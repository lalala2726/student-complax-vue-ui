import request from '@/utils/request'

// 显示指定小组数据
export function getGroupData(groupID) {
  return request({
    url: '/school/complex/student/display/' + groupID,
    method: 'get'
  })
}

// 全部展示成绩分析数据
export function displayDashboardData() {
  return request({
    url: '/school/complex/student/display/all',
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
