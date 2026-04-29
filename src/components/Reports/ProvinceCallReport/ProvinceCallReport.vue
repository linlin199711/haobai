<template>
  <div class="province-call-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">全省综合话务统计报表</h2>
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
        <!-- 时间范围 -->
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 340px"
          />
        </el-form-item>

        <!-- 查询方式 -->
        <el-form-item label="查询方式">
          <el-select
            v-model="filterForm.period"
            placeholder="请选择查询方式"
            style="width: 140px"
          >
            <el-option
              v-for="option in periodOptions"
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
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="city in cityList"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
        </el-form-item>

        <!-- 接入码 -->
        <el-form-item label="接入码">
          <el-select
            v-model="filterForm.accessCode"
            placeholder="请选择接入码"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="code in accessCodeList"
              :key="code"
              :label="code"
              :value="code"
            />
          </el-select>
        </el-form-item>

        <!-- 按钮区 -->
        <el-form-item label-width="0" class="button-form-item">
          <div class="button-group">
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" :loading="loading" @click="handleSearch">
              查询
            </el-button>
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
      >
        <!-- 地市 -->
        <el-table-column
          prop="city"
          label="地市"
          width="100"
          align="center"
          fixed="left"
        />

        <!-- 时间 -->
        <el-table-column
          prop="time"
          label="时间"
          width="160"
          align="center"
        />

        <!-- 呼入次数 -->
        <el-table-column
          prop="inboundCount"
          label="呼入次数"
          width="100"
          align="right"
        />

        <!-- 排队次数 -->
        <el-table-column
          prop="queueCount"
          label="排队次数"
          width="100"
          align="right"
        />

        <!-- 排队成功次数 -->
        <el-table-column
          prop="queueSuccessCount"
          label="排队成功次数"
          width="110"
          align="right"
        />

        <!-- 人工接通数 -->
        <el-table-column
          prop="manualAnswerCount"
          label="人工接通数"
          width="100"
          align="right"
        />

        <!-- 及时接通数(20秒内) -->
        <el-table-column
          prop="timelyAnswerCount"
          label="及时接通数(20秒内)"
          width="140"
          align="right"
        />

        <!-- 人工呼损 -->
        <el-table-column
          prop="manualLossCount"
          label="人工呼损"
          width="90"
          align="right"
        />

        <!-- 自动呼损 -->
        <el-table-column
          prop="autoLossCount"
          label="自动呼损"
          width="90"
          align="right"
        />

        <!-- 人工接通率 -->
        <el-table-column
          prop="manualAnswerRate"
          label="人工接通率"
          width="100"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.manualAnswerRate)">{{ row.manualAnswerRate }}%</span>
          </template>
        </el-table-column>

        <!-- 自动接通率 -->
        <el-table-column
          prop="autoAnswerRate"
          label="自动接通率"
          width="100"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.autoAnswerRate)">{{ row.autoAnswerRate }}%</span>
          </template>
        </el-table-column>

        <!-- 自动及时接通率(20秒内) -->
        <el-table-column
          prop="autoTimelyAnswerRate"
          label="自动及时接通率(20秒内)"
          width="160"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.autoTimelyAnswerRate)">{{ row.autoTimelyAnswerRate }}%</span>
          </template>
        </el-table-column>

        <!-- 应答及时率(未含人工呼损) -->
        <el-table-column
          prop="answerTimelyRateNoLoss"
          label="应答及时率(未含人工呼损)"
          width="170"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.answerTimelyRateNoLoss)">{{ row.answerTimelyRateNoLoss }}%</span>
          </template>
        </el-table-column>

        <!-- 应答及时率(含人工呼损) -->
        <el-table-column
          prop="answerTimelyRateWithLoss"
          label="应答及时率(含人工呼损)"
          width="170"
          align="right"
        >
          <template #default="{ row }">
            <span :class="getRateClass(row.answerTimelyRateWithLoss)">{{ row.answerTimelyRateWithLoss }}%</span>
          </template>
        </el-table-column>

        <!-- 处理总时长(分钟) -->
        <el-table-column
          prop="totalProcessTime"
          label="处理总时长(分钟)"
          width="130"
          align="right"
        />

        <!-- 转接总时长(分钟) -->
        <el-table-column
          prop="totalTransferTime"
          label="转接总时长(分钟)"
          width="130"
          align="right"
        />
      </el-table>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

import * as XLSX from 'xlsx'
import type { FilterForm, ProvinceCallItem, ReportQueryParams, SummaryRow } from './types/provinceCallReport'
import { periodOptions, cityList, accessCodeList, fetchProvinceCallData, calculateSummaryRow } from './mock/provinceCallMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：时间范围、查询方式、地市、接入码 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  dateRange: [],
  period: 'hour',
  city: '',
  accessCode: ''
})

