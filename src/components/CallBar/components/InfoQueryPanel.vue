<!--
  信息查询面板组件
  @description 展示坐席当天通话次数、通话时长、示忙时长等统计信息
  @version 1.0.0
-->
<template>
  <div class="info-query-panel">
    <!-- 数据统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon call-count">
          <el-icon><Phone /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">当天通话次数</div>
          <div class="stat-value">{{ statistics.callCount }}<span class="unit">次</span></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon call-duration">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">当天通话时长</div>
          <div class="stat-value">{{ statistics.callDuration }}<span class="unit">秒</span></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon busy-duration">
          <el-icon><CircleClose /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">当天示忙时长</div>
          <div class="stat-value">{{ statistics.busyDuration }}<span class="unit">秒</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Phone, Timer, CircleClose } from '@element-plus/icons-vue'
import type { AgentStatistics, AgentStatusEnum } from '../../Settings/InfoQuery/types/infoQuery'

// ==================== 响应式数据 ====================
const statistics = reactive<AgentStatistics>({
  callCount: 0,
  callDuration: 0,
  busyDuration: 1393,
  idleDuration: 0,
  lastUpdateTime: new Date().toLocaleString()
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
  // 模拟从API获取数据
  statistics.callCount = Math.floor(Math.random() * 50) + 10
  statistics.callDuration = Math.floor(Math.random() * 3600) + 300
  statistics.lastUpdateTime = new Date().toLocaleString()
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

// ==================== 生命周期 ====================
onMounted(() => {
  initData()
})

onUnmounted(() => {
  clearAllTimers()
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
.info-query-panel {
  padding: 40px 20px;
  background: #f5f7fa;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    width: 100%;
    max-width: 1000px;

    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .stat-icon {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: #fff;
        margin-bottom: 20px;

        &.call-count {
          background: linear-gradient(135deg, #409eff 0%, #1677ff 100%);
        }

        &.call-duration {
          background: linear-gradient(135deg, #67c23a 0%, #52c41a 100%);
        }

        &.busy-duration {
          background: linear-gradient(135deg, #e6a23c 0%, #fa8c16 100%);
        }
      }

      .stat-content {
        .stat-label {
          font-size: 16px;
          color: #606266;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 600;
          color: #303133;
          font-family: 'Courier New', monospace;

          .unit {
            font-size: 14px;
            color: #909399;
            margin-left: 4px;
            font-weight: normal;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 992px) {
  .info-query-panel {
    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }
}

@media (max-width: 576px) {
  .info-query-panel {
    padding: 20px;

    .stats-cards {
      grid-template-columns: 1fr;
      gap: 20px;

      .stat-card {
        padding: 24px;

        .stat-icon {
          width: 56px;
          height: 56px;
          font-size: 28px;
        }

        .stat-content {
          .stat-value {
            font-size: 28px;
          }
        }
      }
    }
  }
}
</style>
