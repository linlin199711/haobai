<!--
  优推商家查询量报表
  @description 记录用户进线查询的业务关键字，展示对应播报号码信息
  @version 1.0.0
-->
<template>
  <div class="merchant-query-report-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">优推商家查询量报表</h2>
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

          <!-- 播报号码 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="播报号码">
              <el-input
                v-model="filterForm.broadcastNumber"
                placeholder="请输入播报号码"
                clearable
                @keyup.enter="handleSearch"
              />
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
            <el-button type="success" :loading="exporting" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="table-header">
          <div class="header-left">
            <el-icon><List /></el-icon>
            <span class="table-title">查询结果列表</span>
          </div>
          <el-tag type="info" v-if="reportData.length > 0">共 {{ reportData.length }} 条记录</el-tag>
        </div>
      </template>

      <el-table
        :data="displayData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="headerCellStyle"
      >
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />

        <!-- 地市 -->
        <el-table-column prop="city" label="地市" width="90" align="center" />

        <!-- 区县 -->
        <el-table-column prop="district" label="区县" width="90" align="center" />

        <!-- 所有关键词 -->
        <el-table-column label="所有关键词" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="keyword-tags">
              <el-tag
                v-for="(keyword, index) in row.allKeywords"
                :key="index"
                size="small"
                type="info"
                class="keyword-tag"
              >
                {{ keyword }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- 销售区域 -->
        <el-table-column prop="salesRegion" label="销售区域" width="90" align="center" />

        <!-- 行业 -->
        <el-table-column prop="industry" label="行业" width="100" align="center" />

        <!-- 单位名称 -->
        <el-table-column prop="companyName" label="单位名称" min-width="200" show-overflow-tooltip />

        <!-- 播报号码 -->
        <el-table-column prop="broadcastNumber" label="播报号码" width="130" align="center" />

        <!-- 业务号码 -->
        <el-table-column prop="businessNumber" label="业务号码" width="130" align="center" />

        <!-- 被查关键词 -->
        <el-table-column prop="queriedKeyword" label="被查关键词" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="warning" size="small" effect="dark">
              {{ row.queriedKeyword }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 开通日期 -->
        <el-table-column prop="openDate" label="开通日期" width="110" align="center" />

        <!-- 被查询次数 -->
        <el-table-column prop="queryCount" label="被查询次数" width="100" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.queryCount) }}
          </template>
        </el-table-column>

        <!-- 关键词查询次数 -->
        <el-table-column prop="keywordQueryCount" label="关键词查询次数" width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.keywordQueryCount) }}
          </template>
        </el-table-column>

        <!-- 模糊查询次数 -->
        <el-table-column prop="fuzzyQueryCount" label="模糊查询次数" width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.fuzzyQueryCount) }}
          </template>
        </el-table-column>

        <!-- 转接次数 -->
        <el-table-column prop="transferCount" label="转接次数" width="90" align="center" />

        <!-- 转接成功次数 -->
        <el-table-column prop="transferSuccessCount" label="转接成功次数" width="110" align="center" />

        <!-- 转接成功率 -->
        <el-table-column label="转接成功率" width="110" align="center" fixed="right">
          <template #default="{ row }">
            <span
              class="success-rate"
              :class="{ 'high-rate': row.transferSuccessRate && row.transferSuccessRate >= 90 }"
            >
              {{ formatPercentage(row.transferSuccessRate) }}
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
      <el-empty v-if="reportData.length === 0 && !loading" description="暂无查询数据" />
    </el-card>

    <!-- 页面说明抽屉 -->
    <PageInstructionDrawer
      v-model="showPageInstruction"
      :page-id="'merchant-query-report'"
      :page-title="'优推商家查询量报表'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Filter, RefreshRight, Search, Download, List, QuestionFilled } from '@element-plus/icons-vue'
import { PageInstructionDrawer } from '../../PageInstruction'

import type { FilterForm, MerchantQueryItem, CalculatedMerchantItem } from './types/merchantQueryReport'
import {
  getMerchantQueryData,
  getCityList,
  getDistrictList
} from './mock/merchantQueryMock'
import { calculateMerchantItem, formatPercentage, formatNumber } from './utils/calculator'
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
  city: '',
  district: '',
  keyword: '',
  merchantName: '',
  broadcastNumber: ''
})

// 数据列表
const reportData = ref<MerchantQueryItem[]>([])
const cityList = ref<string[]>([])
const districtList = ref<string[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 页面说明抽屉
const showPageInstruction = ref(false)

// ==================== 计算属性 ====================

/**
 * 计算后的报表数据
 */
const calculatedData = computed<CalculatedMerchantItem[]>(() => {
  return reportData.value.map(item => calculateMerchantItem(item))
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
 * 初始化默认时间范围（近7天）
 */
const initDefaultTimeRange = () => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  filterForm.dateRange = [
    start.toISOString().slice(0, 19).replace('T', ' '),
    end.toISOString().slice(0, 19).replace('T', ' ')
  ]
}

/**
 * 地市改变处理
 */
const handleCityChange = (city: string) => {
  filterForm.district = ''
  districtList.value = getDistrictList(city)
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
      city: filterForm.city,
      district: filterForm.district,
      keyword: filterForm.keyword,
      merchantName: filterForm.merchantName,
      broadcastNumber: filterForm.broadcastNumber
    }

    const result = await getMerchantQueryData(params)
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
  currentPage.value = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  filterForm.city = ''
  filterForm.district = ''
  filterForm.keyword = ''
  filterForm.merchantName = ''
  filterForm.broadcastNumber = ''
  districtList.value = []
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
 * 表头样式
 */
const headerCellStyle = () => {
  return {
    background: '#f5f7fa',
    color: '#1f2937',
    fontWeight: '600',
    fontSize: '13px'
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  cityList.value = getCityList()
  initDefaultTimeRange()
  loadData()
})
</script>

<style scoped lang="scss">
.merchant-query-report-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100%;
}

// 页面标题
.page-header {
  margin-bottom: 20px;

  .page-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
}

// 筛选卡片
.filter-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #1f2937;

    .el-icon {
      font-size: 16px;
      color: #409eff;
    }
  }
}

.filter-form {
  .filter-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
  }
}

// 表格卡片
.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #1f2937;

      .el-icon {
        font-size: 16px;
        color: #409eff;
      }
    }

    .table-title {
      font-size: 16px;
    }
  }
}

// 关键词标签
.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  .keyword-tag {
    margin: 0;
  }
}

// 成功率样式
.success-rate {
  font-weight: 600;
  color: #409eff;

  &.high-rate {
    color: #67c23a;
  }
}

// 分页样式
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0;
  margin-top: 16px;
  border-top: 1px solid #ebeef5;
}

// 表格样式
:deep(.el-table) {
  font-size: 13px;

  .el-table__cell {
    padding: 8px 0;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .merchant-query-report-page {
    padding: 16px;
  }

  .filter-form {
    .filter-buttons {
      justify-content: flex-start;
    }
  }

  .pagination-wrapper {
    justify-content: center;
  }
}
</style>
