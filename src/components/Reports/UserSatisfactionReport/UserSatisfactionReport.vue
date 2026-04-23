<template>
  <div class="user-satisfaction-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">用户满意度报表</h2>
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
            v-model="filterForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 400px"
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

        <!-- 话务查询方式 -->
        <el-form-item label="话务查询方式">
          <el-select
            v-model="filterForm.callQueryMethod"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="option in callQueryMethodOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 班组 -->
        <el-form-item label="班组">
          <el-select
            v-model="filterForm.team"
            placeholder="请选择"
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

        <!-- 按钮区 -->
        <el-form-item label-width="0" class="button-form-item">
          <div class="button-group">
            <el-button type="success" @click="handleExport">
              导出数据
            </el-button>
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
        <!-- 序号 -->
        <el-table-column
          prop="index"
          label="序号"
          min-width="60"
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

        <!-- 主叫号 -->
        <el-table-column
          prop="callerNumber"
          label="主叫号"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ maskPhoneNumber(row.callerNumber) }}</span>
          </template>
        </el-table-column>

        <!-- 呼叫时间 -->
        <el-table-column
          prop="callTime"
          label="呼叫时间"
          min-width="160"
          align="center"
        />

        <!-- 用户评价 -->
        <el-table-column
          prop="evaluation"
          label="用户评价"
          min-width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getEvaluationType(row.evaluation)" size="small">
              {{ row.evaluationText }}
            </el-tag>
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
      :page-id="'user-satisfaction-report'"
      :page-title="'用户满意度报表'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { PageInstructionDrawer } from '../../PageInstruction'
import * as XLSX from 'xlsx'
import type { FilterForm, UserSatisfactionItem, ReportQueryParams, UserEvaluation } from './types/userSatisfactionReport'
import { 
  isRealTimeOptions, 
  combinationModeOptions, 
  callQueryMethodOptions, 
  teamList, 
  maskPhoneNumber, 
  evaluationColor, 
  fetchUserSatisfactionData 
} from './mock/userSatisfactionMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：是否实时、带时分秒起止时间范围、组合方式、话务查询方式、班组 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  isRealTime: 'all',
  timeRange: [],
  combinationMode: 'day',
  callQueryMethod: 'all',
  team: '全部班组'
})

// ==================== 数据加载 ====================
const loading = ref(false)
const tableData = ref<UserSatisfactionItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const emptyText = ref('暂无用户满意度统计明细数据')

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
      isRealTime: filterForm.isRealTime,
      startTime: filterForm.timeRange?.[0],
      endTime: filterForm.timeRange?.[1],
      combinationMode: filterForm.combinationMode,
      callQueryMethod: filterForm.callQueryMethod,
      team: filterForm.team
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchUserSatisfactionData(params)
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

// ==================== 辅助函数 ====================
/**
 * 获取评价类型对应的标签类型
 */
const getEvaluationType = (evaluation: UserEvaluation): string => {
  switch (evaluation) {
    case 'verySatisfied':
      return 'success'
    case 'satisfied':
      return 'primary'
    case 'average':
      return 'warning'
    case 'unsatisfied':
      return 'danger'
    default:
      return 'info'
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
  filterForm.isRealTime = 'all'
  filterForm.timeRange = []
  filterForm.combinationMode = 'day'
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
    '序号': item.index,
    '工号': item.employeeId,
    '姓名': item.employeeName,
    '主叫号': maskPhoneNumber(item.callerNumber),
    '呼叫时间': item.callTime,
    '用户评价': item.evaluationText
  }))

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 6 },  // 序号
    { wch: 8 },  // 工号
    { wch: 8 },  // 姓名
    { wch: 12 }, // 主叫号
    { wch: 16 }, // 呼叫时间
    { wch: 10 }  // 用户评价
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '用户满意度报表')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `用户满意度报表_${dateStr}.xlsx`

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
.user-satisfaction-report {
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
  .user-satisfaction-report {
    padding: 12px;
  }

  .filter-form {
    .el-date-picker {
      width: 100% !important;
    }
  }

  .modern-table {
    overflow-x: auto;
  }
}
</style>
