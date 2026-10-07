<template>
  <div class="datas-container">
    <!-- 顶部：访问量折线图 -->
    <div class="chart-card">
      <div class="card-header">
        <span class="title">访问量</span>
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="week">近一周</el-radio-button>
          <el-radio-button label="month">近一月</el-radio-button>
        </el-radio-group>
      </div>
      <div ref="lineChartRef" class="chart-box line-chart"></div>
    </div>

    <!-- 底部：数据监测环形图 -->
    <div class="chart-card">
      <div class="card-header">
        <span class="title">数据监测</span>
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="week">近一周</el-radio-button>
          <el-radio-button label="month">近一月</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 两个环形图并排显示 -->
      <div class="pie-charts-wrapper">
        <div class="pie-item">
          <div ref="pieChart1Ref" class="chart-box pie-chart"></div>
        </div>
        <div class="pie-item">
          <div ref="pieChart2Ref" class="chart-box pie-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 逻辑代码完全保留，不做改动
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('week')
const lineChartRef = ref<HTMLElement | null>(null)
const pieChart1Ref = ref<HTMLElement | null>(null)
const pieChart2Ref = ref<HTMLElement | null>(null)

let lineChart: echarts.ECharts | null = null
let pieChart1: echarts.ECharts | null = null
let pieChart2: echarts.ECharts | null = null

const initLineChart = () => {
  if (!lineChartRef.value) return
  lineChart = echarts.init(lineChartRef.value)
  const option: echarts.EChartsOption = {
    grid: { top: 30, right: 20, bottom: 30, left: 40 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['01-12', '01-13', '01-14', '01-15', '01-16', '01-17', '01-18'],
      // 使用 CSS 变量适配颜色
      axisLine: { lineStyle: { color: 'var(--my-border-color)' } },
      axisLabel: { color: 'var(--my-text-sub)' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { type: 'dashed', color: 'var(--my-border-color)' } },
      axisLabel: { color: 'var(--my-text-sub)' },
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { color: '#2b5cff', width: 2 },
        data: [60, 45, 60, 45, 60, 45, 55],
      },
    ],
  }
  lineChart.setOption(option)
}

const initPieChart1 = () => {
  if (!pieChart1Ref.value) return
  pieChart1 = echarts.init(pieChart1Ref.value)
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle',
      formatter: (name: string) => name,
      textStyle: { color: 'var(--my-text-sub)' }, // 适配
    },
    title: [
      {
        text: '设备总数',
        subtext: '234',
        left: '33%',
        top: '38%',
        textAlign: 'center',
        textStyle: { fontSize: 12, color: 'var(--my-text-sub)' }, // 适配
        subtextStyle: { fontSize: 20, color: 'var(--my-text-main)', fontWeight: 'bold' }, // 适配
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 150, name: '移动端', itemStyle: { color: '#2b5cff' } },
          { value: 84, name: '电脑端', itemStyle: { color: '#f56c6c' } },
        ],
      },
    ],
  }
  pieChart1.setOption(option)
}

const initPieChart2 = () => {
  if (!pieChart2Ref.value) return
  pieChart2 = echarts.init(pieChart2Ref.value)
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    title: [
      {
        text: '访问总数',
        subtext: '24',
        left: '50%',
        top: '38%',
        textAlign: 'center',
        textStyle: { fontSize: 12, color: 'var(--my-text-sub)' }, // 适配
        subtextStyle: { fontSize: 20, color: 'var(--my-text-main)', fontWeight: 'bold' }, // 适配
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 10, name: '直接访问', itemStyle: { color: '#2b5cff' } },
          { value: 5, name: '搜索引擎', itemStyle: { color: '#fbc02d' } },
          { value: 4, name: '邮件营销', itemStyle: { color: '#f56c6c' } },
          { value: 5, name: '联盟广告', itemStyle: { color: '#e91e63' } },
        ],
      },
    ],
  }
  pieChart2.setOption(option)
}

const handleResize = () => {
  lineChart?.resize()
  pieChart1?.resize()
  pieChart2?.resize()
}

watch(timeRange, (val) => {
  const newData =
    val === 'week'
      ? [60, 45, 60, 45, 60, 45, 55]
      : [30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30]
  lineChart?.setOption({
    xAxis: {
      data:
        val === 'week'
          ? ['01-12', '01-13', '01-14', '01-15', '01-16', '01-17', '01-18']
          : Array.from({ length: 15 }, (_, i) => `01-${i + 1}`),
    },
    series: [{ data: newData }],
  })
})

onMounted(() => {
  initLineChart()
  initPieChart1()
  initPieChart2()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  pieChart1?.dispose()
  pieChart2?.dispose()
})
</script>

<style scoped lang="scss">
.datas-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  // 这里不再写 background-color，交给父级控制
}

.chart-card {
  background-color: $my-bg-card; // 卡片背景（白天白色/夜间深色）
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px $my-shadow-color; // 阴影适配
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title {
    font-size: 16px;
    font-weight: 600;
    // 之前你写成了 $my-bg-color，这里修正为 $my-text-main
    color: $my-text-main;
  }
}

.chart-box {
  width: 100%;
}

.line-chart {
  height: 280px;
}

.pie-charts-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;

  .pie-item {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}

.pie-chart {
  height: 220px;
  width: 100%;
  max-width: 400px;
}

/* 覆写 Element Plus 的 Radio Button 样式以更贴合设计图 */
:deep(.el-radio-button__inner) {
  border-color: $my-border-color;
  color: $my-text-sub;
  background-color: $my-bg-page;
  border-radius: 4px !important;
  margin-left: 8px;
  border: none;

  &:hover {
    color: #2b5cff;
  }
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #2b5cff;
  color: #ffffff;
  box-shadow: -1px 0 0 0 #2b5cff;
}
</style>
