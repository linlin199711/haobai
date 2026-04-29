<template>
  <div class="merchant-call-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">商家报号明细数据报表</h2>
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
        <!-- 第一行筛选条件 -->
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
          <el-col :xs="24" :sm="12" :md="8" :lg="5">
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
          <el-col :xs="24" :sm="12" :md="8" :lg="5">
            <el-form-item label="区县">
              <el-select
                v-model="filterForm.district"
                placeholder="请选择区县"
                clearable
                :disabled="!filterForm.city || filterForm.city === '全部地市'"
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


        </el-row>

        <!-- 第二行筛选条件 -->
        <el-row :gutter="20">
          <!-- 商家名称 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商家名称">
              <el-input
                v-model="filterForm.merchantName"
                placeholder="请输入商家名称"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>

          <!-- 占位，保持布局 -->
          <el-col :xs="24" :sm="12" :md="16" :lg="14">
            <el-form-item label-width="0">
              <span></span>
            </el-form-item>
          </el-col>

          <!-- 按钮区 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="3">
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
          </el-col>
        </el-row>
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
        <!-- 序号 -->
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          :index="indexMethod"
        />

        <!-- 地市 -->
        <el-table-column
          prop="city"
          label="地市"
          min-width="80"
          align="center"
        />

        <!-- 区县 -->
        <el-table-column
          prop="district"
          label="区县"
          min-width="90"
          align="center"
        />

        <!-- 业务类型 -->
        <el-table-column
          prop="businessType"
          label="业务类型"
          min-width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag size="small" effect="light" class="business-tag">
              {{ row.businessType }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 商家名称 -->
        <el-table-column
          prop="merchantName"
          label="商家名称"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />

        <!-- 播报号码 -->
        <el-table-column
          prop="broadcastNumber"
          label="播报号码"
          min-width="130"
          align="center"
        />

        <!-- 主叫用户号码 -->
        <el-table-column
          prop="callerNumber"
          label="主叫用户号码"
          min-width="130"
          align="center"
        >
          <template #default="{ row }">
            <span class="masked-number">{{ maskPhoneNumber(row.callerNumber) }}</span>
          </template>
        </el-table-column>

        <!-- 呼入时间 -->
        <el-table-column
          prop="callTime"
          label="呼入时间"
          min-width="160"
          align="center"
        />

        <!-- 服务时长（秒） -->
        <el-table-column
          prop="serviceDuration"
          label="服务时长（秒）"
          min-width="120"
          align="right"
        >
          <template #default="{ row }">
            <span class="duration-text">{{ row.serviceDuration }}s</span>
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
import type { FilterForm, MerchantCallItem, ReportQueryParams } from './types/merchantCallReport'
import { cityDistrictMap, cityList as allCities } from './mock/merchantCallMock'
import { fetchMerchantCallData } from './mock/merchantCallMock'

// ==================== 筛选表单 ====================
const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 * 布局约束：两行排布，第一行（时间范围、地市、区县），第二行（商家名称、按钮）
 */
const filterForm = reactive<FilterForm>({
  dateRange: [],
  city: '',
  district: '',
  merchantName: ''
})

// 地市列表
const cityList = computed(() => allCities)

// 区县列表（根据地市联动）
const districtList = computed(() => {
  if (!filterForm.city || filterForm.city === '全部地市') return []
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
const allData = ref<MerchantCallItem[]>([])
const emptyText = ref('暂无商家报号明细数据')



/**
 * 加载数据
 * 业务逻辑：从Mock接口获取数据
 */
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: ReportQueryParams = {
      startDate: filterForm.dateRange?.[0],
      endDate: filterForm.dateRange?.[1],
      city: filterForm.city || undefined,
      district: filterForm.district || undefined,
      merchantName: filterForm.merchantName || undefined
    }

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取数据
    const data = await fetchMerchantCallData(params)
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
 * 序号计算方法
 * 规范数字展示：根据当前页码计算真实序号
 */
const indexMethod = (index: number) => {
  return (pagination.page - 1) * pagination.pageSize + index + 1
}

/**
 * 手机号码脱敏处理
 * 隐私保护规则：中间位数用*号隐藏，仅展示首尾号段
 * 例如：13812345678 -> 138****5678
 */
const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
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
  filterForm.district = ''
  filterForm.merchantName = ''

  // 重新加载数据
  loadData()
}

/**
 * 导出按钮
 * 业务逻辑：导出筛选后数据为Excel，号码保持脱敏格式
 */
const handleExport = () => {
  if (allData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 准备导出数据（号码脱敏）
  const exportData = allData.value.map(item => ({
    '序号': item.index,
    '地市': item.city,
    '区县': item.district,
    '业务类型': item.businessType,
    '商家名称': item.merchantName,
    '播报号码': item.broadcastNumber,
    '主叫用户号码': maskPhoneNumber(item.callerNumber),
    '呼入时间': item.callTime,
    '服务时长（秒）': item.serviceDuration
  }))

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)

  // 设置列宽
  const colWidths = [
    { wch: 8 },  // 序号
    { wch: 10 }, // 地市
    { wch: 10 }, // 区县
    { wch: 12 }, // 业务类型
    { wch: 20 }, // 商家名称
    { wch: 15 }, // 播报号码
    { wch: 15 }, // 主叫用户号码
    { wch: 18 }, // 呼入时间
    { wch: 14 }  // 服务时长
  ]
  ws['!cols'] = colWidths

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '商家报号明细')

  // 生成文件名
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `商家报号明细数据报表_${dateStr}.xlsx`

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
.merchant-call-report {
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

// 业务类型标签样式
.business-tag {
  border-radius: 4px;
  font-size: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}

// 脱敏号码样式
.masked-number {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

// 服务时长样式
.duration-text {
  color: #67c23a;
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
@media (max-width: 1200px) {
  .filter-form {
    .button-group {
      margin-top: 8px;
    }
  }
}

@media (max-width: 768px) {
  .merchant-call-report {
    padding: 12px;
  }

  .filter-form {
    .button-group {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }

  .pagination-wrapper {
    justify-content: center;
  }
}
</style>
