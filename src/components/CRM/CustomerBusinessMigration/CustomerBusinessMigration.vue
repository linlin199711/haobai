<template>
  <div class="customer-business-migration">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">业务调配及信息修改</h2>
    </div>

    <!-- 筛选查询区 -->
    <el-card class="filter-card" shadow="never">
      <el-form
        ref="filterFormRef"
        :model="queryParams"
        label-width="120px"
        class="filter-form"
      >
        <!-- 第一行：源客户筛选条件 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="源客户名称">
              <el-input
                v-model="queryParams.sourceCustomerName"
                placeholder="请输入源客户名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="源客户ID">
              <el-input
                v-model="queryParams.sourceCustomerId"
                placeholder="请输入源客户ID"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="源客户号码">
              <el-input
                v-model="queryParams.sourceCustomerPhone"
                placeholder="请输入源客户号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="地区">
              <el-select
                v-model="queryParams.city"
                placeholder="请选择地区"
                clearable
                style="width: 100%"
              >
                <el-option label="全部" value="全部" />
                <el-option label="福州市" value="福州市" />
                <el-option label="厦门市" value="厦门市" />
                <el-option label="泉州市" value="泉州市" />
                <el-option label="漳州市" value="漳州市" />
                <el-option label="莆田市" value="莆田市" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行：目标客户筛选条件 + 复选框 + 按钮 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="目标客户名称">
              <el-input
                v-model="queryParams.targetCustomerName"
                placeholder="请输入目标客户名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="目标客户ID">
              <el-input
                v-model="queryParams.targetCustomerId"
                placeholder="请输入目标客户ID"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="目标客户号码">
              <el-input
                v-model="queryParams.targetCustomerPhone"
                placeholder="请输入目标客户号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6">
            <div class="filter-actions">
              <el-checkbox v-model="queryParams.includeSubordinate" class="subordinate-checkbox">
                包含下属地区
              </el-checkbox>
              <el-button type="primary" @click="handleQuery" :loading="loading.query">
                查询
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 源客户列表 -->
    <el-card class="list-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">源客户列表</span>
          <el-tag v-if="selectedSourceCustomer" type="success">
            已选择：{{ selectedSourceCustomer.customerName }}
          </el-tag>
        </div>
      </template>

      <el-table
        ref="sourceTableRef"
        :data="sourceCustomerList"
        border
        stripe
        highlight-current-row
        v-loading="loading.query"
        @current-change="handleSourceCustomerSelect"
        style="width: 100%"
      >
        <el-table-column type="index" label="选择" width="60" align="center">
          <template #default="{ row }">
            <el-radio
              v-model="selectedSourceId"
              :label="row.customerId"
              @click.stop
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="customerId" label="客户ID" min-width="120" show-overflow-tooltip />
        <el-table-column
          prop="customerName"
          label="客户名称"
          min-width="180"
          show-overflow-tooltip
          sortable
        />
        <el-table-column prop="phoneNumber" label="电话" min-width="140" show-overflow-tooltip />
        <el-table-column prop="customerCategory" label="客户类型" min-width="100" align="center" />
        <el-table-column prop="city" label="地区" min-width="100" align="center" />
        <el-table-column prop="industry" label="行业" min-width="100" align="center" />
        <el-table-column prop="infoSource" label="信息来源" min-width="100" align="center" />
        <el-table-column label="已受理业务" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip
              v-if="row.businesses.length > 0"
              :content="formatBusinessList(row.businesses)"
              placement="top"
              effect="dark"
            >
              <div class="business-tags">
                <el-tag
                  v-for="biz in row.businesses.slice(0, 3)"
                  :key="biz.code"
                  size="small"
                  class="business-tag"
                >
                  {{ biz.name }}
                </el-tag>
                <el-tag v-if="row.businesses.length > 3" size="small" type="info">
                  +{{ row.businesses.length - 3 }}
                </el-tag>
              </div>
            </el-tooltip>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="sourceCustomerList.length === 0 && !loading.query" description="暂无客户数据" />
    </el-card>

    <!-- 目标客户列表 -->
    <el-card class="list-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">目标客户列表</span>
          <el-tag v-if="selectedTargetCustomer" type="success">
            已选择：{{ selectedTargetCustomer.customerName }}
          </el-tag>
        </div>
      </template>

      <el-table
        ref="targetTableRef"
        :data="targetCustomerList"
        border
        stripe
        highlight-current-row
        v-loading="loading.query"
        @current-change="handleTargetCustomerSelect"
        style="width: 100%"
      >
        <el-table-column type="index" label="选择" width="60" align="center">
          <template #default="{ row }">
            <el-radio
              v-model="selectedTargetId"
              :label="row.customerId"
              @click.stop
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="customerId" label="客户ID" min-width="120" show-overflow-tooltip />
        <el-table-column
          prop="customerName"
          label="客户名称"
          min-width="180"
          show-overflow-tooltip
          sortable
        />
        <el-table-column prop="phoneNumber" label="电话" min-width="140" show-overflow-tooltip />
        <el-table-column prop="customerCategory" label="客户类型" min-width="100" align="center" />
        <el-table-column prop="city" label="地区" min-width="100" align="center" />
        <el-table-column prop="industry" label="行业" min-width="100" align="center" />
        <el-table-column prop="infoSource" label="信息来源" min-width="100" align="center" />
        <el-table-column label="已受理业务" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip
              v-if="row.businesses.length > 0"
              :content="formatBusinessList(row.businesses)"
              placement="top"
              effect="dark"
            >
              <div class="business-tags">
                <el-tag
                  v-for="biz in row.businesses.slice(0, 3)"
                  :key="biz.code"
                  size="small"
                  class="business-tag"
                >
                  {{ biz.name }}
                </el-tag>
                <el-tag v-if="row.businesses.length > 3" size="small" type="info">
                  +{{ row.businesses.length - 3 }}
                </el-tag>
              </div>
            </el-tooltip>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="targetCustomerList.length === 0 && !loading.query" description="暂无客户数据" />
    </el-card>

    <!-- 底部迁移按钮区 -->
    <div class="migration-actions">
      <el-button
        type="primary"
        size="large"
        :disabled="!canMigrate"
        :loading="loading.migration"
        @click="handleMigrateBusiness"
      >
        迁移业务
      </el-button>
    </div>

    <!-- 冲突提示弹窗 -->
    <el-dialog
      v-model="conflictDialogVisible"
      title="业务冲突提示"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="conflict-content">
        <el-alert
          :title="conflictMessage"
          type="error"
          :closable="false"
          show-icon
        />
        <div v-if="conflictBusinesses.length > 0" class="conflict-businesses">
          <p class="conflict-title">冲突业务详情：</p>
          <el-table :data="conflictBusinesses" border size="small">
            <el-table-column prop="name" label="业务名称" min-width="120" />
            <el-table-column prop="code" label="业务编码" min-width="150" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="conflictDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, TableInstance } from 'element-plus'

