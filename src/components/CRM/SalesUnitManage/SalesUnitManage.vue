<!--
  销售单元信息管理 - 主页面
  @description 销售单元信息管理的增删改查管理页面，支持无审核增改查、判重、CRM联动、区县级联
  @version 2.0.0
-->
<template>
  <div class="sales-unit-manage-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-title">
        <el-icon size="24" color="#1a5fb4"><OfficeBuilding /></el-icon>
        <span>销售单元信息管理</span>
      </div>
      <div class="header-tip">
        <el-icon size="14" color="#e6a23c"><Warning /></el-icon>
        <span>根据号百要求，该页面进行行业改造，请注意行业选择</span>
      </div>
    </div>

    <!-- 查询筛选区 -->
    <div class="query-section">
      <div class="query-item">
        <span class="query-label">关键词：</span>
        <el-input
          v-model="queryForm.keyword"
          placeholder="请输入关键字名称"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="query-item">
        <span class="query-label">所属地区：</span>
        <el-cascader
          v-model="regionCascaderValue"
          :options="regionCascaderOptions"
          :props="{ value: 'value', label: 'label', children: 'children', checkStrictly: true }"
          placeholder="请选择所属地区"
          clearable
          class="region-cascader"
          @change="handleRegionChange"
        />
      </div>
      <div class="query-item">
        <span class="query-label">审核状态：</span>
        <el-select
          v-model="queryForm.auditStatus"
          placeholder="请选择审核状态"
          clearable
          class="status-select"
        >
          <el-option
            v-for="item in auditStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary" :loading="loading" @click="handleSearch">
        查询
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 列表操作区 -->
    <div class="operation-section">
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        新增销售单元
      </el-button>
      <el-button
        v-if="permission.isAdmin && selectedIds.length > 0"
        type="danger"
        :icon="Delete"
        @click="handleBatchDelete"
      >
        批量删除({{ selectedIds.length }})
      </el-button>
    </div>

    <!-- 表格展示区 -->
    <div class="table-section">
      <el-table
        ref="tableRef"
        :data="salesUnitList"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="sales-unit-table"
      >
        <!-- 选择列（管理员显示） -->
        <el-table-column
          v-if="permission.isAdmin"
          type="selection"
          width="50"
          align="center"
        />

        <!-- 所属地区（市级） -->
        <el-table-column
          prop="regionName"
          label="所属地区"
          min-width="90"
          align="center"
        />

        <!-- 所属区县 -->
        <el-table-column
          prop="districtName"
          label="所属区县"
          min-width="90"
          align="center"
        />

        <!-- 所属行业 -->
        <el-table-column
          prop="industryName"
          label="所属行业"
          min-width="80"
          align="center"
        />

        <!-- 所属关键字 -->
        <el-table-column
          prop="keyword"
          label="所属关键字"
          min-width="110"
          show-overflow-tooltip
        />

        <!-- 排序模式 -->
        <el-table-column
          prop="sortMode"
          label="排序模式"
          min-width="90"
          align="center"
        />

        <!-- 最大销售数量 -->
        <el-table-column
          prop="maxSalesCount"
          label="最大数量"
          min-width="80"
          align="center"
        />

        <!-- 建议售价 -->
        <el-table-column
          prop="suggestedPrice"
          label="建议售价"
          min-width="90"
          align="center"
        >
          <template #default="{ row }">
            <span>¥{{ row.suggestedPrice }}</span>
          </template>
        </el-table-column>

        <!-- 审核状态 -->
        <el-table-column
          prop="auditStatus"
          label="审核状态"
          min-width="90"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getAuditStatusType(row.auditStatus)"
              size="small"
            >
              {{ getAuditStatusLabel(row.auditStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="150"
          align="center"
        />

        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="permission.isAdmin || row.creatorId === permission.userId"
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && salesUnitList.length === 0"
        description="暂无数据"
        class="empty-state"
      />
    </div>

    <!-- 分页控制区 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        background
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <SalesUnitFormDialog
      v-model="dialogVisible"
      :type="dialogType"
      :data="currentRow"
      @submit="handleFormSubmit"
      @closed="handleDialogClosed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, OfficeBuilding, Warning } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import SalesUnitFormDialog from './components/SalesUnitFormDialog.vue'
import type {
  SalesUnitItem,
  SalesUnitQueryParams,
  SalesUnitFormData,
  PermissionConfig
} from './types/salesUnitManage'
import { AuditStatusEnum, AuditStatusLabels, AuditStatusColors } from './types/salesUnitManage'
import {
  getSalesUnitList,
  addSalesUnit,
  updateSalesUnit,
  deleteSalesUnit,
  batchDeleteSalesUnit,
  currentUserPermission,
  adminPermission,
  logOperation,
  regionConfigs
} from './mock/salesUnitManageMock'
import { crmStore } from '../store/crmStore'

// ==================== Props ====================
interface Props {
  permission?: PermissionConfig
}

const props = withDefaults(defineProps<Props>(), {
  permission: () => adminPermission
})

// ==================== 响应式数据 ====================
const tableRef = ref<TableInstance>()
const loading = ref(false)
const salesUnitList = ref<SalesUnitItem[]>([])
const selectedIds = ref<string[]>([])
const selectedRows = ref<SalesUnitItem[]>([])

// 查询表单
const queryForm = reactive<SalesUnitQueryParams>({
  keyword: '',
  region: undefined,
  district: undefined,
  auditStatus: undefined,
  page: 1,
  pageSize: 10
})

// 地区级联选择值
const regionCascaderValue = ref<string[]>([])

// 分页信息
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 弹窗状态
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentRow = ref<SalesUnitFormData>({
  region: '' as any,
  district: '',
  industry: '' as any,
  keyword: '',
  sortMode: '固定排名' as any,
  maxSalesCount: 1,
  suggestedPrice: 0
})

// 级联地区选项
const regionCascaderOptions = regionConfigs

// 审核状态下拉选项
const auditStatusOptions = [
  { value: AuditStatusEnum.PENDING, label: '待审核' },
  { value: AuditStatusEnum.APPROVED, label: '已通过' },
  { value: AuditStatusEnum.REJECTED, label: '已驳回' }
]

// ==================== 方法 ====================

/**
 * 获取审核状态标签
 */
const getAuditStatusLabel = (status?: AuditStatusEnum) => {
  if (!status) return '-'
  return AuditStatusLabels[status] || status
}

/**
 * 获取审核状态颜色
 */
const getAuditStatusType = (status?: AuditStatusEnum): any => {
  if (!status) return 'info'
  return AuditStatusColors[status] || 'info'
}

/**
 * 处理地区级联变化
 */
const handleRegionChange = (value: string[]) => {
  if (value && value.length > 0) {
    queryForm.region = value[0] as any
    if (value.length > 1) {
      queryForm.district = value[1]
    } else {
      queryForm.district = undefined
    }
  } else {
    queryForm.region = undefined
    queryForm.district = undefined
  }
  handleSearch()
}

/**
 * 加载销售单元列表
 */
const loadSalesUnitList = async () => {
  loading.value = true
  try {
    const res = await getSalesUnitList(queryForm, props.permission)
    if (res.success) {
      salesUnitList.value = res.data.list
      pagination.total = res.data.total
      pagination.page = res.data.page
      pagination.pageSize = res.data.pageSize
      // 同步到全局store
      crmStore.setSalesUnitList(salesUnitList.value)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  queryForm.page = 1
  loadSalesUnitList()
}

/**
 * 处理重置
 */
const handleReset = () => {
  queryForm.keyword = ''
  queryForm.region = undefined
  queryForm.district = undefined
  queryForm.auditStatus = undefined
  queryForm.page = 1
  regionCascaderValue.value = []
  loadSalesUnitList()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  dialogType.value = 'add'
  currentRow.value = {
    region: '' as any,
    district: '',
    industry: '' as any,
    keyword: '',
    sortMode: '固定排名' as any,
    maxSalesCount: 1,
    suggestedPrice: 0
  }
  dialogVisible.value = true
  logOperation('click', '打开新增销售单元弹窗')
}

/**
 * 处理编辑
 */
const handleEdit = (row: SalesUnitItem) => {
  dialogType.value = 'edit'
  currentRow.value = {
    id: row.id,
    region: row.region,
    district: row.district,
    industry: row.industry,
    keyword: row.keyword,
    sortMode: row.sortMode,
    maxSalesCount: row.maxSalesCount,
    suggestedPrice: row.suggestedPrice
  }
  dialogVisible.value = true
  logOperation('click', `打开编辑销售单元弹窗: ${row.keyword}`)
}

/**
 * 处理删除
 */
const handleDelete = async (row: SalesUnitItem) => {
  try {
    await ElMessageBox.confirm(
      '确认删除该销售单元？删除后不可恢复',
      '删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteSalesUnit(row.id, props.permission)
    if (res.success) {
      ElMessage.success('删除成功')
      loadSalesUnitList()
      logOperation('delete', `删除销售单元: ${row.keyword}`)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    // 用户取消删除
  }
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 个销售单元？删除后不可恢复`,
      '批量删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await batchDeleteSalesUnit(selectedIds.value, props.permission)
    if (res.success) {
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      selectedRows.value = []
      loadSalesUnitList()
      logOperation('batch_delete', `批量删除销售单元: ${selectedIds.value.length}个`)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    // 用户取消删除
  }
}

/**
 * 处理表单提交
 */
const handleFormSubmit = async (data: SalesUnitFormData, continueAdd: boolean) => {
  try {
    let res
    if (dialogType.value === 'add') {
      res = await addSalesUnit(data, props.permission)
      if (res.success) {
        ElMessage.success('新增成功，等待审核')
        logOperation('add', `新增销售单元: ${data.keyword}`)
      }
    } else {
      res = await updateSalesUnit(data, props.permission)
      if (res.success) {
        ElMessage.success('编辑成功，等待审核')
        logOperation('update', `编辑销售单元: ${data.keyword}`)
      }
    }

    if (res.success) {
      loadSalesUnitList()
      if (!continueAdd) {
        dialogVisible.value = false
      }
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

/**
 * 处理弹窗关闭
 */
const handleDialogClosed = () => {
  currentRow.value = {
    region: '' as any,
    district: '',
    industry: '' as any,
    keyword: '',
    sortMode: '固定排名' as any,
    maxSalesCount: 1,
    suggestedPrice: 0
  }
}

/**
 * 处理选择变化
 */
const handleSelectionChange = (selection: SalesUnitItem[]) => {
  selectedRows.value = selection
  selectedIds.value = selection.map(item => item.id)
}

/**
 * 处理页码变化
 */
const handlePageChange = (page: number) => {
  queryForm.page = page
  loadSalesUnitList()
}

/**
 * 处理每页条数变化
 */
const handleSizeChange = () => {
  queryForm.pageSize = pagination.pageSize
  queryForm.page = 1
  loadSalesUnitList()
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadSalesUnitList()
})
</script>

<style scoped lang="scss">
.sales-unit-manage-page {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

// 页面标题
.page-header {
  margin-bottom: 20px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .header-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #e6a23c;
    padding: 8px 12px;
    background: #fdf6ec;
    border-radius: 4px;
    border-left: 3px solid #e6a23c;
  }
}

// 查询筛选区
.query-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  .query-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .query-label {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
    }
  }

  .search-input {
    width: 180px;
  }

  .region-cascader {
    width: 220px;
  }

  .status-select {
    width: 140px;
  }
}

// 列表操作区
.operation-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

// 表格展示区
.table-section {
  margin-bottom: 16px;

  .sales-unit-table {
    width: 100%;

    :deep(.el-table__header) {
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
        font-size: 13px;
      }
    }

    :deep(.el-table__row) {
      td {
        font-size: 13px;
      }
    }
  }

  .empty-state {
    padding: 40px 0;
  }
}

// 分页控制区
.pagination-section {
  display: flex;
  justify-content: flex-end;
}
</style>
