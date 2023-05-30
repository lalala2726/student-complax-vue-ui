<template>
  <div>
    <div id="main" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { displayDashboardData } from '@/api/complex/student/group/display'

export default {
  mounted() {
    this.getGroupData()
  },
  methods: {
    getGroupData() {
      displayDashboardData()
        .then(res => {
          const { groupName, totalLastTimeResult, totalAbs, totalThisResult } = res.data
          this.initEcharts(groupName, totalLastTimeResult, totalAbs, totalThisResult)
        })
        .catch(error => {
          this.$message.error('数据请求失败！请联系管理员' + error)
        })
    },
    initEcharts(groupName, totalLastTimeResult, totalAbs, totalThisResult) {
      let chartDom = document.getElementById('main')
      let myChart = echarts.init(chartDom)
      let option

      option = {
        title: {
          text: '小组数据展示'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['本次总分', '上次总分', '本次差值']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: groupName
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '本次总分',
            type: 'line',
            stack: 'Total',
            data: totalThisResult
          },
          {
            name: '上次总分',
            type: 'line',
            stack: 'Total',
            data: totalLastTimeResult
          },
          {
            name: '本次差值',
            type: 'line',
            stack: 'Total',
            data: totalAbs
          }
        ]
      }

      option && myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
#main {
  width: 100%;
  height: 400px;
}
</style>
