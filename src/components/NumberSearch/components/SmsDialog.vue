/**
 * 号码本地搜 - 短信发送弹窗
 * @description 给来电用户发送客户信息短信
 * @version 2.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    title="发送短信"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div v-if="customer" class="sms-content">
      <!-- 短信接收说明 -->
      <el-alert
        title="短信将发送给当前来电用户"
        type="info"
        :closable="false"
        show-icon
        class="sms-notice"
      />

      <!-- 客户信息预览 -->
      <el-descriptions :column="1" border class="customer-info" title="短信内容预览">
        <el-descriptions-item label="客户名称">{{ customer.name }}</el-descriptions-item>
        <el-descriptions-item label="客户号码">{{ customer.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="客户地址">{{ customer.address }}</el-descriptions-item>
      </el-descriptions>

      <!-- 短信内容编辑 -->
      <div class="content-section">
        <label class="section-label">
          短信内容
          <span class="char-count">{{ smsContent.length }}/500</span>
        </label>
        <el-input
          v-model="smsContent"
          type="textarea"
          :rows="5"
          placeholder="请输入短信内容"
          maxlength="500"
          show-word-limit
        />
      </div>

      <!-- 发送提示 -->
      <el-alert
        title="短信发送后将无法撤回，请确认内容无误"
        type="warning"
        :closable="false"
        show-icon
        class="send-notice"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!smsContent.trim()"
          @click="handleConfirm"
        >
          发送短信
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
  (e: 'confirm', content: string): void
  (e: 'cancel'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const smsContent = ref('')

// 生成默认短信内容
const generateDefaultContent = (customer: CustomerInfo | null): string => {
  if (!customer) return ''
  return `您好，您查询的商户信息如下：\n名称：${customer.name}\n电话：${customer.phoneNumber}\n地址：${customer.address}\n感谢您的使用！`
}

const handleConfirm = () => {
  if (smsContent.value.trim()) {
    emit('confirm', smsContent.value.trim())
  }
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

watch(() => props.modelValue, (val) => {
  if (val && props.customer) {
    // 打开弹窗时生成默认内容
    smsContent.value = generateDefaultContent(props.customer)
  }
})
</script>

<style scoped lang="scss">
.sms-content {
  .sms-notice {
    margin-bottom: 16px;
  }

  .customer-info {
    margin-bottom: 20px;
  }

  .content-section {
    margin-bottom: 20px;
  }

  .section-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    margin-bottom: 8px;

    .char-count {
      float: right;
      font-weight: normal;
      color: #909399;
      font-size: 12px;
    }
  }

  .send-notice {
    margin-top: 16px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
