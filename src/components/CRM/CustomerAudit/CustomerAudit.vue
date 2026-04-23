<!--
  客户业务信息审核 - 主页面
  @description 客户业务信息审核列表页，支持多条件查询、审核、修改、注销
  @version 1.0.0
-->
<template>
  <div class="customer-audit-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-title">
        <el-icon size="24" color="#1a5fb4"><DocumentChecked /></el-icon>
        <span>客户业务信息审核</span>
      </div>
    </div>

    <!-- 查询筛选区 - 参考客户基础信息页面样式 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="queryForm"
        label-width="100px"
        class="filter-form"
      >
        <el-row :gutter="20">
          <!-- 客户名称 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="客户名称">
              <el-input
                v-model="queryForm.customerName"
                placeholder="请输入客户名称"
                clearable
                maxlength="50"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>

          <!-- 电话号码 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="电话号码">
              <el-input
                v-model="queryForm.phone"
                placeholder="请输入电话号码"
                clearable
                maxlength="20"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>

          <!-- 采编时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="采编时间">
              <el-date-picker
                v-model="queryForm.dateRange"
                type="daterange"
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 行业 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="行业">
              <el-select
                v-model="queryForm.industry"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="交通运输" value="交通运输" />
                <el-option label="制造业" value="制造业" />
                <el-option label="环保科技" value="环保科技" />
                <el-option label="医疗卫生" value="医疗卫生" />
                <el-option label="教育" value="教育" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 地区 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="地区">
              <el-select
                v-model="queryForm.region"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="泉州市" value="泉州市" />
                <el-option label="福州市" value="福州市" />
                <el-option label="厦门市" value="厦门市" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 锁定状态 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="锁定状态">
              <el-select
                v-model="queryForm.lockStatus"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="未锁定" value="unlocked" />
                <el-option label="已锁定" value="locked" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 业务类型 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="业务类型">
              <el-select
                v-model="queryForm.productType"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="查询转接" value="query_transfer" />
                <el-option label="实名查询" value="real_name_query" />
                <el-option label="短信名片" value="sms_card" />
                <el-option label="优先报号" value="priority_report" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 操作类型 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="操作类型">
              <el-select
                v-model="queryForm.operationType"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="新增" value="add" />
                <el-option label="修改" value="modify" />
                <el-option label="注销" value="cancel" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮 - 右对齐 -->
        <el-row :gutter="20" justify="end">
          <el-col :span="24" class="filter-buttons">
            <el-button @click="handleReset">
              重置
            </el-button>
            <el-button type="primary" :loading="loading" @click="handleSearch">
              查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格展示区 -->
    <div class="table-section">
      <el-table
        :data="customerList"
        stripe
        border
        v-loading="loading"
        class="customer-audit-table"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="40" align="center" />

        <!-- 客户名称 -->
        <el-table-column
          prop="customerName"
          label="客户名称"
          min-width="180"
          show-overflow-tooltip
        />

        <!-- 电话 -->
        <el-table-column
          prop="phone"
          label="电话"
          width="130"
          align="center"
        />

        <!-- 地区 -->
        <el-table-column
          prop="region"
          label="地区"
          width="80"
          align="center"
        />

        <!-- 行业 -->
        <el-table-column
          prop="industry"
          label="行业"
          width="100"
          align="center"
        />

        <!-- 签订业务 -->
        <el-table-column
          prop="businessTypes"
          label="签订业务"
          min-width="150"
        >
          <template #default="{ row }">
            <div class="business-tags">
              <el-tag
                v-for="(biz, index) in row.businessTypes"
                :key="index"
                size="small"
                class="business-tag"
              >
                {{ biz }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- 信息来源 -->
        <el-table-column
          prop="source"
          label="信息来源"
          width="80"
          align="center"
        />

        <!-- 锁定状态 -->
        <el-table-column
          prop="lockStatus"
          label="锁定状态"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span :class="{ 'locked': row.lockStatus === 'locked' }">
              {{ row.lockStatus === 'locked' ? '已锁定' : '未锁定' }}
            </span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column
          label="操作"
          width="60"
          align="center"
        >
          <template #default="{ row }">
            <span class="operation-type">新增</span>
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 审核按钮 -->
        <el-table-column
          label="审核"
          width="60"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="warning"
              link
              size="small"
              @click="handleAudit(row)"
            >
              审核
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && customerList.length === 0"
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

    <!-- 审核弹窗 -->
    <AuditDialog
      v-model="auditDialogVisible"
      :order="currentOrder"
      @submit="handleAuditSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentChecked } from '@element-plus/icons-vue'
import type { CustomerBusinessAggregate, CustomerAuditQueryParams } from './types/customerAudit'
import { AuditStatusEnum, AuditStatusLabels, AuditStatusColors } from './types/customerAudit'
import { getCustomerAuditList, currentUserPermission, logOperation } from './mock/customerAuditMock'
import AuditDialog from './components/AuditDialog.vue'

// ==================== 响应式数据 ====================
const loading = ref(false)
const customerList = ref<CustomerBusinessAggregate[]>([])
const selectedRows = ref<CustomerBusinessAggregate[]>([])
const filterFormRef = ref()

// 查询表单
const queryForm = reactive({
  customerName: '',
  phone: '',
  dateRange: null,
  industry: '',
  region: '',
  lockStatus: '',
  productType: '',
  operationType: '',
  page: 1,
  pageSize: 10
})

// 分页信息
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 审核弹窗
const auditDialogVisible = ref(false)
const currentOrder = ref<any>(null)

// ==================== 方法 ====================

/**
 * 获取状态标签
 */
const getStatusLabel = (status: string) => {
  return AuditStatusLabels[status as AuditStatusEnum] || status
}

/**
 * 获取状态颜色
 */
const getStatusType = (status: string): any => {
  return AuditStatusColors[status as AuditStatusEnum] || 'info'
}

/**
 * 加载客户列表
 */
const loadCustomerList = async () => {
  loading.value = true
  try {
    const params: CustomerAuditQueryParams = {
      customerName: queryForm.customerName || undefined,
      phone: queryForm.phone || undefined,
      region: queryForm.region || undefined,
      industry: queryForm.industry || undefined,
      lockStatus: queryForm.lockStatus || undefined,
      productType: queryForm.productType || undefined,
      operationType: queryForm.operationType || undefined,
      page: queryForm.page,
      pageSize: queryForm.pageSize
    }

    const res = await getCustomerAuditList(params, currentUserPermission)
    if (res.success) {
      customerList.value = res.data.list
      pagination.total = res.data.total
      pagination.page = res.data.page
      pagination.pageSize = res.data.pageSize
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
  loadCustomerList()
}

/**
 * 处理重置
 */
const handleReset = () => {
  queryForm.customerName = ''
  queryForm.phone = ''
  queryForm.dateRange = null
  queryForm.industry = ''
  queryForm.region = ''
  queryForm.lockStatus = ''
  queryForm.productType = ''
  queryForm.operationType = ''
  queryForm.page = 1
  loadCustomerList()
}

/**
 * 处理审核
 */
const handleAudit = (row: CustomerBusinessAggregate) => {
  currentOrder.value = row
  auditDialogVisible.value = true
  logOperation('click', `打开审核弹窗: ${row.customerName}`)
}

/**
 * 处理审核提交
 */
const handleAuditSubmit = (result: { orderId: string; approved: boolean; remark?: string }) => {
  ElMessage.success(result.approved ? '审核通过' : '审核驳回')
  loadCustomerList()
}

/**
 * 处理选择变化
 */
const handleSelectionChange = (selection: CustomerBusinessAggregate[]) => {
  selectedRows.value = selection
}

/**
 * 处理页码变化
 */
const handlePageChange = (page: number) => {
  queryForm.page = page
  loadCustomerList()
}

/**
 * 处理每页条数变化
 */
const handleSizeChange = () => {
  queryForm.pageSize = pagination.pageSize
  queryForm.page = 1
  loadCustomerList()
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadCustomerList()
})
</script>

<style scoped lang="scss">
.customer-audit-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;
}

// 页面标题
.page-header {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

// 筛选卡片样式 - 参考客户基础信息页面
.filter-card {
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-form {
  .filter-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

// 表格展示区
.table-section {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 0 0 4px 4px;

  .customer-audit-table {
    width: 100%;

    :deep(.el-table__header) {
      th {
        background-color: #1a5fb4;
        color: #fff;
        font-weight: 600;
        font-size: 13px;
        padding: 10px 0;
      }
    }

    :deep(.el-table__row) {
      td {
        font-size: 13px;
        padding: 8px 0;
      }
    }
  }

  .business-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .business-tag {
      margin: 0;
    }
  }

  .locked {
    color: #f56c6c;
  }

  .operation-type {
    color: #67c23a;
  }

  .empty-state {
    padding: 40px 0;
  }
}

// 分页控制区
.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
}
</style>
