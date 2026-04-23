<!--
  人工话务员接续报表
  @description 话务员接续明细数据报表，支持筛选、自动计算、Excel导出
  @version 1.0.0
-->
<template>
  <div class="operator-report-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">人工话务员接续报表</h2>
      <!-- 页面说明按钮 -->
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
      </div>
    </div>

    <!-- 筛选区 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="filterForm"
        label-width="80px"
        class="filter-form"
        @submit.prevent
      >
        <el-row :gutter="20">
          <!-- 时间范围 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 地市 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="5">
            <el-form-item label="地市">
              <el-select v-model="filterForm.city" placeholder="请选择地市" clearable style="width: 100%">
                <el-option
                  v-for="city in cityList"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 班组 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="5">
            <el-form-item label="班组">
              <el-select v-model="filterForm.team" placeholder="请选择班组" clearable style="width: 100%">
                <el-option
                  v-for="team in teamList"
                  :key="team"
                  :label="team"
                  :value="team"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 工号 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="5">
            <el-form-item label="工号">
              <el-input
                v-model="filterForm.employeeId"
                placeholder="请输入工号"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 按钮行 -->
        <el-row :gutter="20" style="margin-top: 16px;">
          <el-col :xs="24" class="filter-buttons">
            <el-button type="primary" :loading="loading" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" :loading="exporting" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="table-header">
          <span class="table-title">话务员接续明细数据</span>
          <el-tag type="info" v-if="reportData.length > 0">共 {{ reportData.length }} 条记录</el-tag>
        </div>
      </template>

      <el-table
        :data="displayData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        @row-click="handleRowClick"
      >
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />

        <!-- 人员名称 -->
        <el-table-column prop="name" label="人员名称" width="100" align="center" fixed="left" />

        <!-- 工号 -->
        <el-table-column prop="employeeId" label="工号" width="90" align="center" />

        <!-- 地市 -->
        <el-table-column prop="city" label="地市" width="90" align="center" />

        <!-- 班组 -->
        <el-table-column prop="team" label="班组" width="100" align="center" />

        <!-- 签入次数 -->
        <el-table-column prop="loginCount" label="签入次数" width="90" align="center" />

        <!-- 签入时长 -->
        <el-table-column label="签入时长" width="110" align="center">
          <template #default="{ row }">
            {{ formatDuration(row.loginDuration) }}
          </template>
        </el-table-column>

        <!-- 空闲率 -->
        <el-table-column label="空闲率" width="90" align="center">
          <template #default="{ row }">
            <span :class="getHighlightClass(row.idleRate, 'idleRate')">
              {{ formatPercentage(row.idleRate) }}
            </span>
          </template>
        </el-table-column>

        <!-- 接通量 -->
        <el-table-column prop="connectedCount" label="接通量" width="90" align="center" />

        <!-- 接通时长 -->
        <el-table-column label="接通时长" width="110" align="center">
          <template #default="{ row }">
            {{ formatDuration(row.connectedDuration) }}
          </template>
        </el-table-column>

        <!-- 平均接通时长 -->
        <el-table-column label="平均接通时长(秒)" width="130" align="center">
          <template #default="{ row }">
            {{ formatAverage(row.avgConnectedDuration) }}
          </template>
        </el-table-column>

        <!-- 呼出次数 -->
        <el-table-column prop="outboundCount" label="呼出次数" width="90" align="center" />

        <!-- 呼出时长 -->
        <el-table-column label="呼出时长(分)" width="110" align="center">
          <template #default="{ row }">
            {{ Math.round(row.outboundDuration / 60) }}
          </template>
        </el-table-column>

        <!-- 小休次数 -->
        <el-table-column prop="breakCount" label="小休次数" width="90" align="center" />

        <!-- 小休时长 -->
        <el-table-column label="小休时长" width="110" align="center">
          <template #default="{ row }">
            {{ formatDuration(row.breakDuration) }}
          </template>
        </el-table-column>

        <!-- 小休率 -->
        <el-table-column label="小休率" width="90" align="center">
          <template #default="{ row }">
            <span :class="getHighlightClass(row.breakRate, 'breakRate')">
              {{ formatPercentage(row.breakRate) }}
            </span>
          </template>
        </el-table-column>

        <!-- 参评量 -->
        <el-table-column prop="evaluatedCount" label="参评量" width="90" align="center" />

        <!-- 参评率 -->
        <el-table-column label="参评率" width="90" align="center">
          <template #default="{ row }">
            {{ formatPercentage(row.evaluateRate) }}
          </template>
        </el-table-column>

        <!-- 参评满意量 -->
        <el-table-column prop="satisfiedCount" label="参评满意量" width="100" align="center" />

        <!-- 参评满意率 -->
        <el-table-column label="参评满意率" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <span :class="getHighlightClass(row.satisfiedRate, 'satisfiedRate')">
              {{ formatPercentage(row.satisfiedRate) }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="calculatedData.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>

      <!-- 空状态 -->
      <el-empty v-if="reportData.length === 0 && !loading" description="暂无统计数据" />
    </el-card>

    <!-- 页面说明抽屉 -->
    <PageInstructionDrawer
      v-model="showPageInstruction"
      :page-id="'operator-report'"
      :page-title="'人工话务员接续报表'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, QuestionFilled } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { PageInstructionDrawer } from '../../PageInstruction'

import type {
  FilterForm,
  OperatorReportItem,
  CalculatedReportItem
} from './types/operatorReport'

import { getOperatorReportData, getCityList, getTeamList } from './mock/operatorReportMock'
import {
  formatDuration,
  formatPercentage,
  formatAverage,
  calculateReportItem,
  getHighlightClass
} from './utils/calculator'

import { exportToExcel, generateFilename } from './utils/excelExport'

// ==================== 响应式数据 ====================
const loading = ref(false)
const exporting = ref(false)
const filterFormRef = ref<FormInstance>()

// 筛选表单
const filterForm = reactive<FilterForm & { dateRange: [string, string] | null }>({
  dateRange: null,
  startTime: '',
  endTime: '',
  city: '全部地市',
  team: '全部班组',
  employeeId: ''
})

// 数据列表
const reportData = ref<OperatorReportItem[]>([])
const cityList = ref<string[]>([])
const teamList = ref<string[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 页面说明抽屉
const showPageInstruction = ref(false)

// ==================== 计算属性 ====================

/**
 * 计算后的报表数据
 */
const calculatedData = computed<CalculatedReportItem[]>(() => {
  return reportData.value.map(item => calculateReportItem(item))
})

/**
 * 分页后的显示数据
 */
const displayData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return calculatedData.value.slice(start, end)
})

