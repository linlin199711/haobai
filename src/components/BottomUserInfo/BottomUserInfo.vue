/**
 * 底部用户信息展示组件
 * @description 呼叫中心话务台系统底部固定信息展示区，实时展示坐席信息、状态、通话时长等
 * @version 1.0.0
 */

<template>
  <div class="bottom-user-info">
    <div class="info-container">
      <!-- 字段1：姓名(工号) -->
      <div class="info-item">
        <span class="item-label">姓名(工号)：</span>
        <span class="item-value">{{ agentInfo.name }}({{ agentInfo.employeeNo }})</span>
      </div>

      <!-- 字段2：登录时间 -->
      <div class="info-item">
        <span class="item-label">登录时间：</span>
        <span class="item-value">{{ agentInfo.loginTime }}</span>
      </div>

      <!-- 字段3：本次登录通话次数 -->
      <div class="info-item">
        <span class="item-label">本次登录通话次数：</span>
        <span class="item-value">{{ agentInfo.callCount }}</span>
      </div>

      <!-- 字段4：座席状态 -->
      <div class="info-item">
        <span class="item-label">座席状态：</span>
        <span
          class="item-value status-text"
          :class="statusConfig.className"
          :style="{ color: statusConfig.color }"
        >
          {{ statusConfig.label }}
        </span>
      </div>

      <!-- 字段5：通话时长 -->
      <div class="info-item">
        <span class="item-label">通话时长：</span>
        <span class="item-value duration-text">{{ formattedDuration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { AgentInfo, AgentStatus } from './types'
import { StatusConfigMap } from './types'
import * as api from './mock'

// ==================== 响应式数据 ====================
const agentInfo = ref<AgentInfo>({
  name: '',
  employeeNo: '',
  loginTime: '',
  callCount: 0,
  status: 'offline',
  callDuration: 0,
  isInCall: false
})

// 计时器
let durationTimer: ReturnType<typeof setInterval> | null = null

// ==================== 计算属性 ====================
// 状态配置
const statusConfig = computed(() => {
  return StatusConfigMap[agentInfo.value.status] || StatusConfigMap.offline
})

// 格式化通话时长
const formattedDuration = computed(() => {
  const totalSeconds = agentInfo.value.callDuration
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// ==================== 方法 ====================
/**
 * 加载坐席信息
 */
const loadAgentInfo = async () => {
  try {
    const res = await api.getAgentInfo()
    if (res.success) {
      agentInfo.value = res.data
      // 如果正在通话中，启动计时器
      if (agentInfo.value.isInCall) {
        startDurationTimer()
      }
    }
  } catch (error) {
    console.error('加载坐席信息失败:', error)
  }
}

/**
 * 启动通话时长计时器
 */
const startDurationTimer = () => {
  if (durationTimer) return
  durationTimer = setInterval(() => {
    agentInfo.value.callDuration += 1
  }, 1000)
}

/**
 * 停止通话时长计时器
 */
const stopDurationTimer = () => {
  if (durationTimer) {
    clearInterval(durationTimer)
    durationTimer = null
  }
}

/**
 * 更新坐席状态
 */
const updateStatus = (status: AgentStatus) => {
  agentInfo.value.status = status
}

/**
 * 开始通话
 */
const startCall = () => {
  agentInfo.value.status = 'calling'
  agentInfo.value.isInCall = true
  startDurationTimer()
}

/**
 * 结束通话
 */
const endCall = () => {
  agentInfo.value.status = 'idle'
  agentInfo.value.isInCall = false
  agentInfo.value.callCount += 1
  agentInfo.value.callDuration = 0
  stopDurationTimer()
}

// ==================== 监听 ====================
// 监听状态变化，用于调试或联动其他组件
watch(
  () => agentInfo.value.status,
  (newStatus, oldStatus) => {
    console.log(`坐席状态变更: ${oldStatus} -> ${newStatus}`)
  }
)

// ==================== 生命周期 ====================
onMounted(() => {
  loadAgentInfo()
})

onUnmounted(() => {
  stopDurationTimer()
})

// ==================== 暴露方法 ====================
// 暴露方法供父组件调用
defineExpose({
  updateStatus,
  startCall,
  endCall,
  getAgentInfo: () => agentInfo.value
})
</script>

<style scoped lang="scss">
.bottom-user-info {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  padding: 8px 16px;

  .info-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .info-item {
    display: flex;
    align-items: center;
    white-space: nowrap;

    .item-label {
      font-size: 13px;
      color: #606266;
      margin-right: 4px;
    }

    .item-value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;

      &.status-text {
        font-weight: 600;
        transition: color 0.3s ease;

        &.status-idle {
          color: #67c23a;
        }

        &.status-busy {
          color: #f56c6c;
        }

        &.status-calling {
          color: #e6a23c;
        }

        &.status-offline {
          color: #909399;
        }
      }

      &.duration-text {
        font-family: 'Courier New', monospace;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .bottom-user-info {
    .info-container {
      gap: 16px;
      flex-wrap: wrap;
    }

    .info-item {
      .item-label,
      .item-value {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 768px) {
  .bottom-user-info {
    padding: 6px 12px;

    .info-container {
      gap: 12px;
    }

    .info-item {
      .item-label,
      .item-value {
        font-size: 11px;
      }
    }
  }
}
</style>