// 导入类型定义
import {
  CustomerInfo,
  CustomerBusiness,
  MigrationQueryParams,
  BusinessConflictCheckResult
} from './types/customerBusinessMigration'

// 导入Mock数据服务
import {
  mockQuerySourceCustomers,
  mockQueryTargetCustomers,
  mockCheckBusinessConflict,
  mockMigrateBusiness
} from './mock/customerBusinessMigrationMock'

// ==================== 组件Refs ====================
const filterFormRef = ref<FormInstance>()
const sourceTableRef = ref<TableInstance>()
const targetTableRef = ref<TableInstance>()

// ==================== 加载状态 ====================
const loading = reactive({
  query: false,
  migration: false,
  conflictCheck: false
})

// ==================== 查询参数 ====================
const queryParams = reactive<MigrationQueryParams>({
  sourceCustomerName: '',
  sourceCustomerId: '',
  sourceCustomerPhone: '',
  targetCustomerName: '',
  targetCustomerId: '',
  targetCustomerPhone: '',
  city: '全部',
  includeSubordinate: false
})

// ==================== 数据列表 ====================
const sourceCustomerList = ref<CustomerInfo[]>([])
const targetCustomerList = ref<CustomerInfo[]>([])

// ==================== 选中状态 ====================
const selectedSourceId = ref<string>('')
const selectedTargetId = ref<string>('')

const selectedSourceCustomer = computed<CustomerInfo | null>(() => {
  return sourceCustomerList.value.find(c => c.customerId === selectedSourceId.value) || null
})

const selectedTargetCustomer = computed<CustomerInfo | null>(() => {
  return targetCustomerList.value.find(c => c.customerId === selectedTargetId.value) || null
})

// 是否可以迁移（必须同时选中源客户和目标客户）
const canMigrate = computed(() => {
  return selectedSourceId.value && selectedTargetId.value
})

// ==================== 冲突提示状态 ====================
const conflictDialogVisible = ref(false)
const conflictMessage = ref('')
const conflictBusinesses = ref<CustomerBusiness[]>([])

// ==================== 格式化函数 ====================

/** 格式化业务列表显示 */
const formatBusinessList = (businesses: CustomerBusiness[]): string => {
  if (businesses.length === 0) return '无'
  return businesses.map(b => `${b.name}(${b.code})`).join('、')
}

// ==================== 事件处理函数 ====================

