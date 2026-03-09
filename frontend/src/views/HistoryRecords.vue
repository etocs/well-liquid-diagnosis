<template>
  <div class="history-records">
    <div class="page-header">
      <h2 class="page-title">历史预警记录</h2>
    </div>
    
    <div class="filter-section">
      <el-select v-model="selectedPlatform" placeholder="全部平台" style="width: 150px">
        <el-option label="全部平台" value="all" />
        <el-option label="乌石17-2" value="ws17-2" />
      </el-select>
      
      <div class="date-filter">
        <span style="margin-right: 10px; color: var(--text-secondary);">起始时间：</span>
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="年/月/日"
          format="YYYY/MM/DD"
          style="width: 150px"
        />
      </div>
      
      <div class="date-filter">
        <span style="margin-right: 10px; color: var(--text-secondary);">截止时间：</span>
        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="2025/08/09"
          format="YYYY/MM/DD"
          style="width: 150px"
        />
      </div>
      
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
    
    <div class="table-container">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#112240', color: '#fff' }"
      >
        <el-table-column prop="id" label="序号" width="80" align="center" />
        <el-table-column prop="platform" label="基础平台" width="150" align="center" />
        <el-table-column prop="well" label="井名称" width="120" align="center" />
        <el-table-column prop="set" label="套名" width="100" align="center" />
        <el-table-column prop="faultType" label="故障类型" width="150" align="center" />
        <el-table-column prop="faultTime" label="故障时间" width="200" align="center" />
        <el-table-column label="处理联系" width="150" align="center">
          <template #default="scope">
            <span :class="['status-badge', scope.row.status === '未处理' ? 'pending' : 'processed']">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="processTime" label="处理时间" width="200" align="center" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const selectedPlatform = ref('all')
const startDate = ref('')
const endDate = ref('2025-08-09')
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
    status: '已处理',
    processTime: '2025-08-08 09:50:25'
  },
  {
    id: 2,
    platform: '乌石17-2',
    well: 'A43',
    set: '01',
    faultType: '合气',
    faultTime: '2025-07-14 03:00:00',
    status: '未处理',
    processTime: ''
  }
])

const handleSearch = () => {
  console.log('Searching:', searchKeyword.value)
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.history-records {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.filter-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.date-filter {
  display: flex;
  align-items: center;
}

.table-container {
  flex: 1;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  overflow: auto;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
