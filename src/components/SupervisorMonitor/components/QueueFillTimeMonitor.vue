/**
 * 班长监控控制台 - 排队蓄满耗时监控组件
 * @description 实时显示排队从空到满的累计时间
 * @version 1.0.0
 */

<template>
  <div class="queue-fill-time-monitor">
    <div class="time-card" :class="{ 'is-full': fillTimeData.isFull }">
      <div class="card-header">
        <el-icon><Clock /></el-icon>
        <span class="card-title">排队蓄满耗时</span>
        <el-tag
          v-if="fillTimeData.isFull"
          type="danger"
          size="small"
          effect="dark"
          class="full-tag"
        >
          队列已满
        </el-tag>
      </div>

      <div class="time-display">
        <div class="time-value" :class="{ 'time-changed': timeChanged }">
          {{ formattedTime }}
        </div>
        <div class="time-label">
          当前队列从空到满的累计时间
        </div>
      </div>

      <div class="time-info">
        <div class="info-item">
          <span class="info-label">开始计时：</span>
          <span class="info-value">{{ fillTimeData.lastResetTime || '--' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">当前状态：</span>
          <span class="info-value" :class="fillTimeData.isFull ? 'status-full' : 'status-accumulating'">
            {{ fillTimeData.isFull ? '已蓄满' : '累计中' }}
          </span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <el-progress
          :percentage="progressPercentage"
          :status="fillTimeData.isFull ? 'exception' : ''"
          :stroke-width="12"
          :show-text="false"
        />
        <div class="progress-label">
          预计蓄满进度
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import type { QueueFillTime } from '../types'

interface Props {
  fillTimeData: QueueFillTime
  totalWaiting: number
  queueCapacity: number
}

const props = defineProps<Props>()

// ==================== 响应式数据 ====================
const displayTime = ref(props.fillTimeData.fillDuration)
const timeChanged = ref(false)
let timer: number | null = null

// ==================== 计算属性 ====================
const formattedTime = computed(() => {
  const hours = Math.floor(displayTime.value / 3600)
  const minutes = Math.floor((displayTime.value % 3600) / 60)
  const seconds = displayTime.value % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progressPercentage = computed(() => {
  if (props.queueCapacity <= 0) return 0
  const percentage = Math.min(100, Math.round((props.totalWaiting / props.queueCapacity) * 100))
  return percentage
})

// ==================== 方法 ====================
const startTimer = () => {
  if (timer) return

  timer = window.setInterval(() => {
    if (!props.fillTimeData.isFull && props.totalWaiting > 0) {
      displayTime.value++
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// ==================== 监听 ====================
watch(() => props.fillTimeData.fillDuration, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    displayTime.value = newVal
    timeChanged.value = true

    setTimeout(() => {
      timeChanged.value = false
    }, 500)
  }
})

watch(() => props.totalWaiting, (newVal) => {
  if (newVal === 0) {
    displayTime.value = 0
  }
})

// ==================== 生命周期 ====================
onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped lang="scss">
.queue-fill-time-monitor {
  .time-card {
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    border-radius: 12px;
    padding: 20px;
    border-left: 4px solid #52c41a;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 8px 24px rgba(82, 196, 26, 0.15);
    }

    &.is-full {
      background: linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%);
      border-left-color: #f5222d;

      &:hover {
        box-shadow: 0 8px 24px rgba(245, 34, 45, 0.15);
      }

      .time-value {
        color: #f5222d;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      .el-icon {
        font-size: 18px;
        color: #52c41a;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        flex: 1;
      }

      .full-tag {
        animation: pulse 1.5s infinite;
      }
    }

    .time-display {
      text-align: center;
      margin-bottom: 20px;

      .time-value {
        font-size: 48px;
        font-weight: 700;
        color: #52c41a;
        font-family: 'Courier New', monospace;
        letter-spacing: 4px;
        transition: all 0.3s;

        &.time-changed {
          animation: timePulse 0.5s ease-in-out;
        }
      }

      .time-label {
        font-size: 13px;
        color: #666;
        margin-top: 8px;
      }
    }

    .time-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 8px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;

        .info-label {
          color: #666;
        }

        .info-value {
          font-weight: 500;

          &.status-full {
            color: #f5222d;
          }

          &.status-accumulating {
            color: #52c41a;
          }
        }
      }
    }

    .progress-section {
      .progress-label {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 8px;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes timePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
