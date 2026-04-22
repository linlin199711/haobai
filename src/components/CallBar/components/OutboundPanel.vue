/**
 * 呼叫中心话务条 - 外呼面板组件
 * @description 支持数字键盘输入电话号码进行外呼（内嵌面板版）
 * @version 1.0.0
 */

<template>
  <div class="outbound-panel">
    <div class="panel-content">
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

      <!-- 业务码 -->
      <div class="business-code-section">
        <span class="label">业务码：</span>
        <el-input
          v-model="businessCode"
          disabled
          class="business-input"
        />
      </div>

      <!-- 按钮区 -->
      <div class="button-section">
        <el-button
          type="success"
          :disabled="!canDial || !phoneNumber"
          :loading="loading"
          class="dial-btn"
          @click="handleDial"
        >
          <el-icon><Phone /></el-icon>
          拨出
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新状态
        </el-button>
        <el-button @click="handleClear">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Phone, Refresh, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
  canDial?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canDial: true
})

const emit = defineEmits<{
  (e: 'confirm', phoneNumber: string, businessCode: string): void
  (e: 'cancel'): void
}>()

// ==================== 响应式数据 ====================
const phoneNumber = ref('')
const businessCode = ref('118114')
const loading = ref(false)

// ==================== 方法 ====================
// 追加数字
const appendNumber = (num: string) => {
  if (phoneNumber.value.length < 20) {
    phoneNumber.value += num
  }
}

// 拨号
const handleDial = async () => {
  if (!phoneNumber.value) {
    ElMessage.warning('请输入外拨号码')
    return
  }
  loading.value = true
  try {
    emit('confirm', phoneNumber.value, businessCode.value)
  } finally {
    loading.value = false
  }
}

// 刷新状态
const handleRefresh = () => {
  ElMessage.success('状态已刷新')
}

// 清空
const handleClear = () => {
  phoneNumber.value = ''
  ElMessage.info('已清空号码')
}
</script>

<style scoped lang="scss">
.outbound-panel {
  padding: 20px;
  background: #fff;
  border-radius: 8px;

  .panel-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .number-input-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    width: 100%;

    .input-label {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      white-space: nowrap;
    }

    .phone-input {
      flex: 1;
    }
  }

  .keypad-section {
    background: #f5f7fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;

    .keypad-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .key-btn {
      width: 60px;
      height: 50px;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      background: #fff;
      font-size: 20px;
      font-weight: 500;
      color: #303133;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #ecf5ff;
        border-color: #409eff;
        color: #409eff;
      }

      &:active {
        background: #409eff;
        color: #fff;
      }
    }
  }

  .business-code-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    width: 100%;

    .label {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      white-space: nowrap;
    }

    .business-input {
      flex: 1;
    }
  }

  .button-section {
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: center;

    .dial-btn {
      min-width: 100px;
    }
  }
}
</style>
