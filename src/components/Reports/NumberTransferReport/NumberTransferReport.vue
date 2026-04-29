<template>
  <div class="number-transfer-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">号码转接报表</h2>
      <p class="page-note">支持数据导出功能</p>
    </div>

    <!-- 筛选区卡片 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="filterForm"
        label-position="right"
        label-width="90px"
        class="filter-form"
        inline
      >
        <!-- 查询方式 -->
        <el-form-item label="查询方式">
          <el-select
            v-model="filterForm.queryMethod"
            placeholder="请选择查询方式"
            style="width: 140px"
            @change="handleQueryMethodChange"
          >
            <el-option
              v-for="option in queryMethodOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 统计方式 -->
        <el-form-item label="统计方式">
          <el-select
            v-model="filterForm.statisticsPeriod"
            placeholder="请选择统计方式"
            style="width: 140px"
          >
            <el-option
              v-for="option in statisticsPeriodOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 时间范围 -->
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 300px"
          />
        </el-form-item>

        <!-- 话务查询方 -->
        <el-form-item label="话务查询方">
          <el-select
            v-model="filterForm.callQueryParty"
            placeholder="请选择话务查询方"
            style="width: 140px"
          >
            <el-option
              v-for="option in callQueryPartyOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 班组 -->
        <el-form-item label="班组" v-if="filterForm.callQueryParty === 'team'">
          <el-select
            v-model="filterForm.team"
            placeholder="请选择班组"
            style="width: 140px"
          >
            <el-option
              v-for="team in teamList"
              :key="team"
              :label="team"
              :value="team"
            />
          </el-select>
        </el-form-item>

        <!-- 员工 -->
        <el-form-item label="员工" v-if="filterForm.callQueryParty === 'employee'">
          <el-input
            v-model="filterForm.employee"
            placeholder="请输入员工姓名"
            style="width: 140px"
          />
        </el-form-item>

        <!-- 按钮区 -->
        <el-form-item label-width="0" class="button-form-item">
          <div class="button-group">
            <el-button type="primary" :loading="loading" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleExport">
              导出数据
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表区卡片 -->
    <el-card class="table-card" shadow="never">
      <!-- 表格标题 -->
      <div class="table-header">
        <h3 class="table-title">数据列表</h3>
      </div>

      <!-- 表格 -->
        <el-table
          v-loading="loading"
          :data="tableData"
          stripe
          style="width: 100%"
          :empty-text="emptyText"
          class="modern-table"
          fit
        >
        <!-- 转接日期 -->
        <el-table-column
          prop="transferDate"
          label="转接日期"
          min-width="120"
          align="center"
        />

        <!-- 电话号码 -->
        <el-table-column
          prop="phoneNumber"
          label="电话号码"
          min-width="150"
          align="center"
        />

        <!-- 转接次数 -->
        <el-table-column
          prop="transferCount"
          label="转接次数"
          min-width="100"
          align="right"
        />

        <!-- 转接成功次数 -->
        <el-table-column
          prop="successCount"
          label="转接成功次数"
          min-width="120"
          align="right"
        />

        <!-- 转接成功率 -->
        <el-table-column
          prop="successRate"
          label="转接成功率"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.successRate)">{{ row.successRate }}%</span>
          </template>
        </el-table-column>

        <!-- 转接通话时长【秒】 -->
        <el-table-column
          prop="callDuration"
          label="转接通话时长【秒】"
          min-width="140"
          align="right"
          flex
        />
      </el-table>

      <!-- 分页 -->
      <div v-if="tableData.length > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 20px; text-align: right"
        />
      </div>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

import * as XLSX from 'xlsx'
import type { FilterForm, NumberTransferItem, ReportQueryParams } from './types/numberTransferReport'
import { 
  queryMethodOptions, 
  statisticsPeriodOptions, 
  callQueryPartyOptions, 
  teamList, 
  fetchNumberTransferData 
} from './mock/numberTransferMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：查询方式、统计方式、时间范围、话务查询方 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  queryMethod: 'all',
  statisticsPeriod: 'day',
  dateRange: [],
  callQueryParty: 'all',
  team: '全部班组',
  employee: ''
})

/**
 * 班组筛选始终显示
 */

// ==================== 数据加载 ====================
const loading = ref(false)
const tableData = ref<NumberTransferItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const emptyText = ref('暂无号码转接业务统计数据')



/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据，支持分页
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      queryMethod: filterForm.queryMethod,
      statisticsPeriod: filterForm.statisticsPeriod,
      startDate: filterForm.dateRange?.[0],
      endDate: filterForm.dateRange?.[1],
      callQueryParty: filterForm.callQueryParty,
      team: filterForm.team,
      employee: filterForm.employee
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchNumberTransferData(params)
    total.value = data.length

    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = data.slice(start, end)
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// ==================== 事件处理 ====================
/**
 * 查询方式变更
 * 业务逻辑：当查询方式为班组时，显示班组筛选
 */
