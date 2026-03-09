<template>
  <div class="exception-management">
    <div class="page-header">
      <h2 class="page-title">电梯泵故障预警</h2>
      <el-icon class="close-icon" :size="24"><Close /></el-icon>
    </div>
    
    <div class="content-wrapper">
      <!-- Left: Table section -->
      <div class="table-section">
        <div class="filter-bar">
          <el-select v-model="selectedPlatform" placeholder="全部平台" style="width: 150px">
            <el-option label="全部平台" value="all" />
            <el-option label="乌石17-2" value="ws17-2" />
          </el-select>
          
          <el-select v-model="selectedWell" placeholder="请选择井名" style="width: 150px">
            <el-option label="请选择井名" value="all" />
            <el-option label="A43" value="A43" />
            <el-option label="A3" value="A3" />
          </el-select>
          
          <el-input
            v-model="searchKeyword"
            placeholder="请输入查询"
            style="width: 200px"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#112240', color: '#fff' }"
        >
          <el-table-column prop="id" label="序号" width="60" align="center" />
          <el-table-column prop="platform" label="基础平台" width="100" align="center" />
          <el-table-column prop="well" label="井名称" width="80" align="center" />
          <el-table-column prop="set" label="套名" width="80" align="center" />
          <el-table-column prop="faultType" label="故障类型" width="120" align="center" />
          <el-table-column prop="faultTime" label="故障时间" width="170" align="center" />
          <el-table-column label="处理联系" width="100" align="center">
            <template #default="scope">
              <span :class="['status-badge', scope.row.status === '未处理' ? 'pending' : 'processed']">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleProcess(scope.row)">处理</el-button>
              <el-button type="success" size="small" @click="handleDetail(scope.row)">详细</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[15, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
      <!-- Right: Charts section -->
      <div class="charts-section">
        <div class="chart-header">
          <h3>乌石17-2-A43-01泵运行监测故障诊断曲线</h3>
          <el-icon class="help-icon" :size="20"><QuestionFilled /></el-icon>
        </div>
        
        <!-- Current Chart -->
        <div class="chart-container">
          <div ref="currentChart" style="width: 100%; height: 200px;"></div>
        </div>
        
        <!-- Pressure Chart -->
        <div class="chart-container">
          <div ref="pressureChart" style="width: 100%; height: 200px;"></div>
        </div>
        
        <!-- Temperature Chart -->
        <div class="chart-container">
          <div ref="temperatureChart" style="width: 100%; height: 200px;"></div>
        </div>
        
        <!-- Fault info -->
        <div class="fault-info">
          <p><strong>故障名称：</strong>合气 故障等级：二级</p>
          <p><strong>故障区间：</strong>2025-07-14 02:00:30 - 2025-07-14 02:59:30</p>
          <p><strong>故障原因：</strong>电流波动，但不停机流量逐渐减小</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Close, Search, QuestionFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const selectedPlatform = ref('all')
const selectedWell = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(2)

const tableData = ref([
  {
    id: 1,
    platform: '乌石17-2',
    well: 'A43',
    set: '01',
    faultType: '合气',
    faultTime: '2025-07-14 09:27:00',
    status: '未处理'
  },
  {
    id: 2,
    platform: '乌石17-2',
    well: 'A43',
    set: '01',
    faultType: '合气',
    faultTime: '2025-07-14 03:00:00',
    status: '未处理'
  }
])

const currentChart = ref(null)
const pressureChart = ref(null)
const temperatureChart = ref(null)

let currentChartInstance = null
let pressureChartInstance = null
let temperatureChartInstance = null

const handleSearch = () => {
  console.log('Searching:', searchKeyword.value)
}

const handleProcess = (row) => {
  console.log('Processing:', row)
}

const handleDetail = (row) => {
  console.log('Detail:', row)
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const initCharts = () => {
  // Generate time series data
  const timeData = []
  const baseTime = new Date('2025-07-14 02:00:30')
  for (let i = 0; i < 100; i++) {
    const time = new Date(baseTime.getTime() + i * 60000) // Every minute
    timeData.push(time.toTimeString().slice(0, 5))
  }
  
  // Current Chart (电流 and 电机频率)
  if (currentChart.value) {
    currentChartInstance = echarts.init(currentChart.value)
    const currentOption = {
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '10%', top: '15%', bottom: '15%' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 34, 64, 0.9)',
        borderColor: '#1e3a5f',
        textStyle: { color: '#fff' }
      },
      legend: {
        data: ['电流', '电机频率'],
        textStyle: { color: '#8c9cb8' },
        top: 0
      },
      xAxis: {
        type: 'category',
        data: timeData,
        axisLine: { lineStyle: { color: '#1e3a5f' } },
        axisLabel: { color: '#8c9cb8' }
      },
      yAxis: [
        {
          type: 'value',
          name: '电流(A)',
          nameTextStyle: { color: '#8c9cb8' },
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#8c9cb8' },
          splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } }
        },
        {
          type: 'value',
          name: '频率(Hz)',
          nameTextStyle: { color: '#8c9cb8' },
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#8c9cb8' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '电流',
          type: 'line',
          smooth: true,
          data: Array.from({ length: 100 }, () => 19 + Math.random() * 2),
          itemStyle: { color: '#ff6b6b' },
          lineStyle: { width: 2 }
        },
        {
          name: '电机频率',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: Array.from({ length: 100 }, () => 48 + Math.random() * 4),
          itemStyle: { color: '#4ecdc4' },
          lineStyle: { width: 2 }
        }
      ]
    }
    currentChartInstance.setOption(currentOption)
  }
  
  // Pressure Chart
  if (pressureChart.value) {
    pressureChartInstance = echarts.init(pressureChart.value)
    const pressureOption = {
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '10%', top: '15%', bottom: '15%' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 34, 64, 0.9)',
        borderColor: '#1e3a5f',
        textStyle: { color: '#fff' }
      },
      legend: {
        data: ['电压(V)', '电机流量(Hz)'],
        textStyle: { color: '#8c9cb8' },
        top: 0
      },
      xAxis: {
        type: 'category',
        data: timeData,
        axisLine: { lineStyle: { color: '#1e3a5f' } },
        axisLabel: { color: '#8c9cb8' }
      },
      yAxis: [
        {
          type: 'value',
          name: '电压(V)',
          nameTextStyle: { color: '#8c9cb8' },
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#8c9cb8' },
          splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } }
        },
        {
          type: 'value',
          name: '流量(Hz)',
          nameTextStyle: { color: '#8c9cb8' },
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#8c9cb8' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '电压(V)',
          type: 'line',
          smooth: true,
          data: Array.from({ length: 100 }, () => 1700 + Math.random() * 200),
          itemStyle: { color: '#ff6b6b' },
          lineStyle: { width: 2 },
          areaStyle: { color: 'rgba(255, 107, 107, 0.1)' }
        },
        {
          name: '电机流量(Hz)',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: Array.from({ length: 100 }, () => 45 + Math.random() * 5),
          itemStyle: { color: '#4ecdc4' },
          lineStyle: { width: 2 },
          areaStyle: { color: 'rgba(78, 205, 196, 0.1)' }
        }
      ]
    }
    pressureChartInstance.setOption(pressureOption)
  }
  
  // Temperature Chart
  if (temperatureChart.value) {
    temperatureChartInstance = echarts.init(temperatureChart.value)
    const temperatureOption = {
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '10%', top: '15%', bottom: '15%' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 34, 64, 0.9)',
        borderColor: '#1e3a5f',
        textStyle: { color: '#fff' }
      },
      legend: {
        data: ['液入口压力(Mpa)', '液入口温度(℃)', '电机绝缘温度(℃)'],
        textStyle: { color: '#8c9cb8' },
        top: 0
      },
      xAxis: {
        type: 'category',
        data: timeData,
        axisLine: { lineStyle: { color: '#1e3a5f' } },
        axisLabel: { color: '#8c9cb8' }
      },
      yAxis: [
        {
          type: 'value',
          name: '压力(Mpa)',
          nameTextStyle: { color: '#8c9cb8' },
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#8c9cb8' },
          splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } }
        },
        {
          type: 'value',
          name: '温度(℃)',
          nameTextStyle: { color: '#8c9cb8' },
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#8c9cb8' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '液入口压力(Mpa)',
          type: 'line',
          smooth: true,
          data: Array.from({ length: 100 }, () => 9 + Math.random() * 2),
          itemStyle: { color: '#ff9f43' },
          lineStyle: { width: 2 }
        },
        {
          name: '液入口温度(℃)',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: Array.from({ length: 100 }, () => 100 + Math.random() * 5),
          itemStyle: { color: '#00d2ff' },
          lineStyle: { width: 2 }
        },
        {
          name: '电机绝缘温度(℃)',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: Array.from({ length: 100 }, () => 105 + Math.random() * 5),
          itemStyle: { color: '#26de81' },
          lineStyle: { width: 2 }
        }
      ]
    }
    temperatureChartInstance.setOption(temperatureOption)
  }
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', () => {
    currentChartInstance?.resize()
    pressureChartInstance?.resize()
    temperatureChartInstance?.resize()
  })
})

onUnmounted(() => {
  currentChartInstance?.dispose()
  pressureChartInstance?.dispose()
  temperatureChartInstance?.dispose()
})
</script>

<style scoped>
.exception-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.close-icon {
  color: var(--primary-blue);
  cursor: pointer;
  transition: all 0.3s;
}

.close-icon:hover {
  transform: rotate(90deg);
  color: var(--error-red);
}

.content-wrapper {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow: hidden;
}

.table-section {
  flex: 0 0 760px;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.pagination-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.charts-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.help-icon {
  color: var(--primary-blue);
  cursor: pointer;
}

.chart-container {
  background: rgba(17, 34, 64, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 15px;
}

.fault-info {
  background: rgba(17, 34, 64, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 15px;
  margin-top: 10px;
}

.fault-info p {
  margin: 8px 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.fault-info strong {
  color: var(--text-primary);
}
</style>
