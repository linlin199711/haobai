<template>
  <div class="merchant-data-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">114推广/百事通加盟商家数据报表</h2>
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

    <!-- 筛选区卡片 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="filterForm"
        label-position="right"
        label-width="80px"
        class="filter-form"
        inline
      >
        <!-- 开始时间 -->
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="filterForm.startDate"
            type="date"
            placeholder="开始日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            style="width: 140px"
          />
        </el-form-item>

        <!-- 结束时间 -->
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="filterForm.endDate"
            type="date"
            placeholder="结束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            style="width: 140px"
          />
        </el-form-item>

        <!-- 类型 -->
        <el-form-item label="类型">
          <el-select
            v-model="filterForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 160px"
          >
            <el-option
              v-for="type in businessTypeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value"
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
              导出
            </el-button>
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
        :span-method="spanMethod"
      >
        <!-- 地区列 -->
        <el-table-column
          prop="city"
          label="地区"
          width="100"
          align="center"
          fixed="left"
        />

        <!-- 优推业务 -->
        <el-table-column label="优推业务" align="center">
          <el-table-column
            prop="promotion.weeklyNew"
            label="周新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="promotion.monthlyNew"
            label="月新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="promotion.arrival"
            label="到达量"
            width="80"
            align="right"
          />
        </el-table-column>

        <!-- 品牌业务 -->
        <el-table-column label="品牌业务" align="center">
          <el-table-column
            prop="brand.weeklyNew"
            label="周新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="brand.monthlyNew"
            label="月新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="brand.arrival"
            label="到达量"
            width="80"
            align="right"
          />
        </el-table-column>

        <!-- 实名业务 -->
        <el-table-column label="实名业务" align="center">
          <el-table-column
            prop="realname.weeklyNew"
            label="周新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="realname.monthlyNew"
            label="月新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="realname.arrival"
            label="到达量"
            width="80"
            align="right"
          />
        </el-table-column>

        <!-- 转接业务 -->
        <el-table-column label="转接业务" align="center">
          <el-table-column
            prop="transfer.weeklyNew"
            label="周新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="transfer.monthlyNew"
            label="月新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="transfer.arrival"
            label="到达量"
            width="80"
            align="right"
          />
        </el-table-column>

        <!-- 短信业务 -->
        <el-table-column label="短信业务" align="center">
          <el-table-column
            prop="sms.weeklyNew"
            label="周新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="sms.monthlyNew"
            label="月新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="sms.arrival"
            label="到达量"
            width="80"
            align="right"
          />
        </el-table-column>

        <!-- 合计 -->
        <el-table-column label="合计" align="center">
          <el-table-column
            prop="total.weeklyNew"
            label="周新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="total.monthlyNew"
            label="月新增"
            width="80"
            align="right"
          />
          <el-table-column
            prop="total.arrival"
            label="到达量"
            width="80"
            align="right"
          />
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 页面说明抽屉 -->
    <PageInstructionDrawer
      v-model="showPageInstruction"
      :page-id="'merchant-data-report'"
      :page-title="'114推广/百事通加盟商家数据报表'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { PageInstructionDrawer } from '../../PageInstruction'
import * as XLSX from 'xlsx'
import type { FilterForm, MerchantDataItem, ReportQueryParams } from './types/merchantDataReport'
import { businessTypeOptions, fetchMerchantData, calculateSummaryRow } from './mock/merchantDataMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：开始时间、结束时间、类型 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  startDate: '',
  endDate: '',
  type: 'all'
})

// ==================== 数据加载 ====================// 数据加载
const loading = ref(false)
const detailData = ref<MerchantDataItem[]>([])
const summaryRow = ref<any>(null)
const emptyText = ref('暂无114推广商家业务统计数据')

// 页面说明抽屉
const showPageInstruction = ref(false)

/**
 * 表格数据（包含合计行）
 */
const tableData = computed(() => {
  if (summaryRow.value) {
    return [...detailData.value, summaryRow.value]
  }
  return detailData.value
})

/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据，自动计算合计行
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      startDate: filterForm.startDate || undefined,
      endDate: filterForm.endDate || undefined,
      type: filterForm.type || undefined
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchMerchantData(params)
    detailData.value = data

    // 计算合计行
    summaryRow.value = calculateSummaryRow(data)
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 表格合并方法
 * 用于处理合计行的特殊样式
 */
const spanMethod = ({
  row,
  columnIndex
}: {
  row: MerchantDataItem
  columnIndex: number
}) => {
  // 如果是合计行，第一列显示"合计"
  if (row.city === '合计') {
    if (columnIndex === 0) {
      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }
  return {
    rowspan: 1,
    colspan: 1
  }
}

/**
 * 数字格式化
 * 规范数字展示
 */
const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN')
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
  filterForm.startDate = ''
  filterForm.endDate = ''
  filterForm.type = 'all'

  // 重新加载数据
  loadData()
}

