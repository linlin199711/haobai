<template>
  <div class="operator-work-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">操作员工作情况</h2>
      <div class="header-actions">
        <el-button
          type="default"
          plain
          @click="showPageInstruction = true"
          class="page-instruction-btn"
        >
          <el-icon class="icon"><QuestionFilled /></el-icon>
          页面说明
        </el-button>
        <el-button type="success" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出Excel
        </el-button>
      </div>
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
        <!-- 是否实时 -->
        <el-form-item label="是否实时">
          <el-select
            v-model="filterForm.isRealTime"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="option in isRealTimeOptions"
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

        <!-- 组合方式 -->
        <el-form-item label="组合方式">
          <el-select
            v-model="filterForm.combinationMode"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="option in combinationModeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 话务类型 -->
        <el-form-item label="话务类型">
          <el-select
            v-model="filterForm.callType"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="option in callTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 地市 -->
        <el-form-item label="地市">
          <el-select
            v-model="filterForm.city"
            placeholder="请选择地市"
            style="width: 120px"
          >
            <el-option
              v-for="city in cityList"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
        </el-form-item>

        <!-- 班组 -->
        <el-form-item label="班组">
          <el-select
            v-model="filterForm.team"
            placeholder="请选择班组"
            style="width: 120px"
          >
            <el-option
              v-for="team in teamList"
              :key="team"
              :label="team"
              :value="team"
            />
          </el-select>
        </el-form-item>

        <!-- 话务查询方 -->
        <el-form-item label="话务查询方">
          <el-select
            v-model="filterForm.callQueryParty"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="option in callQueryPartyOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 按钮区 -->
        <el-form-item label-width="0" class="button-form-item">
          <div class="button-group">
            <el-button type="primary" :loading="loading" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表区卡片 -->
    <el-card class="table-card" shadow="never">
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
        <!-- 时间 -->
        <el-table-column
          prop="time"
          label="时间"
          min-width="100"
          align="center"
          fixed="left"
        />

        <!-- 工号 -->
        <el-table-column
          prop="employeeId"
          label="工号"
          min-width="80"
          align="center"
          fixed="left"
        />

        <!-- 姓名 -->
        <el-table-column
          prop="employeeName"
          label="姓名"
          min-width="80"
          align="center"
          fixed="left"
        />

        <!-- 工作时长（分钟） -->
        <el-table-column
          prop="workDuration"
          label="工作时长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.workDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 振铃时长（秒） -->
        <el-table-column
          prop="ringDuration"
          label="振铃时长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.ringDuration }}秒</span>
          </template>
        </el-table-column>

        <!-- 应管时长（分钟） -->
        <el-table-column
          prop="manageDuration"
          label="应管时长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.manageDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 时间成功呼出时长（分钟） -->
        <el-table-column
          prop="successCallDuration"
          label="时间成功呼出时长"
          min-width="140"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.successCallDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 通话时长（分钟） -->
        <el-table-column
          prop="callDuration"
          label="通话时长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.callDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 手工示忙时长（分钟） -->
        <el-table-column
          prop="manualBusyDuration"
          label="手工示忙时长"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.manualBusyDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 整理时长（分钟） -->
        <el-table-column
          prop="organizeDuration"
          label="整理时长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.organizeDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 非服务时长（分钟） -->
        <el-table-column
          prop="nonServiceDuration"
          label="非服务时长"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.nonServiceDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 待话时长（分钟） -->
        <el-table-column
          prop="waitingDuration"
          label="待话时长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.waitingDuration }}分钟</span>
          </template>
        </el-table-column>

        <!-- 应答次数 -->
        <el-table-column
          prop="answerCount"
          label="应答次数"
          min-width="100"
          align="right"
        />

        <!-- 应答均长（秒） -->
        <el-table-column
          prop="avgAnswerDuration"
          label="应答均长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.avgAnswerDuration }}秒</span>
          </template>
        </el-table-column>

        <!-- 闲时呼出成功次数 -->
        <el-table-column
          prop="idleSuccessCount"
          label="闲时呼出成功次数"
          min-width="140"
          align="right"
        />

        <!-- 闲时呼出成功均长（秒） -->
        <el-table-column
          prop="avgIdleSuccessDuration"
          label="闲时呼出成功均长"
          min-width="160"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.avgIdleSuccessDuration }}秒</span>
          </template>
        </el-table-column>

        <!-- 通话次数 -->
        <el-table-column
          prop="callCount"
          label="通话次数"
          min-width="100"
          align="right"
        />

        <!-- 通话均长（秒） -->
        <el-table-column
          prop="avgCallDuration"
          label="通话均长"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span>{{ row.avgCallDuration }}秒</span>
          </template>
        </el-table-column>

        <!-- 工时利用率（%） -->
        <el-table-column
          prop="workTimeUtilization"
          label="工时利用率"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.workTimeUtilization)">{{ row.workTimeUtilization }}%</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 页面说明抽屉 -->
    <PageInstructionDrawer
      v-model="showPageInstruction"
      :page-id="'operator-work-report'"
      :page-title="'操作员工作情况'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Download, QuestionFilled } from '@element-plus/icons-vue'
