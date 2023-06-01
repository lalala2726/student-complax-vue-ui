<template>
  <div class="chart-container">
    <div id="chartContainer"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { getStudentData } from '@/api/complex/student/group/display'

export default {
  data() {
    return {
      lastScore: [],
      studentName: undefined,
      thisScore: []
    }
  },
  mounted() {
    this.getStudentDataById()
  },
  methods: {
    getStudentDataById() {
      const studentId = this.$route.params && this.$route.params.studentId
      getStudentData(studentId).then(res => {
        this.lastScore = res.data.lastScore
        this.studentName = res.data.studentName
        this.thisScore = res.data.thisScore
        this.initChart()
      })
    },
    initChart() {

      const option = {
        title: {
          text: this.studentName
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['自我学习能力', '信息处理能力', '沟通交流能力', '团队合作能力', '解决问题能力', '革新创新能力']
        },
        series: [
          {
            name: '上次分数',
            type: 'bar',
            data: this.lastScore
          },
          {
            name: '本次分数',
            type: 'bar',
            data: this.thisScore
          }
        ]
      }

      this.$nextTick(() => {
        // 初始化图表
        const chartContainer = document.getElementById('chartContainer')
        const myChart = echarts.init(chartContainer)
        myChart.setOption(option)
      })
    }
  }
}
</script>

<style>
#chartContainer {
  width: 600px;
  height: 400px;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

#chartContainer {
  width: 1000px;
  height: 500px;
}
</style>
