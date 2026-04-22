/**
 * 非号码信息管理页面
 * @description 非号码信息查询、管理模块，支撑公交路线查询、公交集团号码信息查看业务
 * @version 1.0.0
 */

<template>
  <div class="non-number-info-manage">
    <!-- 查询筛选区 -->
    <div class="search-area">
      <el-form :model="queryForm" inline class="search-form">
        <el-row :gutter="16">
          <!-- 信息标题 -->
          <el-col :span="6">
            <el-form-item label="信息标题">
              <el-input
                v-model="queryForm.infoTitle"
                placeholder="请输入"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>

          <!-- 审核状态 -->
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select
                v-model="queryForm.auditStatus"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in auditStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 信息来源 -->
          <el-col :span="6">
            <el-form-item label="信息来源">
              <el-select
                v-model="queryForm.infoSource"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in infoSourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 信息精度 -->
          <el-col :span="6">
            <el-form-item label="信息精度">
              <el-select
                v-model="queryForm.infoPrecision"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in infoPrecisionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="second-row">
          <!-- 查询类型 -->
          <el-col :span="6">
            <el-form-item label="查询类型">
              <el-select
                v-model="queryForm.queryType"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in queryTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 查询模式 -->
          <el-col :span="6">
            <el-form-item label="查询模式">
              <el-select
                v-model="queryForm.queryMode"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in queryModeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 行业选择 -->
          <el-col :span="6">
            <el-form-item label="行业选择">
              <el-select
                v-model="queryForm.industryType"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in industryTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 信息类型 -->
          <el-col :span="6">
            <el-form-item label="信息类型">
              <el-select
                v-model="queryForm.infoType"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in infoTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="third-row">
          <!-- 采编时间 -->
          <el-col :span="8">
            <el-form-item label="采编时间">
              <el-date-picker
                v-model="collectTimeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @change="handleCollectTimeChange"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 地区选择 -->
          <el-col :span="10">
            <el-form-item label="地区选择">
              <div class="region-select-wrapper">
                <el-cascader
                  v-model="regionValue"
                  :options="regionOptions"
                  :props="regionProps"
                  placeholder="请选择地区"
                  clearable
                  style="width: 220px"
                  @change="handleRegionChange"
                />
                <el-checkbox
                  v-model="queryForm.includeSubordinate"
                  class="subordinate-checkbox"
                >
                  包含下属地区
                </el-checkbox>
              </div>
            </el-form-item>
          </el-col>

          <!-- 有效时间 -->
          <el-col :span="6">
            <el-form-item label="有效时间">
              <el-date-picker
                v-model="validTimeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @change="handleValidTimeChange"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 查询按钮 -->
        <el-row class="btn-row">
          <el-col :span="24" class="btn-col">
            <el-button type="primary" :loading="loading" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询(Q)
            </el-button>
            <el-button @click="handleReset">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 列表展示区 -->
    <div class="table-area">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column
          prop="infoTitle"
          label="信息标题"
          min-width="200"
          show-overflow-tooltip
          sortable="custom"
        />

        <el-table-column
          prop="infoSource"
          label="信息来源"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            {{ getInfoSourceLabel(row.infoSource) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="industryType"
          label="行业名称"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            {{ getIndustryTypeLabel(row.industryType) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="collectTime"
          label="采编时间"
          width="160"
          align="center"
          sortable="custom"
        />

        <el-table-column
          prop="validStartTime"
          label="开始时间"
          width="100"
          align="center"
        />

        <el-table-column
          prop="validEndTime"
          label="结束时间"
          width="100"
          align="center"
        />

        <el-table-column label="地区" width="120" align="center">
          <template #default="{ row }">
            {{ getRegionLabel(row.region) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="danger"
              class="detail-btn"
              @click.stop="handleViewDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="tableData.length === 0 && !loading"
        description="暂无符合条件的非号码信息"
        class="empty-state"
      >
        <template #image>
          <el-icon :size="60" color="#c0c4cc"><Document /></el-icon>
        </template>
      </el-empty>
    </div>

    <!-- 分页控制 -->
    <div class="pagination-area">
      <el-pagination
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 详情弹窗 -->
    <NonNumberInfoDetailDialog
      v-model="detailDialogVisible"
      :data="currentRow"
      @close="detailDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshRight, Document } from '@element-plus/icons-vue'
import NonNumberInfoDetailDialog from './components/NonNumberInfoDetailDialog.vue'
import type {
  NonNumberInfo,
  NonNumberInfoQueryParams,
  AuditStatusOption,
  InfoSourceOption,
  InfoPrecisionOption,
  QueryTypeOption,
  QueryModeOption,
  IndustryTypeOption,
  InfoTypeOption
} from './types/nonNumberInfo'
import {
  queryNonNumberInfoList,
  getOptionData,
  auditStatusOptions,
  infoSourceOptions,
  infoPrecisionOptions,
  queryTypeOptions,
  queryModeOptions,
  industryTypeOptions,
  infoTypeOptions,
  provinceOptions,
  cityOptions,
  districtOptions
} from './mock/nonNumberInfoMock'

// ==================== 查询表单 ====================
const queryForm = reactive<NonNumberInfoQueryParams>({
  infoTitle: '',
  auditStatus: 'approved',
  infoSource: '',
  infoPrecision: '',
  queryType: '',
  queryMode: '',
  industryType: '',
  infoType: '',
  collectTimeStart: '',
  collectTimeEnd: '',
  validTimeStart: '',
  validTimeEnd: '',
  province: '350000',
  city: '350500',
  district: '',
  includeSubordinate: true,
  page: 1,
  pageSize: 10,
  sortField: 'collectTime',
  sortOrder: 'desc'
})

// ==================== 时间范围选择器 ====================
const collectTimeRange = ref<[string, string] | null>(null)
const validTimeRange = ref<[string, string] | null>(null)

// ==================== 地区级联选择 ====================
const regionValue = ref<string[]>(['350000', '350500'])

// 构建地区级联选项
const regionOptions = computed(() => {
  return provinceOptions.map(province => ({
    value: province.value,
    label: province.label,
    children: cityOptions
      .filter(city => city.provinceCode === province.value)
      .map(city => ({
        value: city.value,
        label: city.label,
        children: districtOptions
          .filter(district => district.cityCode === city.value)
          .map(district => ({
            value: district.value,
            label: district.label
          }))
      }))
  }))
})

const regionProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  expandTrigger: 'hover' as const
}

// ==================== 列表数据 ====================
const tableData = ref<NonNumberInfo[]>([])
const total = ref(0)
const loading = ref(false)

// ==================== 详情弹窗 ====================
const detailDialogVisible = ref(false)
const currentRow = ref<NonNumberInfo | null>(null)

// ==================== 初始化 ====================
onMounted(() => {
  fetchData()
})

// ==================== 数据获取 ====================
const fetchData = async () => {
  loading.value = true
  try {
    const res = await queryNonNumberInfoList({ ...queryForm })
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 查询操作 ====================
const handleSearch = () => {
  queryForm.page = 1
  fetchData()
}

const handleReset = () => {
  // 重置表单
  queryForm.infoTitle = ''
  queryForm.auditStatus = 'approved'
  queryForm.infoSource = ''
  queryForm.infoPrecision = ''
  queryForm.queryType = ''
  queryForm.queryMode = ''
  queryForm.industryType = ''
  queryForm.infoType = ''
  queryForm.collectTimeStart = ''
  queryForm.collectTimeEnd = ''
  queryForm.validTimeStart = ''
  queryForm.validTimeEnd = ''
  queryForm.province = '350000'
  queryForm.city = '350500'
  queryForm.district = ''
  queryForm.includeSubordinate = true
  queryForm.page = 1
  queryForm.pageSize = 10
  queryForm.sortField = 'collectTime'
  queryForm.sortOrder = 'desc'

  // 重置时间范围选择器
  collectTimeRange.value = null
  validTimeRange.value = null

  // 重置地区选择
  regionValue.value = ['350000', '350500']

  fetchData()
  ElMessage.success('已重置搜索条件')
}

// ==================== 时间范围变化处理 ====================
const handleCollectTimeChange = (val: [string, string] | null) => {
  if (val) {
    queryForm.collectTimeStart = val[0] + ' 00:00:00'
    queryForm.collectTimeEnd = val[1] + ' 23:59:59'
  } else {
    queryForm.collectTimeStart = ''
    queryForm.collectTimeEnd = ''
  }
}

const handleValidTimeChange = (val: [string, string] | null) => {
  if (val) {
    queryForm.validTimeStart = val[0]
    queryForm.validTimeEnd = val[1]
  } else {
    queryForm.validTimeStart = ''
    queryForm.validTimeEnd = ''
  }
}

// ==================== 地区变化处理 ====================
const handleRegionChange = (val: string[]) => {
  if (val && val.length > 0) {
    queryForm.province = val[0]
    queryForm.city = val[1] || ''
    queryForm.district = val[2] || ''
  } else {
    queryForm.province = ''
    queryForm.city = ''
    queryForm.district = ''
  }
}

// ==================== 分页处理 ====================
const handlePageChange = (page: number) => {
  queryForm.page = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  queryForm.pageSize = size
  queryForm.page = 1
  fetchData()
}

// ==================== 排序处理 ====================
const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  if (prop && order) {
    queryForm.sortField = prop
    queryForm.sortOrder = order === 'ascending' ? 'asc' : 'desc'
  } else {
    queryForm.sortField = 'collectTime'
    queryForm.sortOrder = 'desc'
  }
  fetchData()
}

// ==================== 行点击处理 ====================
const handleRowClick = (row: NonNumberInfo) => {
  // 高亮行效果由 el-table 的 highlight-current-row 属性自动处理
  console.log('点击行:', row.infoTitle)
}

// ==================== 查看详情 ====================
const handleViewDetail = (row: NonNumberInfo) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// ==================== 标签转换 ====================
const getInfoSourceLabel = (value: string): string => {
  const item = infoSourceOptions.find(opt => opt.value === value)
  return item?.label || value
}

const getIndustryTypeLabel = (value: string): string => {
  const item = industryTypeOptions.find(opt => opt.value === value)
  return item?.label || value
}

const getRegionLabel = (region: NonNumberInfo['region']): string => {
  const city = cityOptions.find(c => c.value === region.city)
  const district = districtOptions.find(d => d.value === region.district)
  if (district) {
    return `${city?.label || ''} ${district.label}`
  }
  return city?.label || ''
}
</script>

<style scoped lang="scss">
.non-number-info-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  padding: 16px;
}

// 查询筛选区
.search-area {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .search-form {
    .second-row,
    .third-row {
      margin-top: 12px;
    }

    .btn-row {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #e4e7ed;
    }

    .btn-col {
      display: flex;
      justify-content: flex-end;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      width: 100%;
    }

    :deep(.el-form-item__label) {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }
  }

  .region-select-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;

    .subordinate-checkbox {
      white-space: nowrap;
    }
  }
}

// 列表展示区
.table-area {
  flex: 1;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .data-table {
    flex: 1;

    // 高亮行效果
    :deep(.el-table__body tr.current-row > td) {
      background-color: #fdf6ec !important;
    }

    // 查看详情按钮样式
    .detail-btn {
      color: #f56c6c;
      font-size: 14px;

      &:hover {
        color: #ff4d4f;
      }
    }
  }

  .empty-state {
    padding: 40px 0;
  }
}

// 分页控制
.pagination-area {
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  margin-top: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
}
</style>
