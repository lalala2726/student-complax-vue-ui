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

// 新增岗位
export function getStudentData(studentId) {
  return request({
    url: '/school/complex/student/display/student/' + studentId,
    method: 'get'
  })
}
