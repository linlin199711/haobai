<template>
  <div class="keyword-query-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">关键词查询量及资源统计报表</h2>
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
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="地市">
              <el-select
                v-model="filterForm.city"
                placeholder="请选择地市"
                clearable
                style="width: 100%"
                @change="handleCityChange"
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

          <!-- 区县 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="区县">
              <el-select
                v-model="filterForm.district"
                placeholder="请选择区县"
                clearable
                :disabled="!filterForm.city"
                style="width: 100%"
              >
                <el-option
                  v-for="district in districtList"
                  :key="district"
                  :label="district"
                  :value="district"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 关键词 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="关键词">
              <el-input
                v-model="filterForm.keyword"
                placeholder="请输入关键词"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>

          <!-- 客户名称 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="客户名称">
              <el-input
                v-model="filterForm.customerName"
                placeholder="请输入客户名称"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 按钮区 -->
        <el-row :gutter="20">
          <el-col :span="24" class="button-col">
            <el-form-item label-width="0" class="button-form-item">
              <div class="button-group">
                <el-button @click="handleReset">重置</el-button>
                <el-button type="primary" :loading="loading" @click="handleSearch">
                  查询
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
        show-summary
        :summary-method="getSummaries"
      >
        <!-- 序号 -->
        <el-table-column
          type="index"
          label="序号"
          width="70"
          align="center"
          :index="indexMethod"
        />

        <!-- 地市 -->
        <el-table-column
          prop="city"
          label="地市"
          min-width="100"
          align="center"
        />

        <!-- 区县 -->
        <el-table-column
          prop="district"
          label="区县"
          min-width="100"
          align="center"
        />

        <!-- 关键词 -->
        <el-table-column
          prop="keyword"
          label="关键词"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />

        <!-- 行业 -->
        <el-table-column
          prop="industry"
          label="行业"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-tag size="small" effect="light" class="industry-tag">
              {{ row.industry }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 最大销售数量 -->
        <el-table-column
          prop="maxSalesCount"
          label="最大销售数量"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ formatNumber(row.maxSalesCount) }}
          </template>
        </el-table-column>

        <!-- 已销售数量 -->
        <el-table-column
          prop="soldCount"
          label="已销售数量"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ formatNumber(row.soldCount) }}
          </template>
        </el-table-column>

        <!-- 未销售数量 -->
        <el-table-column
          prop="unsoldCount"
          label="未销售数量"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span class="highlight-number">{{ formatNumber(row.unsoldCount) }}</span>
          </template>
        </el-table-column>

        <!-- 查询次数 -->
        <el-table-column
          prop="queryCount"
          label="查询次数"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ formatNumber(row.queryCount) }}
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

    <!-- 页面说明抽屉 -->
    <PageInstructionDrawer
      v-model="showPageInstruction"
      :page-id="'keyword-query-report'"
      :page-title="'关键词查询量及资源统计报表'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { PageInstructionDrawer } from '../../PageInstruction'
import type { FilterForm, CalculatedKeywordItem } from './types/keywordQueryReport'
import { cityDistrictMap, cityList as allCities } from './mock/keywordQueryMock'
import { fetchKeywordQueryData } from './mock/keywordQueryMock'
import { calculateKeywordData } from './utils/calculator'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：时间范围、地市、关键词、客户名称 顺序严格对齐原型
 */
const filterForm = reactive<FilterForm>({
  dateRange: [],
  city: '',
  district: '',
  keyword: '',
  customerName: ''
})

// 地市列表
const cityList = computed(() => allCities)

// 区县列表（根据地市联动）
const districtList = computed(() => {
  if (!filterForm.city) return []
  return cityDistrictMap[filterForm.city] || []
})

/**
 * 地市变更处理
 * 筛选联动规则：选中地市自动加载对应区县，清空已选区县
 */
const handleCityChange = (val: string) => {
  filterForm.district = ''
}

// ==================== 数据加载 ====================// 数据加载
const loading = ref(false)
const allData = ref<CalculatedKeywordItem[]>([])
const emptyText = ref('暂无关键字查询及资源统计数据')

// 页面说明抽屉
const showPageInstruction = ref(false)

/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据，自动计算未销售数量
 */
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取原始数据
    const rawData = await fetchKeywordQueryData(filterForm)

    // 自动计算未销售数量
    allData.value = calculateKeywordData(rawData)

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
 * 序号计算方法
 * 规范数字展示：根据当前页码计算真实序号
 */
const indexMethod = (index: number) => {
  return (pagination.page - 1) * pagination.pageSize + index + 1
}

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
 * 业务逻辑：一键还原所有筛选项初始状态
 */
const handleReset = () => {
  filterForm.dateRange = []
  filterForm.city = ''
  filterForm.district = ''
  filterForm.keyword = ''
  filterForm.customerName = ''

  // 重新加载数据
  loadData()
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

/**
 * 表格合计行计算
 * 仅合计：最大销售数量、已售数量、未售数量、查询次数
 */
const getSummaries = (param: { columns: any[], data: any[] }) => {
  const { columns, data } = param
  const sums: (string | number)[] = []

  columns.forEach((column, index) => {
    // 序号列显示"合计"
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    // 只合计特定字段
    const sumFields = ['maxSalesCount', 'soldCount', 'unsoldCount', 'queryCount']
    if (sumFields.includes(column.property)) {
      const values = data.map(item => Number(item[column.property]) || 0)
      const sum = values.reduce((prev, curr) => prev + curr, 0)
      sums[index] = formatNumber(sum)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 页面加载时自动查询数据
  loadData()
})
</script>

<style scoped lang="scss">
.keyword-query-report {
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

  .button-col {
    display: flex;
    justify-content: flex-end;
  }

  .button-form-item {
    margin-bottom: 0;
    width: 100%;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    width: 100%;
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

// 高亮数字样式
.highlight-number {
  color: #409eff;
  font-weight: 500;
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
@media (max-width: 768px) {
  .keyword-query-report {
    padding: 12px;
  }

  .filter-form {
    .button-group {
      justify-content: flex-start;
      margin-top: 8px;
    }
  }

  .pagination-wrapper {
    justify-content: center;
  }
}
</style>
