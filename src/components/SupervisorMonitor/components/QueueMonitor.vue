/**
 * 班长监控控制台 - 排队监控组件
 * @description 实时显示排队监控数据
 * @version 1.0.0
 */

<template>
  <div class="queue-monitor">
    <!-- 核心数据面板 -->
    <div class="data-cards">
      <div class="data-card waiting" @click="handleCardClick('waiting')">
        <div class="card-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value" :class="{ 'value-changed': valueChanged.has('waiting') }">
            {{ animatedWaiting }}
          </div>
          <div class="card-label">当前排队总人数</div>
        </div>
      </div>

      <div class="data-card queues" @click="handleCardClick('queues')">
        <div class="card-icon">
          <el-icon><List /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value" :class="{ 'value-changed': valueChanged.has('queues') }">
            {{ animatedActiveQueues }}
          </div>
          <div class="card-label">活跃队列数</div>
        </div>
      </div>

      <div class="data-card avg-wait" @click="handleCardClick('avgWait')">
        <div class="card-icon">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value" :class="{ 'value-changed': valueChanged.has('avgWait') }">
            {{ formatDuration(queueData.avgWaitTime) }}
          </div>
          <div class="card-label">平均等待时长</div>
        </div>
      </div>
    </div>

    <!-- 队列列表弹窗 -->
    <el-dialog
      v-model="showQueueList"
      title="活跃队列详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="activeQueueList.length > 0" class="queue-list">
        <div
          v-for="queue in displayedQueues"
          :key="queue.id"
          class="queue-item"
        >
          <div class="queue-info">
            <span class="queue-name">{{ queue.name }}</span>
            <el-tag
              :type="queue.waitingCount > 0 ? 'warning' : 'success'"
              size="small"
            >
              {{ queue.waitingCount }} 人排队
            </el-tag>
          </div>
          <div class="queue-stats">
            <span class="wait-time">
              最长等待: {{ formatDuration(queue.maxWaitTime) }}
            </span>
            <span class="capacity">
              容量: {{ queue.maxCapacity }}
            </span>
          </div>
        </div>

        <div v-if="hasMoreQueues" class="more-queues">
          <el-button
            link
            type="primary"
            @click="showAllQueues = !showAllQueues"
          >
            {{ showAllQueues ? '收起' : '查看更多' }}
            <el-icon>
              <ArrowDown v-if="!showAllQueues" />
              <ArrowUp v-else />
            </el-icon>
          </el-button>
        </div>
      </div>

      <el-empty
        v-else
        description="当前无活跃队列"
        :image-size="80"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { UserFilled, List, Timer, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { QueueMonitorData, QueueInfo } from '../types'
import * as api from '../mock'

interface Props {
  queueData: QueueMonitorData
}

const props = defineProps<Props>()

// ==================== 响应式数据 ====================
const showQueueList = ref(false)
const showAllQueues = ref(false)
const animatedWaiting = ref(props.queueData.totalWaiting)
const animatedActiveQueues = ref(props.queueData.activeQueues)
const valueChanged = ref<Set<string>>(new Set())

// ==================== 计算属性 ====================
const activeQueueList = computed(() => {
  return props.queueData.queueList.filter(q => q.waitingCount > 0)
})

const displayedQueues = computed(() => {
  if (showAllQueues.value) {
    return activeQueueList.value
  }
  return activeQueueList.value.slice(0, 10)
})

const hasMoreQueues = computed(() => {
  return activeQueueList.value.length > 10
})

// ==================== 方法 ====================
const formatDuration = (seconds: number): string => {
  if (seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const animateValue = (target: number, current: Ref<number>, key: string) => {
  const diff = target - current.value
  if (diff === 0) return

  const steps = 10
  const stepValue = diff / steps
  let step = 0

  valueChanged.value.add(key)

  const timer = setInterval(() => {
    step++
    current.value = Math.round(current.value + stepValue)

    if (step >= steps) {
      current.value = target
      clearInterval(timer)
      setTimeout(() => {
        valueChanged.value.delete(key)
      }, 500)
    }
  }, 50)
}

const handleCardClick = (type: string) => {
  if (type === 'queues') {
    showQueueList.value = true

    // 记录操作日志
    api.logOperation({
      operator: api.currentUser.name,
      operationType: 'expand',
      operationContent: '查看活跃队列详情',
      ipAddress: '127.0.0.1'
    })
  }
}

// ==================== 监听数据变化 ====================
watch(() => props.queueData.totalWaiting, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    animateValue(newVal, animatedWaiting, 'waiting')
  }
})

watch(() => props.queueData.activeQueues, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    animateValue(newVal, animatedActiveQueues, 'queues')
  }
})
</script>

<style scoped lang="scss">
.queue-monitor {
  .data-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    .data-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.waiting {
        background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
        border-left: 4px solid #f56c6c;

        .card-icon {
          background: #f56c6c;
        }

        .card-value {
          color: #f56c6c;
        }
      }

      &.queues {
        background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
        border-left: 4px solid #409eff;

        .card-icon {
          background: #409eff;
        }

        .card-value {
          color: #409eff;
        }
      }

      &.avg-wait {
        background: linear-gradient(135deg, #fffbe6 0%, #fff4d9 100%);
        border-left: 4px solid #e6a23c;

        .card-icon {
          background: #e6a23c;
        }

        .card-value {
          color: #e6a23c;
        }
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24px;
      }

      .card-content {
        flex: 1;

        .card-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
          transition: all 0.3s;

          &.value-changed {
            animation: valuePulse 0.5s ease-in-out;
          }
        }

        .card-label {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}

.queue-list {
  .queue-item {
    padding: 16px;
    border-bottom: 1px solid #ebeef5;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .queue-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .queue-name {
        font-size: 15px;
        font-weight: 500;
        color: #303133;
      }
    }

    .queue-stats {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #909399;

      .wait-time {
        color: #e6a23c;
      }
    }
  }

  .more-queues {
    text-align: center;
    padding: 12px;
    border-top: 1px solid #ebeef5;
  }
}

@keyframes valuePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
