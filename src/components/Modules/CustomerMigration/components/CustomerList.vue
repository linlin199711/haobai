<template>
  <el-card :title="title" shadow="never" class="customer-list-card">
    <el-table
      v-loading="loading"
      :data="customers"
      :row-key="'id'"
      :header-cell-style="{ background: '#fafafa' }"
      class="customer-table"
    >
      <el-table-column
        type="selection"
        :selectable="row => !disabled"
        @selection-change="handleSelectionChange"
        width="55"
      />
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
import { ref, h } from 'vue'
import type { CustomerInfo } from '../types'

const props = defineProps<{
  title: string
  customers: CustomerInfo[]
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', customer: CustomerInfo | null): void
}>()

const showDetailModal = ref(false)
const selectedCustomer = ref<CustomerInfo | null>(null)

const handleSelectionChange = (selectedItems: CustomerInfo[]) => {
  const customer = selectedItems.length > 0 ? selectedItems[0] : null
  emit('select', customer)
}

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