/**
 * 导出按钮
 * 业务逻辑：导出表格数据为Excel，保留多级表头结构
 */
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 准备表头（多级表头结构）
  const headerRows = [
    // 第一级表头
    ['地区', '优推业务', '', '', '品牌业务', '', '', '实名业务', '', '', '转接业务', '', '', '短信业务', '', '', '合计', '', ''],
    // 第二级表头
    ['', '周新增', '月新增', '到达量', '周新增', '月新增', '到达量', '周新增', '月新增', '到达量', '周新增', '月新增', '到达量', '周新增', '月新增', '到达量', '周新增', '月新增', '到达量']
  ]

  // 准备数据行
  const dataRows = tableData.value.map(item => [
    item.city,
    item.promotion.weeklyNew,
    item.promotion.monthlyNew,
    item.promotion.arrival,
    item.brand.weeklyNew,
    item.brand.monthlyNew,
    item.brand.arrival,
    item.realname.weeklyNew,
    item.realname.monthlyNew,
    item.realname.arrival,
    item.transfer.weeklyNew,
    item.transfer.monthlyNew,
    item.transfer.arrival,
    item.sms.weeklyNew,
    item.sms.monthlyNew,
    item.sms.arrival,
    item.total.weeklyNew,
    item.total.monthlyNew,
    item.total.arrival
  ])

  // 添加合计行
  if (summaryRow.value) {
    dataRows.push([
      '合计',
      summaryRow.value.promotion.weeklyNew,
      summaryRow.value.promotion.monthlyNew,
      summaryRow.value.promotion.arrival,
      summaryRow.value.brand.weeklyNew,
      summaryRow.value.brand.monthlyNew,
      summaryRow.value.brand.arrival,
      summaryRow.value.realname.weeklyNew,
      summaryRow.value.realname.monthlyNew,
      summaryRow.value.realname.arrival,
      summaryRow.value.transfer.weeklyNew,
      summaryRow.value.transfer.monthlyNew,
      summaryRow.value.transfer.arrival,
      summaryRow.value.sms.weeklyNew,
      summaryRow.value.sms.monthlyNew,
      summaryRow.value.sms.arrival,
      summaryRow.value.total.weeklyNew,
      summaryRow.value.total.monthlyNew,
      summaryRow.value.total.arrival
    ])
  }

  // 合并表头和数据
  const allRows = [...headerRows, ...dataRows]

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(allRows)

  // 设置合并单元格（多级表头）
  ws['!merges'] = [
    // 第一级表头合并
    { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }, // 优推业务
    { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } }, // 品牌业务
    { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } }, // 实名业务
    { s: { r: 0, c: 10 }, e: { r: 0, c: 12 } }, // 转接业务
    { s: { r: 0, c: 13 }, e: { r: 0, c: 15 } }, // 短信业务
    { s: { r: 0, c: 16 }, e: { r: 0, c: 18 } } // 合计
  ]

  // 设置列宽
  ws['!cols'] = [
    { wch: 12 }, // 地区
    { wch: 10 }, { wch: 10 }, { wch: 10 }, // 优推业务
    { wch: 10 }, { wch: 10 }, { wch: 10 }, // 品牌业务
    { wch: 10 }, { wch: 10 }, { wch: 10 }, // 实名业务
    { wch: 10 }, { wch: 10 }, { wch: 10 }, // 转接业务
    { wch: 10 }, { wch: 10 }, { wch: 10 }, // 短信业务
    { wch: 10 }, { wch: 10 }, { wch: 10 }  // 合计
  ]

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '114推广商家数据')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `114推广百事通加盟商家数据报表_${dateStr}.xlsx`

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
.merchant-data-report {
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

// 现代化表格样式
.modern-table {
  :deep(.el-table__header) {
    th {
      background-color: #f5f7fa;
      color: #606266;
      font-weight: 600;
    }

    // 一级表头样式
    .el-table__cell {
      background-color: #f5f7fa;
    }
  }

  // 合计行样式
  :deep(.el-table__row.summary-row) {
    background-color: #ecf5ff;
    font-weight: 600;

    td {
      background-color: #ecf5ff;
      color: #409eff;
    }
  }

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

// 响应式适配
@media (max-width: 1200px) {
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
  .merchant-data-report {
    padding: 12px;
  }

  .modern-table {
    overflow-x: auto;
  }
}
</style>