import { PageInstructionDrawer } from '../../PageInstruction'
import * as XLSX from 'xlsx'
import type { FilterForm, OperatorWorkItem, ReportQueryParams, SummaryRow } from './types/operatorWorkReport'
import { 
  isRealTimeOptions, 
  combinationModeOptions, 
  callTypeOptions, 
  callQueryPartyOptions, 
  cityList, 
  teamList, 
  fetchOperatorWorkData, 
  calculateSummaryRow 
} from './mock/operatorWorkMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：是否实时、时间范围、组合方式、话务类型、地市、班组、话务查询方 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  isRealTime: 'no',
  dateRange: [],
  combinationMode: 'day',
  callType: 'all',
  city: '全部地市',
  team: '全部班组',
  callQueryParty: 'all'
})

// ==================== 数据加载 ====================
const loading = ref(false)
const detailData = ref<OperatorWorkItem[]>([])
const summaryRow = ref<SummaryRow | null>(null)
const emptyText = ref('暂无操作员工作情况统计数据')

// 页面说明抽屉
const showPageInstruction = ref(false)

/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据，自动计算汇总行
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      isRealTime: filterForm.isRealTime,
      startDate: filterForm.dateRange?.[0],
      endDate: filterForm.dateRange?.[1],
      combinationMode: filterForm.combinationMode,
      callType: filterForm.callType,
      city: filterForm.city,
      team: filterForm.team,
      callQueryParty: filterForm.callQueryParty
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchOperatorWorkData(params)
    detailData.value = data

    // 计算汇总行
    summaryRow.value = calculateSummaryRow(data)
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// ==================== 表格数据 ====================
/**
 * 表格数据（包含汇总行）
 */
const tableData = computed(() => {
  if (summaryRow.value) {
    return [...detailData.value, summaryRow.value as OperatorWorkItem]
  }
  return detailData.value
})

/**
 * 获取工时利用率样式类
 * 根据率值返回不同颜色样式
 */
const getRateClass = (rate: number): string => {
  if (rate >= 80) return 'rate-high'
  if (rate >= 70) return 'rate-medium'
  return 'rate-low'
}

// ==================== 事件处理 ====================
/**
 * 查询按钮
 * 业务逻辑：根据筛选条件重新加载数据，自带loading加载态
 */
const handleSearch = () => {
  loadData()
}

/**
 * 重置按钮
 * 业务逻辑：一键清空所有筛选项，恢复全部组件初始默认状态
 */
const handleReset = () => {
  filterForm.isRealTime = 'no'
  filterForm.dateRange = []
  filterForm.combinationMode = 'day'
  filterForm.callType = 'all'
  filterForm.city = '全部地市'
  filterForm.team = '全部班组'
  filterForm.callQueryParty = 'all'

  // 重新加载数据
  loadData()
}

/**
 * 导出按钮
 * 业务逻辑：导出表格数据为Excel，包含汇总行
 */
