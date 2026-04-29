<template>
  <div class="customer-migration">
    <div class="page-header">
      <h2 class="page-title">业务调配及信息修改</h2>
    </div>

    <MigrationFilterForm @search="handleSearch" />

    <MigrationCustomerList
      ref="sourceListRef"
      title="源客户列表"
      :customers="sourceCustomers"
      :loading="loading"
      @select="handleSourceSelect"
    />

    <MigrationCustomerList
      ref="targetListRef"
      title="目标客户列表"
      :customers="targetCustomers"
      :loading="loading"
      @select="handleTargetSelect"
    />

    <div class="footer-actions">
      <el-button
        type="primary"
        :loading="migrationLoading"
        :disabled="!canMigrate"
        @click="handleMigrate('business')"
      >
        <el-icon><ArrowRight /></el-icon>
        迁移业务
      </el-button>
      <el-button
          type="success"
          :loading="migrationLoading"
          :disabled="!canMigrate"
          @click="handleMigrate('businessAndNumber')"
        >
          <el-icon><RefreshLeft /></el-icon>
          迁移业务和计费号码
        </el-button>
    </div>

    <el-dialog
      v-model="showConflictModal"
      title="业务冲突提示"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="conflict-content">
        <el-alert
          type="warning"
          :title="conflictMessage"
          show-icon
        />
      </div>
      <template #footer>
        <el-button type="primary" @click="showConflictModal = false">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showConfirmModal"
      title="迁移确认"
      width="450px"
    >
      <div class="confirm-content">
        <p>确认将以下客户的业务迁移到目标客户？</p>
        <div class="customer-info">
          <div class="info-item">
            <span class="label">源客户：</span>
            <span class="value">{{ selectedSource?.customerName }}</span>
          </div>
          <div class="info-item">
            <span class="label">目标客户：</span>
            <span class="value">{{ selectedTarget?.customerName }}</span>
          </div>
          <div class="info-item">
            <span class="label">迁移模式：</span>
            <span class="value">{{ migrationModeText }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showConfirmModal = false">取消</el-button>
        <el-button type="primary" @click="confirmMigration">
          确认迁移
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CustomerInfo, FilterForm, MigrationMode } from './types'
import {
  mockSourceCustomers,
  mockTargetCustomers,
  filterCustomers,
  mockMigrateBusiness,
  businessTypes
} from './mock'
import MigrationFilterForm from './components/FilterForm.vue'
import MigrationCustomerList from './components/CustomerList.vue'

const loading = ref(false)
const migrationLoading = ref(false)
const showConflictModal = ref(false)
const showConfirmModal = ref(false)
const conflictMessage = ref('')
const pendingMode = ref<MigrationMode>('business')

const selectedSource = ref<CustomerInfo | null>(null)
const selectedTarget = ref<CustomerInfo | null>(null)
const sourceListRef = ref()
const targetListRef = ref()

const sourceCustomers = ref<CustomerInfo[]>([...mockSourceCustomers])
const targetCustomers = ref<CustomerInfo[]>([...mockTargetCustomers])

const canMigrate = computed(() => {
  return selectedSource.value !== null && selectedTarget.value !== null
})

const migrationModeText = computed(() => {
  return pendingMode.value === 'business' ? '仅迁移业务' : '迁移业务和计费号码'
})

const handleSearch = (form: FilterForm) => {
  loading.value = true
  
  setTimeout(() => {
    sourceCustomers.value = filterCustomers(
      mockSourceCustomers,
      form.sourceCustomerName,
      form.sourceCustomerId,
      form.sourcePhoneNumber,
      form.region,
      form.includeSubRegions
    )
    
    targetCustomers.value = filterCustomers(
      mockTargetCustomers,
      form.targetCustomerName,
      form.targetCustomerId,
      form.targetPhoneNumber,
      form.region,
      form.includeSubRegions
    )
    
    selectedSource.value = null
    selectedTarget.value = null
    sourceListRef.value?.setSelected(null)
    targetListRef.value?.setSelected(null)
    loading.value = false
  }, 500)
}

const handleSourceSelect = (customer: CustomerInfo | null) => {
  selectedSource.value = customer
}

const handleTargetSelect = (customer: CustomerInfo | null) => {
  selectedTarget.value = customer
}

const checkBusinessConflict = (): string | null => {
  if (!selectedSource.value || !selectedTarget.value) return null

  const sourceBusinesses = selectedSource.value.acceptedBusiness
  const targetBusinesses = selectedTarget.value.acceptedBusiness

  const nonElegantSourceBusinesses = sourceBusinesses.filter(
    b => b.id !== 'elegant'
  )

  if (nonElegantSourceBusinesses.length === 0) {
    return null
  }

  const targetBusinessIds = new Set(targetBusinesses.map(b => b.id))
  
  const conflictingBusinesses = nonElegantSourceBusinesses.filter(
    b => targetBusinessIds.has(b.id)
  )

  if (conflictingBusinesses.length > 0) {
    const conflictNames = conflictingBusinesses.map(b => b.name).join('、')
    return `目标客户已存在【${conflictNames}】，请先处理冲突业务后再发起迁移`
  }

  return null
}

const handleMigrate = (mode: MigrationMode) => {
  if (!selectedSource.value || !selectedTarget.value) {
    ElMessage.warning('请先选择源客户和目标客户')
    return
  }

  const conflict = checkBusinessConflict()
  
  if (conflict) {
    conflictMessage.value = conflict
    showConflictModal.value = true
    return
  }

  pendingMode.value = mode
  showConfirmModal.value = true
}

const confirmMigration = async () => {
  showConfirmModal.value = false
  migrationLoading.value = true

  try {
    const success = await mockMigrateBusiness(
      selectedSource.value!.id,
      selectedTarget.value!.id,
      pendingMode.value
    )

    if (success) {
      ElMessage.success(`迁移成功！${pendingMode.value === 'business' ? '业务' : '业务和计费号码'}已迁移至目标客户`)
      
      selectedSource.value = null
      selectedTarget.value = null
    } else {
      ElMessage.error('迁移失败，请稍后重试')
    }
  } catch (error) {
    ElMessage.error('迁移过程中发生错误')
  } finally {
    migrationLoading.value = false
  }
}
</script>

<style scoped>
.customer-migration {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.footer-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 20px;
}

.conflict-content {
  padding: 10px 0;
}

.confirm-content {
  padding: 10px;
}

.customer-info {
  margin-top: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  font-weight: 500;
  min-width: 80px;
}

.info-item .value {
  color: #666;
}
</style>