/**
 * 号码本地搜 - 转接弹窗
 * @description 将来电转接到客户号码确认
 * @version 2.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    title="转接确认"
    width="400px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div v-if="customer" class="transfer-content">
      <el-alert
        title="确定将来电转接到以下客户号码吗？"
        type="warning"
        :closable="false"
        show-icon
        class="transfer-notice"
      />
      
      <el-descriptions :column="1" border class="customer-info">
        <el-descriptions-item label="客户名称">{{ customer.name }}</el-descriptions-item>
        <el-descriptions-item label="转接号码">{{ customer.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="客户地址">{{ customer.address }}</el-descriptions-item>
      </el-descriptions>

      <el-alert
        title="转接后，当前来电将直接转接到该客户号码"
        type="info"
        :closable="false"
        class="transfer-tip"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleConfirm"
        >
          确认转接
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CustomerInfo } from '../types'

interface Props {
  modelValue: boolean
  customer: CustomerInfo | null
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

watch(() => props.modelValue, (val) => {
  if (val) {
    // 打开弹窗时重置
  }
})
</script>

<style scoped lang="scss">
.transfer-content {
  .transfer-notice {
    margin-bottom: 16px;
  }

  .customer-info {
    margin-bottom: 16px;
  }

  .transfer-tip {
    margin-top: 16px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