// ==================== 方法 ====================

/**
 * 初始化默认时间范围（近3天）
 */
const initDefaultTimeRange = () => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 3)

  filterForm.dateRange = [
    start.toISOString().slice(0, 19).replace('T', ' '),
    end.toISOString().slice(0, 19).replace('T', ' ')
  ]
}

/**
 * 加载数据
 */
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      startTime: filterForm.dateRange?.[0],
      endTime: filterForm.dateRange?.[1],
      city: filterForm.city === '全部地市' ? '' : filterForm.city,
      team: filterForm.team === '全部班组' ? '' : filterForm.team,
      employeeId: filterForm.employeeId
    }

    const result = await getOperatorReportData(params)
    if (result.success && result.data) {
      reportData.value = result.data
    } else {
      ElMessage.error(result.message || '加载数据失败')
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 查询
 */
const handleSearch = () => {
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  filterForm.city = '全部地市'
  filterForm.team = '全部班组'
  filterForm.employeeId = ''
  initDefaultTimeRange()
  loadData()
}

/**
 * 导出Excel
 */
const handleExport = async () => {
  if (calculatedData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  exporting.value = true
  try {
    const filename = generateFilename()
    exportToExcel(calculatedData.value, filename)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

/**
 * 分页大小改变
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

/**
 * 页码改变
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

/**
 * 行点击
 */
const handleRowClick = (row: CalculatedReportItem) => {
  console.log('点击行:', row)
}

/**
 * 表头样式
 */
const headerCellStyle = () => {
  return {
    background: '#1a5fb4',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '10px 0'
  }
}

/**
 * 单元格样式
 */
const cellStyle = () => {
  return {}
}

// ==================== 监听器 ====================

// 监听筛选条件变化，自动查询
watch(
  () => [filterForm.city, filterForm.team],
  () => {
    loadData()
  },
  { immediate: false }
)

// ==================== 生命周期 ====================
onMounted(() => {
  cityList.value = getCityList()
  teamList.value = getTeamList()
  initDefaultTimeRange()
  loadData()
})
</script>

<style scoped lang="scss">
// 变量定义
$primary-color: #409eff;
$success-color: #67c23a;
$danger-color: #f56c6c;
$warning-color: #e6a23c;
$bg-color: #f0f2f5;
$card-bg: #ffffff;
$border-color: #e8e8e8;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
$radius-sm: 6px;
$radius-md: 8px;
$radius-lg: 12px;

.operator-report-page {
  padding: 24px;
  background: $bg-color;
  min-height: 100%;
}

// 页面头部 - 现代化设计
.page-header {
  margin-bottom: 24px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: -0.5px;
    position: relative;
    padding-left: 16px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: linear-gradient(180deg, $primary-color 0%, lighten($primary-color, 20%) 100%);
      border-radius: 2px;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

// 筛选卡片 - 现代化卡片设计
.filter-card {
  margin-bottom: 20px;
  border-radius: $radius-lg;
  border: none;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: $shadow-md;
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.filter-form {
  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    font-weight: 500;
    color: $text-secondary;
    font-size: 13px;
  }

  // 输入框样式优化
  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    border-radius: $radius-sm;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 0 0 1px $primary-color inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px $primary-color inset;
    }
  }

  // 日期选择器样式
  :deep(.el-date-editor) {
    .el-input__wrapper {
      padding: 0 12px;
    }
  }

  .filter-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    .el-button {
      border-radius: $radius-sm;
      font-weight: 500;
      padding: 9px 20px;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }

      &--success {
        background: linear-gradient(135deg, $success-color 0%, darken($success-color, 8%) 100%);
        border: none;

        &:hover {
          background: linear-gradient(135deg, lighten($success-color, 5%) 0%, $success-color 100%);
        }
      }

      &--default {
        border-color: #d1d5db;
        color: $text-secondary;

        &:hover {
          border-color: $primary-color;
          color: $primary-color;
        }
      }

      &--primary {
        background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 8%) 100%);
        border: none;

        &:hover {
          background: linear-gradient(135deg, lighten($primary-color, 5%) 0%, $primary-color 100%);
        }
      }
    }
  }
}

