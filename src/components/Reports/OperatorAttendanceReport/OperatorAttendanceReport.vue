<template>
  <div class="operator-attendance-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="breadcrumb">
        <span>运营报表</span>
        <el-icon class="breadcrumb-separator"><ArrowRight /></el-icon>
        <span>操作员考勤统计</span>
      </div>
      <h2 class="page-title">操作员考勤统计</h2>
    </div>

    <!-- 筛选区卡片 -->
    <el-card class="filter-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Filter /></el-icon>
          <span>筛选条件</span>
        </div>
      </template>

      <el-form
        ref="filterFormRef"
        :model="filterForm"
        label-width="90px"
        class="filter-form"
        @submit.prevent
      >
        <el-row :gutter="20">
          <!-- 时间范围 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 话务查询方 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="话务查询方">
              <el-select v-model="filterForm.callQueryMethod" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="option in callQueryMethodOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 班组 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="班组">
              <el-select v-model="filterForm.team" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="team in teamList"
                  :key="team"
                  :label="team"
                  :value="team"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <el-row :gutter="20" justify="end">
          <el-col :span="24" class="filter-buttons">
            <el-button @click="handleReset">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
            <el-button type="primary" :loading="loading" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据列表区卡片 -->
    <el-card class="table-card" shadow="never">
      <!-- 表格标题 -->
      <div class="table-header">
        <h3 class="table-title">考勤记录列表</h3>
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
        <!-- 时间 -->
        <el-table-column
          prop="date"
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

        <!-- 对应小号码 -->
        <el-table-column
          prop="smallNumber"
          label="对应小号码"
          min-width="100"
          align="center"
        />

        <!-- 签入时间 -->
        <el-table-column
          prop="checkInTime"
          label="签入时间"
          min-width="160"
          align="center"
        />

        <!-- 签出时间 -->
        <el-table-column
          prop="checkOutTime"
          label="签出时间"
          min-width="160"
          align="center"
        >
          <template #default="{ row }">
            <span v-if="row.checkOutTime">{{ row.checkOutTime }}</span>
            <el-tag v-else type="warning">未签出</el-tag>
          </template>
        </el-table-column>

        <!-- 工作时长（秒） -->
        <el-table-column
          prop="workDuration"
          label="工作时长（秒）"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span v-if="row.workDuration" class="duration-tag">{{ row.workDuration }}</span>
            <span v-else class="duration-empty">-</span>
          </template>
        </el-table-column>
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

    <!-- 页面说明抽屉 -->
    <PageInstructionDrawer
      v-model="showPageInstruction"
      :page-id="'operator-attendance-report'"
      :page-title="'操作员考勤统计'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ArrowRight, QuestionFilled, Filter, RefreshRight, Search, Download } from '@element-plus/icons-vue'
import { PageInstructionDrawer } from '../../PageInstruction'
import * as XLSX from 'xlsx'
import type { FilterForm, OperatorAttendanceItem, ReportQueryParams } from './types/operatorAttendanceReport'
import { 
  callQueryMethodOptions, 
  teamList, 
  fetchOperatorAttendanceData 
} from './mock/operatorAttendanceMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：时间范围、话务查询方式、班组 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  dateRange: [],
  callQueryMethod: 'all',
  team: '全部班组'
})

// ==================== 数据加载 ====================
const loading = ref(false)
const tableData = ref<OperatorAttendanceItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const emptyText = ref('暂无操作员考勤统计数据')

// 页面说明抽屉
const showPageInstruction = ref(false)

/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据，支持分页
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      startDate: filterForm.dateRange?.[0],
      endDate: filterForm.dateRange?.[1],
      callQueryMethod: filterForm.callQueryMethod,
      team: filterForm.team
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchOperatorAttendanceData(params)
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
  filterForm.dateRange = []
  filterForm.callQueryMethod = 'all'
  filterForm.team = '全部班组'
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
    '时间': item.date,
    '工号': item.employeeId,
    '姓名': item.employeeName,
    '对应小号码': item.smallNumber,
    '签入时间': item.checkInTime,
    '签出时间': item.checkOutTime || '未签出',
    '工作时长（秒）': item.workDuration || '-'
  }))

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 10 }, // 时间
    { wch: 8 },  // 工号
    { wch: 8 },  // 姓名
    { wch: 10 }, // 对应小号码
    { wch: 16 }, // 签入时间
    { wch: 16 }, // 签出时间
    { wch: 12 }  // 工作时长（秒）
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '操作员考勤统计')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `操作员考勤统计报表_${dateStr}.xlsx`

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

// ==================== 生命周期 ====================
onMounted(() => {
  // 页面加载时自动查询数据
  loadData()
})
</script>

<style scoped lang="scss">
.operator-attendance-report {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

// 页面标题
.page-header {
  margin-bottom: 20px;

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #909399;

    .breadcrumb-separator {
      margin: 0 8px;
      font-size: 12px;
    }
  }

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

// 筛选区域
.filter-section {
  .filter-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
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

// 工作时长样式
.duration-tag {
  color: #67c23a;
  font-weight: 500;
}

.duration-empty {
  color: #909399;
  font-style: italic;
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
  .operator-attendance-report {
    padding: 12px;
  }

  .modern-table {
    overflow-x: auto;
  }
}
</style>
