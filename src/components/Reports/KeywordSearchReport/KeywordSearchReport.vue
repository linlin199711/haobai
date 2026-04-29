<template>
  <div class="keyword-search-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">话务员输入关键词搜索量统计表</h2>
    </div>

    <!-- 筛选区卡片 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="filterForm"
        label-position="right"
        label-width="80px"
        class="filter-form"
      >
        <!-- 第一行：4个选项卡 -->
        <el-row :gutter="20">
          <!-- 时间范围 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="5">
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

          <!-- 地市 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <el-form-item label="地市">
              <el-select
                v-model="filterForm.city"
                placeholder="请选择地市"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="city in cityList"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 统计周期 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <el-form-item label="统计周期">
              <el-select
                v-model="filterForm.period"
                placeholder="请选择周期"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="period in periodOptions"
                  :key="period.value"
                  :label="period.label"
                  :value="period.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 关键词 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="5">
            <el-form-item label="关键词">
              <el-input
                v-model="filterForm.keyword"
                placeholder="请输入关键词"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行：1个选项卡 + 按钮区 -->
        <el-row :gutter="20">
          <!-- 行业 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <el-form-item label="行业">
              <el-select
                v-model="filterForm.industry"
                placeholder="请选择行业"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="industry in industryList"
                  :key="industry"
                  :label="industry"
                  :value="industry"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 按钮区 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="14">
            <el-form-item label-width="0" class="button-form-item">
              <div class="button-group">
                <el-button type="primary" :loading="loading" @click="handleSearch">
                  查询
                </el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button type="success" @click="handleExport">
                  导出
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据列表区卡片 -->
    <el-card class="table-card" shadow="never">
      <!-- 表格标题 -->
      <div class="table-header">
        <h3 class="table-title">话务员输入关键词搜索量统计表</h3>
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
          min-width="100"
          align="center"
        />

        <!-- 时段 -->
        <el-table-column
          prop="period"
          label="时段"
          min-width="120"
          align="center"
        />

        <!-- 一级行业 -->
        <el-table-column
          prop="industry"
          label="一级行业"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-tag size="small" effect="light" class="industry-tag">
              {{ row.industry }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 关键词 -->
        <el-table-column
          prop="keyword"
          label="关键词"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />

        <!-- 查询量 -->
        <el-table-column
          prop="queryCount"
          label="查询量"
          min-width="100"
          align="right"
          sortable
        >
          <template #default="{ row }">
            {{ formatNumber(row.queryCount) }}
          </template>
        </el-table-column>

        <!-- 播报量 -->
        <el-table-column
          prop="broadcastCount"
          label="播报量"
          min-width="100"
          align="right"
          sortable
        >
          <template #default="{ row }">
            {{ formatNumber(row.broadcastCount) }}
          </template>
        </el-table-column>

        <!-- 是否优推关键词 -->
        <el-table-column
          prop="isPriority"
          label="是否优推关键词"
          min-width="130"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="row.isPriority ? 'success' : 'info'"
              size="small"
              effect="light"
              class="priority-tag"
            >
              {{ row.isPriority ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
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
import type { FilterForm, KeywordSearchItem, ReportQueryParams } from './types/keywordSearchReport'
import { cityList, periodOptions, industryList } from './mock/keywordSearchMock'
import { fetchKeywordSearchData } from './mock/keywordSearchMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：时间范围、地市、统计周期、关键词、行业 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  dateRange: [],
  city: '',
  period: '',
  keyword: '',
  industry: ''
})

// ==================== 数据加载 ====================// 数据加载
const loading = ref(false)
const allData = ref<KeywordSearchItem[]>([])
const emptyText = ref('暂无话务员关键词搜索统计数据')



/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据
 * 数据来源：【号码本地搜】模块话务员手动输入关键词的搜索行为
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      startDate: filterForm.dateRange?.[0],
      endDate: filterForm.dateRange?.[1],
      city: filterForm.city || undefined,
      period: filterForm.period || undefined,
      keyword: filterForm.keyword || undefined,
      industry: filterForm.industry || undefined
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchKeywordSearchData(params)
    allData.value = data

    // 更新分页总数
    pagination.total = allData.value.length

    // 重置到第一页
    pagination.page = 1
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// ==================== 表格数据 ====================
/**
 * 分页配置
 */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

/**
 * 表格数据（分页后）
 */
const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return allData.value.slice(start, end)
})

/**
 * 数字格式化
 * 规范数字展示：千分位分隔
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
 * 业务逻辑：一键清空所有筛选项，恢复全部组件初始默认状态
 */
const handleReset = () => {
  filterForm.dateRange = []
  filterForm.city = ''
  filterForm.period = ''
  filterForm.keyword = ''
  filterForm.industry = ''

  // 重新加载数据
  loadData()
}

/**
 * 导出按钮
 * 业务逻辑：导出筛选后数据为Excel
 */
const handleExport = () => {
  if (allData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 准备导出数据
  const exportData = allData.value.map(item => ({
    '地市': item.city,
    '时段': item.period,
    '一级行业': item.industry,
    '关键词': item.keyword,
    '查询量': item.queryCount,
    '播报量': item.broadcastCount,
    '是否优推关键词': item.isPriority ? '是' : '否'
  }))

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 12 }, // 地市
    { wch: 12 }, // 时段
    { wch: 12 }, // 一级行业
    { wch: 20 }, // 关键词
    { wch: 10 }, // 查询量
    { wch: 10 }, // 播报量
    { wch: 15 }  // 是否优推关键词
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '话务员关键词搜索统计')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `话务员输入关键词搜索量统计表_${dateStr}.xlsx`

  // 下载文件
  XLSX.writeFile(wb, fileName)

  ElMessage.success('导出成功')
}

/**
 * 分页大小变更
 */
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.page = 1
}

/**
 * 页码变更
 */
const handlePageChange = (val: number) => {
  pagination.page = val
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 页面加载时自动查询数据
  loadData()
})
</script>

<style scoped lang="scss">
.keyword-search-report {
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
  .el-form-item {
    margin-bottom: 16px;
  }

  .button-form-item {
    margin-bottom: 0;
    display: flex;
    justify-content: flex-end;
  }

  .button-group {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
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
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;

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
    }
  }

  :deep(.el-table__row) {
    height: 48px;
  }

  :deep(.el-table__empty-block) {
    min-height: 200px;
  }
}

// 行业标签样式
.industry-tag {
  border-radius: 4px;
  font-size: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}

// 优推标签样式
.priority-tag {
  border-radius: 4px;
  font-size: 12px;
  padding: 0 10px;
  height: 24px;
  line-height: 22px;
  min-width: 36px;
}

// 分页样式
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

// 响应式适配
@media (max-width: 1200px) {
  .filter-form {
    .button-group {
      justify-content: flex-start;
      margin-top: 8px;
    }
  }
}

@media (max-width: 768px) {
  .keyword-search-report {
    padding: 12px;
  }

  .button-group {
    flex-wrap: wrap;
  }

  .pagination-wrapper {
    justify-content: center;
  }
}
</style>