/** 查询客户数据 */
const handleQuery = async () => {
  loading.query = true
  try {
    // 并行查询源客户和目标客户
    const [sourceData, targetData] = await Promise.all([
      mockQuerySourceCustomers({
        sourceCustomerName: queryParams.sourceCustomerName,
        sourceCustomerId: queryParams.sourceCustomerId,
        sourceCustomerPhone: queryParams.sourceCustomerPhone,
        city: queryParams.city,
        includeSubordinate: queryParams.includeSubordinate
      }),
      mockQueryTargetCustomers({
        targetCustomerName: queryParams.targetCustomerName,
        targetCustomerId: queryParams.targetCustomerId,
        targetCustomerPhone: queryParams.targetCustomerPhone,
        city: queryParams.city,
        includeSubordinate: queryParams.includeSubordinate
      })
    ])

    sourceCustomerList.value = sourceData
    targetCustomerList.value = targetData

    // 清空选中状态
    selectedSourceId.value = ''
    selectedTargetId.value = ''

    ElMessage.success('查询成功')
  } catch (error) {
    ElMessage.error('查询失败，请稍后重试')
    console.error('查询错误:', error)
  } finally {
    loading.query = false
  }
}

/** 重置查询条件 */
const handleReset = () => {
  queryParams.sourceCustomerName = ''
  queryParams.sourceCustomerId = ''
  queryParams.sourceCustomerPhone = ''
  queryParams.targetCustomerName = ''
  queryParams.targetCustomerId = ''
  queryParams.targetCustomerPhone = ''
  queryParams.city = '全部'
  queryParams.includeSubordinate = false

  // 重新加载全部数据
  handleQuery()
}

/** 选择源客户 */
const handleSourceCustomerSelect = (row: CustomerInfo) => {
  if (row) {
    selectedSourceId.value = row.customerId
  }
}

/** 选择目标客户 */
const handleTargetCustomerSelect = (row: CustomerInfo) => {
  if (row) {
    selectedTargetId.value = row.customerId
  }
}

/** 检查业务冲突并执行迁移
 * 核心业务规则：
 * 1. 源客户仅含优推业务：直接通过校验，不提示
 * 2. 源客户含非优推业务，且目标客户存在相同业务：提示冲突，禁止迁移
 */
const checkAndMigrate = async () => {
  if (!selectedSourceCustomer.value || !selectedTargetCustomer.value) {
    ElMessage.warning('请先选择源客户和目标客户')
    return
  }

  loading.conflictCheck = true
  try {
    // 检查业务冲突
    const conflictResult = await mockCheckBusinessConflict(
      selectedSourceCustomer.value.customerId,
      selectedTargetCustomer.value.customerId
    )

    if (conflictResult.hasConflict) {
      // 存在冲突，显示冲突提示弹窗
      conflictMessage.value = conflictResult.message
      conflictBusinesses.value = conflictResult.conflictBusinesses
      conflictDialogVisible.value = true
      return
    }

    // 无冲突，执行迁移
    await executeMigration()
  } catch (error) {
    ElMessage.error('冲突检查失败，请稍后重试')
    console.error('冲突检查错误:', error)
  } finally {
    loading.conflictCheck = false
  }
}

/** 执行业务迁移 */
const executeMigration = async () => {
  // 确认弹窗
  try {
    await ElMessageBox.confirm(
      `确定要将客户 "${selectedSourceCustomer.value?.customerName}" 的业务迁移到 "${selectedTargetCustomer.value?.customerName}" 吗？`,
      '迁移业务确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    // 用户取消
    return
  }

  // 执行迁移
  loading.migration = true
  try {
    const result = await mockMigrateBusiness(
      selectedSourceCustomer.value!.customerId,
      selectedTargetCustomer.value!.customerId,
      false
    )

    if (result.success) {
      ElMessage.success(result.message)
      // 刷新数据
      await handleQuery()
    } else {
      ElMessage.error(result.message || '迁移失败')
    }
  } catch (error) {
    ElMessage.error('迁移失败，请稍后重试')
    console.error('迁移错误:', error)
  } finally {
    loading.migration = false
  }
}

/** 处理迁移业务按钮点击 */
const handleMigrateBusiness = () => {
  checkAndMigrate()
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始加载数据
  handleQuery()
})
</script>

<style scoped lang="scss">
.customer-business-migration {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

// 页面标题
.page-header {
  margin-bottom: 20px;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

// 筛选区样式
.filter-card {
  margin-bottom: 20px;

  .filter-form {
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .filter-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 32px;

    .subordinate-checkbox {
      margin-right: auto;
    }
  }
}

// 列表卡片样式
.list-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
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

  :deep(.el-radio__label) {
    display: none;
  }
}

// 底部迁移按钮区
.migration-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .el-button {
    min-width: 160px;
  }
}

// 冲突提示弹窗
.conflict-content {
  .conflict-title {
    margin: 16px 0 8px;
    font-weight: 600;
    color: #303133;
  }

  .conflict-businesses {
    margin-top: 16px;
  }
}
</style>
