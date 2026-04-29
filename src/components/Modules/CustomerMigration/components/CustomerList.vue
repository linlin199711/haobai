<template>
  <el-card shadow="never" class="customer-list-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">{{ title }}</span>
        <el-tag :type="tagType" class="customer-tag">
          {{ tagText }}
        </el-tag>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="customers"
      :row-key="'id'"
      :header-cell-style="{ background: '#fafafa' }"
      highlight-current-row
      @row-click="handleRowClick"
      class="customer-table"
    >
      <el-table-column
        width="55"
        align="center"
      >
        <template #default="{ row }">
          <el-radio
            v-model="selectedId"
            :label="row.id"
            :disabled="disabled"
            @click.stop
          >
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerId"
        label="客户ID"
        width="120"
      />
      <el-table-column
        prop="customerName"
        label="客户名称"
        sortable
        min-width="150"
      />
      <el-table-column
        prop="phoneNumber"
        label="电话"
        width="140"
      />
      <el-table-column
        prop="customerType"
        label="客户类型"
        width="100"
      />
      <el-table-column
        prop="region"
        label="地区"
        width="100"
      />
      <el-table-column
        prop="industry"
        label="行业"
        width="100"
      />
      <el-table-column
        prop="infoSource"
        label="信息来源"
        width="120"
      />
      <el-table-column
        label="已受理业务"
        min-width="180"
        :render-header="() => h('span', '已受理业务')"
      >
        <template #default="scope">
          <div class="business-tags">
            <el-tooltip
              v-for="business in scope.row.acceptedBusiness"
              :key="business.id"
              :content="`${business.name} (${business.code})`"
              placement="top"
            >
              <el-tag
                :type="getBusinessTagType(business.id)"
                size="small"
                class="business-tag"
              >
                {{ business.name }}
              </el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="showBusinessDetail(scope.row)"
          >
            业务详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="customers.length === 0" class="empty-state">
      <el-empty description="暂无客户数据" />
    </div>

    <el-dialog
      v-model="showDetailModal"
      :title="selectedCustomer?.customerName + ' - 业务详情'"
      width="500px"
    >
      <div v-if="selectedCustomer" class="business-detail">
        <h4 class="detail-title">已受理业务列表</h4>
        <el-table
          :data="selectedCustomer.acceptedBusiness"
          border
          class="detail-table"
        >
          <el-table-column prop="name" label="业务名称" />
          <el-table-column prop="code" label="业务编码" />
        </el-table>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, h, computed, watch } from 'vue'
import type { CustomerInfo } from '../types'

const props = defineProps<{
  title: string
  customers: CustomerInfo[]
  loading?: boolean
  disabled?: boolean
}>()

const tagText = computed(() => {
  return props.title.includes('源客户') ? '源客户' : '目标客户'
})

const tagType = computed(() => {
  return props.title.includes('源客户') ? 'warning' : 'success'
})

const emit = defineEmits<{
  (e: 'select', customer: CustomerInfo | null): void
}>()

const showDetailModal = ref(false)
const selectedCustomer = ref<CustomerInfo | null>(null)
const selectedId = ref<string | null>(null)

const handleRowClick = (row: CustomerInfo) => {
  if (!props.disabled) {
    selectedId.value = row.id
    emit('select', row)
  }
}

watch(selectedId, (newId) => {
  if (newId) {
    const customer = props.customers.find(c => c.id === newId)
    if (customer) {
      emit('select', customer)
    }
  }
})

defineExpose({
  setSelected: (customer: CustomerInfo | null) => {
    selectedId.value = customer?.id || null
  }
})

const showBusinessDetail = (customer: CustomerInfo) => {
  selectedCustomer.value = customer
  showDetailModal.value = true
}

const getBusinessTagType = (businessId: string): string => {
  const typeMap: Record<string, string> = {
    elegant: 'primary',
    brand: 'success',
    realName: 'warning',
    transfer: 'danger',
    card: 'info',
    sms: 'default'
  }
  return typeMap[businessId] || 'default'
}
</script>

<style scoped>
.customer-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
}

.customer-tag {
  font-size: 12px;
}

:deep(.el-radio__label) {
  display: none;
}

.customer-table {
  width: 100%;
}

.business-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.business-tag {
  margin-bottom: 4px;
}

.empty-state {
  padding: 40px 0;
}

.business-detail {
  padding: 10px;
}

.detail-title {
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
}

.detail-table {
  width: 100%;
}
</style>