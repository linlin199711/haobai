<!--
  信息查询模块 - 坐席统计信息弹窗
  @description 展示坐席当天通话次数、通话时长、示忙时长等统计信息
  @version 1.0.0
-->
<template>
  <transition name="modal-fade">
    <div v-if="visible" class="info-query-modal" @click.self="handleClose">
      <!-- 遮罩层 -->
      <div class="modal-overlay"></div>

      <!-- 弹窗内容 -->
      <div class="modal-container">
        <!-- 顶部标题栏 -->
        <div class="modal-header">
          <div class="header-left">
            <el-icon size="20" color="#fff"><InfoFilled /></el-icon>
            <span class="modal-title">信息查询</span>
          </div>
          <button class="close-btn" @click="handleClose">
            <el-icon size="18"><Close /></el-icon>
          </button>
        </div>

        <!-- 数据展示区 -->
        <div class="data-section">
          <div class="data-row">
            <label class="data-label">当天通话次数：</label>
            <div class="data-input-wrapper">
              <el-input
                v-model="statistics.callCount"
                disabled
                class="data-input"
              />
              <span class="data-unit">次</span>
            </div>
          </div>

          <div class="data-row">
            <label class="data-label">当天通话时长：</label>
            <div class="data-input-wrapper">
              <el-input
                v-model="statistics.callDuration"
                disabled
                class="data-input"
              />
              <span class="data-unit">秒</span>
            </div>
          </div>

          <div class="data-row">
            <label class="data-label">当天示忙时长：</label>
            <div class="data-input-wrapper">
              <el-input
                v-model="statistics.busyDuration"
                disabled
                class="data-input"
              />
              <span class="data-unit">秒</span>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="modal-footer">
          <el-button class="close-button" @click="handleClose">
            关闭
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, InfoFilled } from '@element-plus/icons-vue'
import type { AgentStatistics, AgentStatusEnum } from './types/infoQuery'

// ==================== Props & Emits ====================
interface Props {
  modelValue: boolean
  agentId?: string
  initialData?: Partial<AgentStatistics>
}

const props = withDefaults(defineProps<Props>(), {
  agentId: 'A001',
  initialData: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

// ==================== 响应式数据 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 统计数据
const statistics = reactive<AgentStatistics>({
  callCount: 0,
  callDuration: 0,
  busyDuration: 1393, // 初始值匹配原型
  idleDuration: 0,
  lastUpdateTime: new Date().toISOString()
})

// 当前状态
const currentStatus = ref<AgentStatusEnum>('idle')

// 计时器
let callTimer: number | null = null
let busyTimer: number | null = null
let statusCheckTimer: number | null = null

// ==================== 方法 ====================

/**
 * 初始化数据
 */
const initData = () => {
  // 合并初始数据
  if (props.initialData) {
    Object.assign(statistics, props.initialData)
  }
  // 确保最小值为0
  statistics.callCount = Math.max(0, statistics.callCount)
  statistics.callDuration = Math.max(0, statistics.callDuration)
  statistics.busyDuration = Math.max(0, statistics.busyDuration)
}

/**
 * 开始通话计时
 */
const startCallTimer = () => {
  if (callTimer) return
  statistics.callCount++
  callTimer = window.setInterval(() => {
    statistics.callDuration++
  }, 1000)
}

/**
 * 停止通话计时
 */
const stopCallTimer = () => {
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
}

/**
 * 开始示忙计时
 */
const startBusyTimer = () => {
  if (busyTimer) return
  busyTimer = window.setInterval(() => {
    statistics.busyDuration++
  }, 1000)
}

/**
 * 停止示忙计时
 */
const stopBusyTimer = () => {
  if (busyTimer) {
    clearInterval(busyTimer)
    busyTimer = null
  }
}

/**
 * 模拟状态检查（实际项目中应从全局状态或WebSocket获取）
 */
const checkAgentStatus = () => {
  // 模拟状态变化，实际应从全局状态获取
  // 这里仅作演示，每秒检查一次状态
  statusCheckTimer = window.setInterval(() => {
    // 模拟：随机切换状态用于测试
    // 实际项目中应监听全局状态变化
  }, 1000)
}

/**
 * 清除所有计时器
 */
const clearAllTimers = () => {
  stopCallTimer()
  stopBusyTimer()
  if (statusCheckTimer) {
    clearInterval(statusCheckTimer)
    statusCheckTimer = null
  }
}

/**
 * 处理关闭
 */
const handleClose = () => {
  visible.value = false
  emit('close')
}

/**
 * 键盘事件处理
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && visible.value) {
    handleClose()
  }
}

// ==================== 监听 ====================
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    initData()
    checkAgentStatus()
    document.addEventListener('keydown', handleKeydown)
  } else {
    clearAllTimers()
    document.removeEventListener('keydown', handleKeydown)
  }
})

// ==================== 生命周期 ====================
onMounted(() => {
  if (visible.value) {
    initData()
    checkAgentStatus()
  }
})

onUnmounted(() => {
  clearAllTimers()
  document.removeEventListener('keydown', handleKeydown)
})

// ==================== 暴露方法 ====================
defineExpose({
  refresh: initData,
  startCall: startCallTimer,
  stopCall: stopCallTimer,
  startBusy: startBusyTimer,
  stopBusy: stopBusyTimer
})
</script>

<style scoped lang="scss">
// 变量定义
$header-blue: #1a5fb4;
$border-color: #dcdfe6;
$text-primary: #303133;
$text-secondary: #606266;
$bg-gray: #f5f7fa;

// 遮罩层
.info-query-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

// 弹窗容器
.modal-container {
  position: relative;
  width: 400px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 顶部标题栏
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  background: $header-blue;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .modal-title {
      font-size: 15px;
      font-weight: 500;
      color: #fff;
    }
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
  }
}

// 数据展示区
.data-section {
  padding: 24px 20px;
  background: $bg-gray;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .data-label {
    width: 110px;
    font-size: 13px;
    color: $text-primary;
    text-align: right;
    flex-shrink: 0;
  }

  .data-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    .data-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        background: #fff;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      :deep(.el-input__inner) {
        font-size: 13px;
        color: $text-primary;
        text-align: left;
      }
    }

    .data-unit {
      font-size: 13px;
      color: $text-secondary;
      width: 20px;
    }
  }
}

// 底部按钮
.modal-footer {
  display: flex;
  justify-content: center;
  padding: 16px 20px 20px;
  background: $bg-gray;

  .close-button {
    min-width: 100px;
    height: 32px;
    font-size: 13px;
    border: 1px solid $border-color;
    background: linear-gradient(to bottom, #fff, #f5f7fa);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    &:hover {
      background: linear-gradient(to bottom, #f5f7fa, #e4e7ed);
      border-color: #c0c4cc;
    }

    &:active {
      background: #e4e7ed;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
}

// 过渡动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: translateY(-30px) scale(0.95);
  }
}
</style>
