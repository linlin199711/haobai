<template>
  <div class="customer-info-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">客户基础信息</h2>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="filterForm"
        label-width="110px"
        class="filter-form"
      >
        <el-row :gutter="20">
          <!-- 平台客户编号 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="平台客户编号">
              <el-input
                v-model="filterForm.platformCustomerNo"
                placeholder="请输入"
                clearable
                maxlength="30"
              />
            </el-form-item>
          </el-col>

          <!-- 客户ID -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="客户ID">
              <el-input
                v-model="filterForm.customerId"
                placeholder="请输入"
                clearable
                maxlength="30"
              />
            </el-form-item>
          </el-col>

          <!-- 客户名称 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="客户名称">
              <el-input
                v-model="filterForm.customerName"
                placeholder="请输入"
                clearable
                maxlength="30"
              />
            </el-form-item>
          </el-col>

          <!-- 电话号码 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="电话号码">
              <el-input
                v-model="filterForm.phoneNumber"
                placeholder="请输入"
                clearable
                maxlength="20"
              />
            </el-form-item>
          </el-col>

          <!-- 地区 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="地区">
              <el-select
                v-model="filterForm.city"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="city in customerStore.cityOptions"
                  :key="city.value"
                  :label="city.label"
                  :value="city.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 保密性质 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="保密性质">
              <el-select
                v-model="filterForm.confidentialityLevel"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 电话状态 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="电话状态">
              <el-select
                v-model="filterForm.phoneStatus"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="使用" value="使用" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 关联词汇 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="关联词汇">
              <el-input
                v-model="filterForm.keyword"
                placeholder="请输入"
                clearable
                maxlength="30"
              />
            </el-form-item>
          </el-col>

          <!-- 上下级查看 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="上下级查看">
              <el-switch
                v-model="filterForm.showHierarchy"
                active-text="开启"
                inactive-text="关闭"
                :active-value="true"
                :inactive-value="false"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <el-row :gutter="20" justify="end">
          <el-col :span="24" class="filter-buttons">
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增客户信息
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never" v-loading="customerStore.loading">
      <el-table
        :data="customerStore.customerList"
        stripe
        border
        style="width: 100%"
        :header-cell-style="headerCellStyle"
      >
        <!-- 序号 -->
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />

        <!-- 平台客户编号 -->
        <el-table-column
          prop="platformCustomerNo"
          label="平台客户编号"
          min-width="140"
          show-overflow-tooltip
        />

        <!-- 客户ID -->
        <el-table-column
          prop="customerId"
          label="客户ID"
          min-width="100"
          show-overflow-tooltip
        />

        <!-- 客户名称 -->
        <el-table-column
          prop="customerName"
          label="客户名称"
          min-width="180"
          show-overflow-tooltip
        />

        <!-- 电话号码 -->
        <el-table-column
          prop="phoneNumber"
          label="电话号码"
          min-width="120"
        />

        <!-- 地市 -->
        <el-table-column
          prop="city"
          label="地市"
          min-width="100"
        />

        <!-- 区县 -->
        <el-table-column
          prop="district"
          label="区县"
          min-width="100"
        />

        <!-- 客户等级 -->
        <el-table-column
          prop="customerLevel"
          label="客户等级"
          width="90"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getCustomerLevelType(row.customerLevel)"
              size="small"
            >
              {{ row.customerLevel }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 保密性质 -->
        <el-table-column prop="confidentialityLevel" label="保密性质" width="90" align="center">
          <template #default="{ row }">
            <span>{{ row.confidentialityLevel }}</span>
          </template>
        </el-table-column>

        <!-- 电话状态 -->
        <el-table-column prop="phoneStatus" label="电话状态" width="90" align="center">
          <template #default="{ row }">
            <span :class="row.phoneStatus === '使用' ? 'status-use' : 'status-stop'">
              {{ row.phoneStatus }}
            </span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="customerStore.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="400px"
      align-center
    >
      <div class="delete-confirm-content">
        <el-icon class="warning-icon" color="#E6A23C" :size="50">
          <WarningFilled />
        </el-icon>
        <p class="delete-message">
          确定要删除客户 <strong>{{ currentRow?.customerName }}</strong> 吗？
        </p>
        <p class="delete-tip">删除后数据将无法恢复，请谨慎操作！</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          :loading="deleteLoading"
          @click="confirmDelete"
        >
          确认删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 客户基础信息列表页组件
 * 包含：筛选区、数据表格、分页、操作按钮（查看/编辑/删除）
 */

import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Plus,
  WarningFilled
} from '@element-plus/icons-vue'
import { useCustomerInfoStore } from './store/customerInfoStore'
import type { CustomerInfo, CustomerListQueryParams } from './types/customerInfo'

// ==================== Emits 和 Store ====================