// 表格卡片 - 现代化设计
.table-card {
  border-radius: $radius-lg;
  border: none;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: $shadow-md;
  }

  :deep(.el-card__header) {
    padding: 20px 24px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .table-title {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: $primary-color;
        border-radius: 2px;
      }
    }

    .el-tag {
      font-weight: 500;
      padding: 4px 12px;
      border-radius: 12px;
      background: #f3f4f6;
      border-color: #e5e7eb;
      color: $text-secondary;
    }
  }
}

// 表格样式 - 现代化设计
:deep(.el-table) {
  font-size: 13px;
  border-radius: 0;

  // 表头样式
  .el-table__header {
    th {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      color: $text-primary;
      font-weight: 600;
      font-size: 13px;
      padding: 14px 0;
      border-bottom: 2px solid #e2e8f0;

      .cell {
        line-height: 1.4;
      }
    }
  }

  // 表格行样式
  .el-table__row {
    transition: all 0.2s ease;

    td {
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
      color: $text-primary;
    }

    &:hover {
      background-color: #f8fafc !important;
      transform: scale(1.002);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      z-index: 1;
    }

    &:nth-child(even) {
      background-color: #fafbfc;
    }
  }

  // 序号列样式
  .el-table__column--index {
    .cell {
      font-weight: 500;
      color: $text-secondary;
    }
  }

  // 高亮样式
  .highlight-red {
    color: $danger-color;
    font-weight: 600;
    background: rgba($danger-color, 0.08);
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
  }
}

// 分页样式 - 现代化设计
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 24px;
  background: #fafafa;
  border-top: 1px solid $border-color;

  :deep(.el-pagination) {
    .el-pagination__total {
      color: $text-secondary;
      font-weight: 500;
      margin-right: 16px;
    }

    .el-pagination__sizes {
      margin-right: 16px;

      .el-select {
        .el-input__wrapper {
          border-radius: $radius-sm;
          box-shadow: 0 0 0 1px #dcdfe6 inset;
        }
      }
    }

    .btn-prev,
    .btn-next {
      border-radius: $radius-sm;
      background: $card-bg;
      border: 1px solid #d1d5db;
      color: $text-secondary;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: $primary-color;
        color: $primary-color;
        background: rgba($primary-color, 0.05);
      }

      &:disabled {
        background: #f3f4f6;
        border-color: #e5e7eb;
      }
    }

    .el-pager {
      li {
        border-radius: $radius-sm;
        background: $card-bg;
        border: 1px solid #d1d5db;
        color: $text-secondary;
        font-weight: 500;
        margin: 0 4px;
        transition: all 0.2s ease;

        &:hover {
          border-color: $primary-color;
          color: $primary-color;
          background: rgba($primary-color, 0.05);
        }

        &.is-active {
          background: $primary-color;
          border-color: $primary-color;
          color: #fff;
          box-shadow: 0 2px 8px rgba($primary-color, 0.3);
        }
      }
    }

    .el-pagination__jump {
      color: $text-secondary;
      font-weight: 500;
      margin-left: 16px;

      .el-input {
        width: 50px;
        margin: 0 8px;

        .el-input__wrapper {
          border-radius: $radius-sm;
          box-shadow: 0 0 0 1px #dcdfe6 inset;

          &:hover,
          &.is-focus {
            box-shadow: 0 0 0 1px $primary-color inset;
          }
        }
      }
    }
  }
}

// 空状态样式优化
:deep(.el-empty) {
  padding: 60px 0;

  .el-empty__description {
    color: $text-secondary;
    font-size: 14px;
    margin-top: 16px;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .operator-report-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    .page-title {
      font-size: 20px;
    }
  }

  .filter-form {
    .el-col {
      margin-bottom: 16px;
    }

    .filter-buttons {
      justify-content: flex-start;
      margin-top: 0;
    }
  }

  .pagination-wrapper {
    justify-content: center;
    padding: 12px 16px;

    :deep(.el-pagination) {
      .el-pagination__jump,
      .el-pagination__sizes {
        display: none;
      }
    }
  }
}
</style>