const handleQueryMethodChange = () => {
  if (filterForm.queryMethod !== 'team') {
    filterForm.team = '全部班组'
  }
}

/**
 * 查询按钮
 * 业务逻辑：根据筛选条件重新加载数据，自带loading加载态
 */
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  loadData()
}

/**
 * 重置按钮
 * 业务逻辑：一键清空所有筛选项，恢复全部组件初始默认状态
 */
const handleReset = () => {
  filterForm.queryMethod = 'all'
  filterForm.statisticsPeriod = 'day'
  filterForm.dateRange = []
  filterForm.callQueryParty = 'all'
  filterForm.team = '全部班组'
  filterForm.employee = ''
  currentPage.value = 1
  pageSize.value = 10

  // 重新加载数据
  loadData()
}

/**
 * 导出按钮
 * 业务逻辑：导出表格数据为Excel
 */
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 准备导出数据
  const exportData = tableData.value.map(item => ({
    '转接日期': item.transferDate,
    '电话号码': item.phoneNumber,
    '转接次数': item.transferCount,
    '转接成功次数': item.successCount,
    '转接成功率': item.successRate + '%',
    '转接通话时长【秒】': item.callDuration
  }))

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 12 }, // 转接日期
    { wch: 15 }, // 电话号码
    { wch: 10 }, // 转接次数
    { wch: 12 }, // 转接成功次数
    { wch: 12 }, // 转接成功率
    { wch: 14 }  // 转接通话时长【秒】
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '号码转接报表')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `号码转接报表_${dateStr}.xlsx`

  // 下载文件
  XLSX.writeFile(wb, fileName)

  ElMessage.success('导出成功')
}

/**
 * 分页大小变更
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

/**
 * 当前页码变更
 */
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  loadData()
}

/**
 * 获取成功率样式类
 * 根据率值返回不同颜色样式
 */
const getRateClass = (rate: number): string => {
  if (rate >= 90) return 'rate-high'
  if (rate >= 80) return 'rate-medium'
  return 'rate-low'
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 页面加载时自动查询数据
  loadData()
})
</script>

<style scoped lang="scss">
.number-transfer-report {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

// 页面标题
.page-header {
  margin-bottom: 20px;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 4px 0;
    padding: 0;
  }

  .page-note {
    font-size: 14px;
    color: #909399;
    margin: 0;
    padding: 0;
  }
}

// 筛选区卡片
.filter-card {
  margin-bottom: 20px;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

// 筛选表单
.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  .el-form-item {
    margin-bottom: 0;
    margin-right: 0;
  }

  .button-form-item {
    margin-left: auto;
  }

  .button-group {
    display: flex;
    gap: 8px;
  }
}

// 数据列表区卡片
.table-card {
  border-radius: 8px;
  height: calc(100vh - 320px);
  display: flex;
  flex-direction: column;
  width: 100%;

  :deep(.el-card__body) {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}

// 表格头部
.table-header {
  margin-bottom: 16px;

  .table-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #409eff;
      border-radius: 2px;
    }
  }
}

// 现代化表格样式
.modern-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100% !important;

  :deep(.el-table__header) {
    th {
      background-color: #f5f7fa;
      color: #606266;
      font-weight: 600;
      height: 44px;
      font-size: 13px;
      padding: 0 16px;
    }
  }

  :deep(.el-table__row) {
    height: 40px;
  }

  :deep(.el-table__cell) {
    padding: 0 16px;
  }

  :deep(.el-table__empty-block) {
    min-height: 200px;
  }

  :deep(.el-table__body-wrapper) {
    flex: 1;
    overflow: auto;
    padding-right: 16px;
  }

  :deep(.el-table__inner-wrapper) {
    width: 100% !important;
  }

  :deep(.el-table) {
    width: 100% !important;
  }
}

// 成功率样式
.rate-high {
  color: #67c23a;
  font-weight: 500;
}

.rate-medium {
  color: #e6a23c;
  font-weight: 500;
}

.rate-low {
  color: #f56c6c;
  font-weight: 500;
}

// 分页
.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
  flex-shrink: 0;
}

// 响应式适配
@media (max-width: 1400px) {
  .filter-form {
    .button-form-item {
      margin-left: 0;
      margin-top: 12px;
      width: 100%;
    }

    .button-group {
      justify-content: flex-end;
    }
  }
}

@media (max-width: 768px) {
  .number-transfer-report {
    padding: 12px;
  }

  .modern-table {
    overflow-x: auto;
  }
}
</style>
