<template>
  <div id="mychart" :style="{ float: 'left', width: '100%', height: '400px' }" class="echart"></div>
</template>
<script>
import * as echarts from 'echarts'
import { getGroupData } from '@/api/complex/student/group/display'

export default {
  mounted() {
    // this.getGroupDataInfo()
    this.getGroupDataInfo()
  },
  data() {
    return {
      //姓名
      name: [],
      //上次分数
      lastFraction: [],
      //本次分数
      thisFraction: [],
      //差值
      difference: []
    }
  },

  methods: {
    getGroupDataInfo() {
      const groupId = this.$route.params && this.$route.params.groupId
      getGroupData(groupId).then(res => {
        this.name = res.data.name
        this.lastFraction = res.data.lastFraction
        this.thisFraction = res.data.thisFraction
        this.difference = res.data.difference
        this.initEcharts()
      })
    },
    initEcharts() {
      const chartContainer = document.getElementById('mychart')
      const chart = echarts.init(chartContainer)

      const colors = ['#5470C6', '#91CC75', '#EE6666']

      const option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['本次分数', '上次分数  ', '差值']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: this.name
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '本次分数',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            type: 'value',
            name: '上次分数',
            position: 'right',
            alignTicks: true,
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '差值',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '本次分数',
            type: 'bar',
            data: this.thisFraction
          },
          {
            name: '上次分数',
            type: 'bar',
            yAxisIndex: 1,
            data: this.lastFraction
          },
          {
            name: '差值',
            type: 'line',
            yAxisIndex: 2,
            data: this.difference
          }
        ]
      }

      chart.setOption(option)
    }
  }
}
</script>