// ==================== 数据加载 ====================
const loading = ref(false)
const detailData = ref<ProvinceCallItem[]>([])
const summaryRow = ref<SummaryRow | null>(null)
const emptyText = ref('暂无全省综合话务统计数据')



/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据，自动计算汇总行
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      startDate: filterForm.dateRange?.[0],
      endDate: filterForm.dateRange?.[1],
      period: filterForm.period,
      city: filterForm.city || undefined,
      accessCode: filterForm.accessCode || undefined
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchProvinceCallData(params)
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
    return [...detailData.value, summaryRow.value as ProvinceCallItem]
  }
  return detailData.value
})

/**
 * 获取接通率样式类
 * 根据率值返回不同颜色样式
 */
const getRateClass = (rate: number): string => {
  if (rate >= 90) return 'rate-high'
  if (rate >= 80) return 'rate-medium'
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
 * 业务逻辑：一键还原所有筛选项初始默认状态
 */
const handleReset = () => {
  filterForm.dateRange = []
  filterForm.period = 'hour'
  filterForm.city = ''
  filterForm.accessCode = ''

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
    '地市': item.city,
    '时间': item.time,
    '呼入次数': item.inboundCount,
    '排队次数': item.queueCount,
    '排队成功次数': item.queueSuccessCount,
    '人工接通数': item.manualAnswerCount,
    '及时接通数(20秒内)': item.timelyAnswerCount,
    '人工呼损': item.manualLossCount,
    '自动呼损': item.autoLossCount,
    '人工接通率': item.manualAnswerRate + '%',
    '自动接通率': item.autoAnswerRate + '%',
    '自动及时接通率(20秒内)': item.autoTimelyAnswerRate + '%',
    '应答及时率(未含人工呼损)': item.answerTimelyRateNoLoss + '%',
    '应答及时率(含人工呼损)': item.answerTimelyRateWithLoss + '%',
    '处理总时长(分钟)': item.totalProcessTime,
    '转接总时长(分钟)': item.totalTransferTime
  }))

  // 添加汇总行
  if (summaryRow.value) {
    exportData.push({
      '地市': '合计',
      '时间': '',
      '呼入次数': summaryRow.value.inboundCount,
      '排队次数': summaryRow.value.queueCount,
      '排队成功次数': summaryRow.value.queueSuccessCount,
      '人工接通数': summaryRow.value.manualAnswerCount,
      '及时接通数(20秒内)': summaryRow.value.timelyAnswerCount,
      '人工呼损': summaryRow.value.manualLossCount,
      '自动呼损': summaryRow.value.autoLossCount,
      '人工接通率': summaryRow.value.manualAnswerRate + '%',
      '自动接通率': summaryRow.value.autoAnswerRate + '%',
      '自动及时接通率(20秒内)': summaryRow.value.autoTimelyAnswerRate + '%',
      '应答及时率(未含人工呼损)': summaryRow.value.answerTimelyRateNoLoss + '%',
      '应答及时率(含人工呼损)': summaryRow.value.answerTimelyRateWithLoss + '%',
      '处理总时长(分钟)': summaryRow.value.totalProcessTime,
      '转接总时长(分钟)': summaryRow.value.totalTransferTime
    })
  }

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 10 }, // 地市
    { wch: 18 }, // 时间
    { wch: 10 }, // 呼入次数
    { wch: 10 }, // 排队次数
    { wch: 12 }, // 排队成功次数
    { wch: 11 }, // 人工接通数
    { wch: 16 }, // 及时接通数(20秒内)
    { wch: 10 }, // 人工呼损
    { wch: 10 }, // 自动呼损
    { wch: 11 }, // 人工接通率
    { wch: 11 }, // 自动接通率
    { wch: 18 }, // 自动及时接通率(20秒内)
    { wch: 20 }, // 应答及时率(未含人工呼损)
    { wch: 20 }, // 应答及时率(含人工呼损)
    { wch: 15 }, // 处理总时长(分钟)
    { wch: 15 }  // 转接总时长(分钟)
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '全省综合话务统计')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `全省综合话务统计报表_${dateStr}.xlsx`

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
.province-call-report {
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

  :deep(.el-card__body) {
    padding: 20px;
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
  :deep(.el-table__header) {
    th {
      background-color: #f5f7fa;
      color: #606266;
      font-weight: 600;
      height: 44px;
      font-size: 13px;
    }
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

  :deep(.el-table__row) {
    height: 40px;
  }

  :deep(.el-table__empty-block) {
    min-height: 200px;
  }
}

// 接通率样式
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
  .province-call-report {
    padding: 12px;
  }

  .modern-table {
    overflow-x: auto;
  }
}
</style>