const emit = defineEmits<{
  /** 新增客户 */
  (e: 'add'): void
  /** 查看客户 */
  (e: 'view', customerId: string): void
  /** 编辑客户 */
  (e: 'edit', customerId: string): void
}>()

const customerStore = useCustomerInfoStore()

// ==================== 权限控制 ====================

/**
 * 是否有新增权限
 */
const hasAddPermission = computed(() => {
  return true
})

/**
 * 是否有编辑权限
 */
const hasEditPermission = computed(() => {
  return true
})

/**
 * 是否有删除权限
 */
const hasDeletePermission = computed(() => {
  return true
})

// ==================== 筛选表单 ====================

const filterFormRef = ref<FormInstance>()

/**
 * 筛选表单数据
 */
const filterForm = reactive({
  platformCustomerNo: '',
  customerId: '',
  customerName: '',
  phoneNumber: '',
  city: '',
  confidentialityLevel: '',
  phoneStatus: '',
  keyword: '',
  showHierarchy: false
})

// ==================== 分页 ====================

/**
 * 分页参数
 */
const pagination = reactive({
  pageNum: 1,
  pageSize: 10
})

// ==================== 表格样式 ====================

/**
 * 表头单元格样式
 */
const headerCellStyle = {
  background: '#f5f7fa',
  color: '#606266',
  fontWeight: 'bold'
}

/**
 * 获取客户等级标签类型
 */
const getCustomerLevelType = (level: string): string => {
  switch (level) {
    case '1级':
      return 'danger'
    case '2级':
      return 'warning'
    case '3级':
      return 'success'
    case '4级':
      return 'info'
    default:
      return ''
  }
}

// ==================== 删除对话框 ====================

const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const currentRow = ref<CustomerInfo | null>(null)

// ==================== 方法 ====================

/**
 * 获取查询参数
 */
const getQueryParams = (): CustomerListQueryParams => {
  return {
    ...filterForm,
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize
  }
}

/**
 * 加载客户列表
 */
const loadList = async () => {
  try {
    await customerStore.loadCustomerList(getQueryParams())
  } catch (error: any) {
    ElMessage.error(error?.message || '加载客户列表失败')
  }
}

/**
 * 查询按钮
 */
const handleSearch = () => {
  pagination.pageNum = 1
  loadList()
}

/**
 * 重置按钮
 */
const handleReset = () => {
  // 重置表单
  filterForm.platformCustomerNo = ''
  filterForm.customerId = ''
  filterForm.customerName = ''
  filterForm.phoneNumber = ''
  filterForm.city = ''
  filterForm.confidentialityLevel = ''
  filterForm.phoneStatus = ''
  filterForm.keyword = ''
  filterForm.showHierarchy = false

  // 重置分页并查询
  pagination.pageNum = 1
  pagination.pageSize = 10
  loadList()
}

/**
 * 新增按钮
 */
const handleAdd = () => {
  emit('add')
}

/**
 * 查看按钮
 */
const handleView = (row: CustomerInfo) => {
  emit('view', row.customerId)
}

/**
 * 编辑按钮
 */
const handleEdit = (row: CustomerInfo) => {
  emit('edit', row.customerId)
}

/**
 * 删除按钮
 */
const handleDelete = async (row: CustomerInfo) => {
  currentRow.value = row
  deleteDialogVisible.value = true
}

/**
 * 确认删除
 */
const confirmDelete = async () => {
  if (!currentRow.value) return

  deleteLoading.value = true
  try {
    await customerStore.removeCustomer(currentRow.value.customerId)
    ElMessage.success('删除客户成功')
    deleteDialogVisible.value = false
    // 刷新列表
    loadList()
  } catch (error: any) {
    ElMessage.error(error?.message || '删除客户失败')
  } finally {
    deleteLoading.value = false
  }
}

/**
 * 每页条数变化
 */
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  loadList()
}

/**
 * 页码变化
 */
const handleCurrentChange = (page: number) => {
  pagination.pageNum = page
  loadList()
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 初始化加载基础数据
  await customerStore.init()
  // 加载客户列表
  await loadList()
})
</script>

<style scoped lang="scss">
.customer-info-list {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .filter-card {
    margin-bottom: 20px;

    .filter-form {
      .el-form-item {
        margin-bottom: 18px;
      }
    }

    .filter-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
  }

  .table-card {
    .status-use {
      color: #67c23a;
    }

    .status-stop {
      color: #f56c6c;
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
    }
  }

  .delete-confirm-content {
    text-align: center;
    padding: 20px 0;

    .warning-icon {
      margin-bottom: 15px;
    }

    .delete-message {
      font-size: 16px;
      color: #303133;
      margin: 10px 0;

      strong {
        color: #f56c6c;
      }
    }

    .delete-tip {
      font-size: 13px;
      color: #909399;
      margin-top: 10px;
    }
  }
}
</style>