const handleExport = () => {
  if (detailData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 准备导出数据
  const exportData = detailData.value.map(item => ({
    '时间': item.time,
    '工号': item.employeeId,
    '姓名': item.employeeName,
    '工作时长': item.workDuration + '分钟',
    '振铃时长': item.ringDuration + '秒',
    '应管时长': item.manageDuration + '分钟',
    '时间成功呼出时长': item.successCallDuration + '分钟',
    '通话时长': item.callDuration + '分钟',
    '手工示忙时长': item.manualBusyDuration + '分钟',
    '整理时长': item.organizeDuration + '分钟',
    '非服务时长': item.nonServiceDuration + '分钟',
    '待话时长': item.waitingDuration + '分钟',
    '应答次数': item.answerCount,
    '应答均长': item.avgAnswerDuration + '秒',
    '闲时呼出成功次数': item.idleSuccessCount,
    '闲时呼出成功均长': item.avgIdleSuccessDuration + '秒',
    '通话次数': item.callCount,
    '通话均长': item.avgCallDuration + '秒',
    '工时利用率': item.workTimeUtilization + '%'
  }))

  // 添加汇总行
  if (summaryRow.value) {
    exportData.push({
      '时间': '',
      '工号': '',
      '姓名': '合计',
      '工作时长': summaryRow.value.workDuration + '分钟',
      '振铃时长': summaryRow.value.ringDuration + '秒',
      '应管时长': summaryRow.value.manageDuration + '分钟',
      '时间成功呼出时长': summaryRow.value.successCallDuration + '分钟',
      '通话时长': summaryRow.value.callDuration + '分钟',
      '手工示忙时长': summaryRow.value.manualBusyDuration + '分钟',
      '整理时长': summaryRow.value.organizeDuration + '分钟',
      '非服务时长': summaryRow.value.nonServiceDuration + '分钟',
      '待话时长': summaryRow.value.waitingDuration + '分钟',
      '应答次数': summaryRow.value.answerCount,
      '应答均长': summaryRow.value.avgAnswerDuration + '秒',
      '闲时呼出成功次数': summaryRow.value.idleSuccessCount,
      '闲时呼出成功均长': summaryRow.value.avgIdleSuccessDuration + '秒',
      '通话次数': summaryRow.value.callCount,
      '通话均长': summaryRow.value.avgCallDuration + '秒',
      '工时利用率': summaryRow.value.workTimeUtilization + '%'
    })
  }

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 10 }, // 时间
    { wch: 8 },  // 工号
    { wch: 8 },  // 姓名
    { wch: 10 }, // 工作时长
    { wch: 10 }, // 振铃时长
    { wch: 10 }, // 应管时长
    { wch: 14 }, // 时间成功呼出时长
    { wch: 10 }, // 通话时长
    { wch: 12 }, // 手工示忙时长
    { wch: 10 }, // 整理时长
    { wch: 12 }, // 非服务时长
    { wch: 10 }, // 待话时长
    { wch: 10 }, // 应答次数
    { wch: 10 }, // 应答均长
    { wch: 14 }, // 闲时呼出成功次数
    { wch: 16 }, // 闲时呼出成功均长
    { wch: 10 }, // 通话次数
    { wch: 10 }, // 通话均长
    { wch: 12 }  // 工时利用率
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '操作员工作情况')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `操作员工作情况报表_${dateStr}.xlsx`

  // 下载文件
  XLSX.writeFile(wb, fileName)

  ElMessage.success('导出成功')
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 页面加载时自动查询数据
  loadData()
})
</script>

<style scoped lang="scss">
.operator-work-report {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

// 页面标题
.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    padding: 0;
  }

  .header-actions {
    display: flex;
    gap: 8px;
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

  // 汇总行样式
  :deep(.el-table__row:last-child) {
    background-color: #ecf5ff;
    font-weight: 600;

    td {
      background-color: #ecf5ff;
      color: #409eff;
    }

    td:first-child {
      color: #409eff;
      font-weight: 700;
    }
  }
}

// 工时利用率样式
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
  .operator-work-report {
    padding: 12px;
  }

  .modern-table {
    overflow-x: auto;
  }
}
</style>
