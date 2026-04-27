/**
 * 号码本地搜 - 拍号确认弹窗
 * @description 拍号操作确认
 * @version 1.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    title="拍号确认"
    width="400px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div v-if="customer" class="dial-confirm-content">
      <el-alert
        title="确认拍号后将向客户语音播报、短信下发号码信息"
        type="warning"
        :closable="false"
        show-icon
        class="confirm-alert"
      />

      <el-descriptions :column="1" border class="customer-info">
        <el-descriptions-item label="客户名称">{{ customer.name }}</el-descriptions-item>
        <el-descriptions-item label="电话号码">{{ customer.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="客户地址">{{ customer.address }}</el-descriptions-item>
      </el-descriptions>

      <div class="dial-notice">
        <p>拍号后系统将：</p>
        <ul>
          <li>1. 向客户语音播报号码信息</li>
          <li>2. 向客户短信下发号码信息</li>
          <li>3. 记录拍号操作日志</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleConfirm"
        >
          确认拍号
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<style scoped lang="scss">
.dial-confirm-content {
  .confirm-alert {
    margin-bottom: 20px;
  }

  .customer-info {
    margin-bottom: 20px;
  }

  .dial-notice {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 4px;

    p {
      font-weight: 600;
      margin-bottom: 8px;
      color: #303133;
    }

    ul {
      padding-left: 20px;
      color: #606266;
      line-height: 1.8;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
