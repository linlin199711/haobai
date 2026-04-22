/**
 * 呼叫中心话务条 - 外呼弹窗组件
 * @description 支持数字键盘输入电话号码进行外呼
 * @version 2.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    title="外呼"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    class="outbound-call-dialog"
  >
    <div class="dialog-content">
      <!-- 外拨号码输入区 -->
      <div class="number-input-section">
        <span class="input-label">外拨号码：</span>
        <el-input
          v-model="phoneNumber"
          placeholder="请输入外拨号码"
          clearable
          class="phone-input"
          maxlength="20"
        />
      </div>

      <!-- 数字键盘 -->
      <div class="keypad-section">
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('1')">1</button>
          <button class="key-btn" @click="appendNumber('2')">2</button>
          <button class="key-btn" @click="appendNumber('3')">3</button>
        </div>
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('4')">4</button>
          <button class="key-btn" @click="appendNumber('5')">5</button>
          <button class="key-btn" @click="appendNumber('6')">6</button>
        </div>
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('7')">7</button>
          <button class="key-btn" @click="appendNumber('8')">8</button>
          <button class="key-btn" @click="appendNumber('9')">9</button>
        </div>
        <div class="keypad-row">
          <button class="key-btn" @click="appendNumber('*')">*</button>
          <button class="key-btn" @click="appendNumber('0')">0</button>
          <button class="key-btn" @click="appendNumber('#')">#</button>
        </div>
      </div>

      <!-- 业务码区 -->
      <div class="options-section">
        <div class="business-code-row">
          <span class="label">业务码：</span>
          <el-input
            v-model="businessCode"
            disabled
            class="business-input"
          />
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="success"
          :disabled="!canDial || !phoneNumber"
          :loading="loading"
          @click="handleConfirm"
        >
          <el-icon><Check /></el-icon> 拨出
        </el-button>
        <el-button @click="handleRefresh" :loading="refreshing">
          <el-icon><Refresh /></el-icon> 刷新状态
        </el-button>
        <el-button @click="handleClear">
          <el-icon><Delete /></el-icon> 清空
        </el-button>
        <el-button type="success" @click="handleCancel">
          <el-icon><Close /></el-icon> 退出
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Refresh, Delete, Close } from '@element-plus/icons-vue'

// ==================== 类型定义 ====================
interface AgentStatus {
  isSignedIn: boolean
  isIdle: boolean
  isBusy: boolean
}

// ==================== Props & Emits ====================
interface Props {
  modelValue: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', phoneNumber: string, businessCode: string): void
  (e: 'cancel'): void
}>()

// ==================== 响应式数据 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const phoneNumber = ref('')
const businessCode = ref('118114') // 默认业务码，可从配置加载

const refreshing = ref(false)

// 坐席状态
const agentStatus = ref<AgentStatus>({
  isSignedIn: true,
  isIdle: true,
  isBusy: false
})

// ==================== 计算属性 ====================
const canDial = computed(() => {
  return agentStatus.value.isSignedIn && agentStatus.value.isIdle && !agentStatus.value.isBusy
})

// ==================== 方法 ====================

/**
 * 追加数字到输入框
 */
const appendNumber = (num: string) => {
  phoneNumber.value += num
}

/**
 * 执行外呼
 */
const handleConfirm = () => {
  if (!phoneNumber.value.trim()) {
    ElMessage.warning('请输入外拨号码')
    return
  }

  if (!canDial.value) {
    ElMessage.warning('当前状态不可外呼，请检查坐席状态')
    return
  }

  emit('confirm', phoneNumber.value.trim(), businessCode.value)
}

/**
 * 刷新状态
 */
const handleRefresh = async () => {
  refreshing.value = true
  try {
    // 模拟刷新状态
    await new Promise(resolve => setTimeout(resolve, 500))
    agentStatus.value = {
      isSignedIn: true,
      isIdle: Math.random() > 0.3,
      isBusy: Math.random() > 0.7
    }
    ElMessage.success('状态已刷新')
  } catch (error) {
    ElMessage.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

/**
 * 清空输入
 */
const handleClear = () => {
  phoneNumber.value = ''
  ElMessage.info('已清空')
}

/**
 * 取消/退出
 */
const handleCancel = () => {
  emit('cancel')
  visible.value = false
  phoneNumber.value = ''
}

// ==================== 生命周期 ====================
watch(() => props.modelValue, (val) => {
  if (val) {
    phoneNumber.value = ''
  }
})
</script>

<style scoped lang="scss">
.outbound-call-dialog {
  :deep(.el-dialog__header) {
    background: #f5f7fa;
    margin-right: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 外拨号码输入区
.number-input-section {
  display: flex;
  align-items: center;
  gap: 12px;

  .input-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    font-weight: 500;
  }

  .phone-input {
    flex: 1;
  }
}

// 数字键盘
.keypad-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;

  .keypad-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .key-btn {
    width: 80px;
    height: 50px;
    font-size: 20px;
    font-weight: 500;
    color: #303133;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #ecf5ff;
      border-color: #409eff;
      color: #409eff;
    }

    &:active {
      background: #409eff;
      border-color: #409eff;
      color: #fff;
      transform: scale(0.95);
    }

    &:focus {
      outline: none;
    }
  }
}

// 选项区
.options-section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .business-code-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .label {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
      font-weight: 500;
    }

    .business-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        background: #f5f7fa;
      }
    }
  }

}

// 底部按钮
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;

  .el-button {
    min-width: 90px;

    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>
