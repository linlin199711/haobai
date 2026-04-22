/**
 * 班长监控控制台 - 主组件
 * @description 呼叫中心班长监控控制台，包含坐席状态监控、排队监控、时间统计
 * @version 1.0.0
 */

<template>
  <div class="supervisor-monitor-container">
    <!-- 顶部标题栏 -->
    <div class="header-section">
      <div class="header-left">
        <el-icon class="header-icon"><Monitor /></el-icon>
        <h1 class="header-title">班长监控控制台</h1>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-icon><User /></el-icon>
          <span class="role-text">{{ userRoleText }}-{{ currentUser.name }}</span>
        </div>
        <el-button
          type="primary"
          :loading="refreshing"
          @click="handleRefresh"
          class="refresh-btn"
        >
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="main-content">
      <!-- 左侧：坐席状态监控 -->
      <div class="left-section">
        <AgentStatusMonitor
          :agents="agentList"
          :stats="agentStats"
          :loading="loading"
          @filter-change="handleFilterChange"
          @row-click="handleAgentClick"
        />
      </div>

      <!-- 右侧：排队监控 + 时间统计 -->
      <div class="right-section">
        <!-- 排队监控 -->
        <div class="queue-monitor-wrapper">
          <div class="section-header">
            <el-icon><Histogram /></el-icon>
            <span class="section-title">排队监控</span>
          </div>
          <QueueMonitor :queue-data="queueData" />
        </div>

        <!-- 时间统计 -->
        <div class="time-monitor-wrapper">
          <div class="section-header">
            <el-icon><Timer /></el-icon>
            <span class="section-title">时间指标</span>
          </div>
          <QueueFillTimeMonitor
            :fill-time-data="fillTimeData"
            :total-waiting="queueData.totalWaiting"
            :queue-capacity="100"
          />
        </div>
      </div>
    </div>

    <!-- 刷新中弹窗 -->
    <el-dialog
      v-model="showRefreshDialog"
      title="数据刷新中"
      width="300px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
    >
      <div class="refresh-content">
        <el-icon class="refresh-icon"><Loading /></el-icon>
        <p>正在刷新监控数据...</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Monitor, User, Refresh, Histogram, Timer, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AgentStatusMonitor from './components/AgentStatusMonitor.vue'
import QueueMonitor from './components/QueueMonitor.vue'
import QueueFillTimeMonitor from './components/QueueFillTimeMonitor.vue'
import type { AgentInfo, AgentStatusStats, QueueMonitorData, QueueFillTime, UserInfo } from './types'
import * as api from './mock'

// ==================== 响应式数据 ====================
const currentUser = ref<UserInfo>({ id: '', name: '', role: 'agent' })
const agentList = ref<AgentInfo[]>([])
const agentStats = ref<AgentStatusStats>({ total: 0, online: 0, busy: 0, idle: 0, offline: 0 })
const queueData = ref<QueueMonitorData>({ totalWaiting: 0, activeQueues: 0, avgWaitTime: 0, queueList: [] })
const fillTimeData = ref<QueueFillTime>({ isFull: false, fillDuration: 0, lastResetTime: '-' })
const loading = ref(false)
const refreshing = ref(false)
const showRefreshDialog = ref(false)

// 定时器
let autoRefreshTimer: number | null = null

// ==================== 计算属性 ====================
const userRoleText = computed(() => {
  const roleMap = { supervisor: '班长', admin: '管理员', agent: '坐席' }
  return roleMap[currentUser.value.role] || '未知'
})

// ==================== 方法 ====================
// 检查权限
const checkPermission = async () => {
  try {
    const res = await api.checkPermission()
    if (!res.data.hasPermission) {
      ElMessage.error('您没有权限访问此页面')
      return false
    }
    return true
  } catch (error) {
    ElMessage.error('权限检查失败')
    return false
  }
}

// 加载用户数据
const loadUserData = async () => {
  try {
    const res = await api.getCurrentUser()
    if (res.success) {
      currentUser.value = res.data
    }
  } catch (error) {
    console.error('加载用户信息失败', error)
  }
}

// 加载坐席数据
const loadAgentData = async () => {
  try {
    const [listRes, statsRes] = await Promise.all([
      api.getAgentList(),
      api.getAgentStats()
    ])

    if (listRes.success) {
      agentList.value = listRes.data
    }
    if (statsRes.success) {
      agentStats.value = statsRes.data
    }
  } catch (error) {
    console.error('加载坐席数据失败', error)
  }
}

// 加载排队数据
const loadQueueData = async () => {
  try {
    const res = await api.getQueueMonitorData()
    if (res.success) {
      queueData.value = res.data
    }
  } catch (error) {
    console.error('加载排队数据失败', error)
  }
}

// 加载时间数据
const loadFillTimeData = async () => {
  try {
    const res = await api.getQueueFillTime()
    if (res.success) {
      fillTimeData.value = res.data
    }
  } catch (error) {
    console.error('加载时间数据失败', error)
  }
}

// 加载所有数据
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadAgentData(),
      loadQueueData(),
      loadFillTimeData()
    ])
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const handleRefresh = async () => {
  refreshing.value = true
  showRefreshDialog.value = true

  // 记录操作日志
  await api.logOperation({
    operator: currentUser.value.name,
    operationType: 'refresh',
    operationContent: '手动刷新监控数据',
    ipAddress: '127.0.0.1'
  })

  try {
    await loadAllData()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('刷新失败')
  } finally {
    refreshing.value = false
    showRefreshDialog.value = false
  }
}

// 筛选变化
const handleFilterChange = (status: string) => {
  console.log('筛选状态:', status)
}

// 坐席点击
const handleAgentClick = (agent: AgentInfo) => {
  console.log('点击坐席:', agent)
}

// 自动刷新
const startAutoRefresh = () => {
  autoRefreshTimer = window.setInterval(async () => {
    await Promise.all([
      loadAgentData(),
      loadQueueData(),
      loadFillTimeData()
    ])
  }, 1000) // 每秒刷新
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

// ==================== 生命周期 ====================
onMounted(async () => {
  const hasPermission = await checkPermission()
  if (!hasPermission) return

  await loadUserData()
  await loadAllData()

  // 记录页面访问日志
  await api.logOperation({
    operator: currentUser.value.name,
    operationType: 'pageView',
    operationContent: '访问班长监控控制台',
    ipAddress: '127.0.0.1'
  })

  // 启动自动刷新
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="scss">
.supervisor-monitor-container {
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
        color: #00a8ff;
      }

      .header-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .user-info {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);

        .role-text {
          font-weight: 500;
        }
      }

      .refresh-btn {
        background: #00a8ff;
        border-color: #00a8ff;

        &:hover {
          background: #33b9ff;
          border-color: #33b9ff;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    gap: 16px;
    padding: 16px;
    overflow: hidden;

    .left-section {
      width: 40%;
      min-width: 500px;
      overflow: hidden;
    }

    .right-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: hidden;

      .queue-monitor-wrapper,
      .time-monitor-wrapper {
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;

          .el-icon {
            font-size: 18px;
            color: #409eff;
          }

          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .queue-monitor-wrapper {
        flex: 1;
      }

      .time-monitor-wrapper {
        flex: 0 0 auto;
      }
    }
  }
}

.refresh-content {
  text-align: center;
  padding: 20px;

  .refresh-icon {
    font-size: 40px;
    color: #409eff;
    animation: rotate 1s linear infinite;
  }

  p {
    margin-top: 16px;
    color: #606266;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
