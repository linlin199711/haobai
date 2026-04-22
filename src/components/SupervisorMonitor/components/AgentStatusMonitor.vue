/**
 * 班长监控控制台 - 坐席状态监控组件
 * @description 实时显示坐席状态列表和统计
 * @version 1.0.0
 */

<template>
  <div class="agent-status-monitor">
    <!-- 区域标题和统计 -->
    <div class="monitor-header">
      <div class="title-section">
        <el-icon><User /></el-icon>
        <span class="title">坐席实时状态</span>
      </div>
      
      <!-- 状态筛选 -->
      <el-select
        v-model="filterStatus"
        placeholder="筛选状态"
        clearable
        class="status-filter"
        @change="handleFilterChange"
      >
        <el-option label="全部" value="" />
        <el-option label="在线" value="online" />
        <el-option label="忙碌" value="busy" />
        <el-option label="空闲" value="idle" />
        <el-option label="离线" value="offline" />
      </el-select>
    </div>

    <!-- 统计数据 -->
    <div class="stats-cards">
      <div class="stat-card total">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总坐席</div>
      </div>
      <div class="stat-card online">
        <div class="stat-value">{{ stats.online }}</div>
        <div class="stat-label">在线</div>
      </div>
      <div class="stat-card busy">
        <div class="stat-value">{{ stats.busy }}</div>
        <div class="stat-label">忙碌</div>
      </div>
      <div class="stat-card idle">
        <div class="stat-value">{{ stats.idle }}</div>
        <div class="stat-label">空闲</div>
      </div>
      <div class="stat-card offline">
        <div class="stat-value">{{ stats.offline }}</div>
        <div class="stat-label">离线</div>
      </div>
    </div>

    <!-- 坐席列表表格 -->
    <div class="agent-table-wrapper">
      <el-table
        :data="paginatedAgents"
        stripe
        highlight-current-row
        @row-click="handleRowClick"
        v-loading="loading"
        class="agent-table"
        row-key="id"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="agent-detail">
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">工号：</span>
                  <span class="detail-value">{{ row.employeeNo || row.agentNo || '--' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">姓名：</span>
                  <span class="detail-value">{{ row.name || '--' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">签入时间：</span>
                  <span class="detail-value">{{ row.loginTime || '--' }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">登录次数：</span>
                  <span class="detail-value">{{ row.loginTimes || 0 }} 次</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">示忙时间：</span>
                  <span class="detail-value">{{ row.busyStartTime || '--' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">示忙时长：</span>
                  <span class="detail-value">{{ formatBusyDuration(row.busyDuration) }}</span>
                </div>
              </div>
              <div class="detail-item" v-if="row.isAbnormal">
                <span class="detail-label">异常状态：</span>
                <el-tag type="danger" size="small">离线未报备</el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="agentNo" label="坐席编号" width="100" />
        <el-table-column prop="name" label="坐席姓名" width="100" />
        <el-table-column prop="status" label="实时状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              :effect="row.isAbnormal ? 'dark' : 'light'"
              :class="{ 'is-flashing': row.isAbnormal, 'status-changed': recentlyChanged.has(row.id) }"
              size="small"
            >
              <el-icon v-if="row.status === 'online'"><CircleCheck /></el-icon>
              <el-icon v-else-if="row.status === 'busy'"><Phone /></el-icon>
              <el-icon v-else-if="row.status === 'idle'"><Timer /></el-icon>
              <el-icon v-else><CircleClose /></el-icon>
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="queueName" label="所属队列" show-overflow-tooltip />
        <el-table-column prop="lastUpdateTime" label="最后更新" width="150">
          <template #default="{ row }">
            <span class="update-time">{{ formatTime(row.lastUpdateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[15, 30, 50]"
          :total="filteredAgents.length"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { User, CircleCheck, Phone, Timer, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { AgentInfo, AgentStatusStats, AgentStatus } from '../types'
import * as api from '../mock'

interface Props {
  agents: AgentInfo[]
  stats: AgentStatusStats
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'filter-change', status: string): void
  (e: 'row-click', agent: AgentInfo): void
}>()

// ==================== 响应式数据 ====================
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const recentlyChanged = ref<Set<string>>(new Set())

// ==================== 计算属性 ====================
const filteredAgents = computed(() => {
  if (!filterStatus.value) {
    return props.agents
  }
  return props.agents.filter(agent => agent.status === filterStatus.value)
})

const paginatedAgents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAgents.value.slice(start, end)
})

// ==================== 方法 ====================
const getStatusType = (status: AgentStatus): string => {
  const typeMap: Record<AgentStatus, string> = {
    online: 'success',
    busy: 'warning',
    idle: 'info',
    offline: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: AgentStatus): string => {
  const textMap: Record<AgentStatus, string> = {
    online: '在线',
    busy: '忙碌',
    idle: '空闲',
    offline: '离线'
  }
  return textMap[status] || status
}

const formatTime = (timeStr: string): string => {
  if (!timeStr || timeStr === '-') return '--'
  const date = new Date(timeStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return timeStr.split(' ')[1] || timeStr
}

const formatBusyDuration = (seconds: number | undefined): string => {
  if (!seconds || seconds <= 0) return '--'
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) {
    return `${hours}小时${mins}分${secs}秒`
  } else if (mins > 0) {
    return `${mins}分${secs}秒`
  } else {
    return `${secs}秒`
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  emit('filter-change', filterStatus.value)
  
  // 记录操作日志
  api.logOperation({
    operator: api.currentUser.name,
    operationType: 'filter',
    operationContent: `筛选坐席状态: ${filterStatus.value || '全部'}`,
    ipAddress: '127.0.0.1'
  })
}

const handleRowClick = (row: AgentInfo) => {
  emit('row-click', row)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// ==================== 监听状态变化 ====================
watch(() => props.agents, (newAgents, oldAgents) => {
  if (!oldAgents || oldAgents.length === 0) return
  
  // 检测状态变化的坐席
  const changed = new Set<string>()
  newAgents.forEach(newAgent => {
    const oldAgent = oldAgents.find(a => a.id === newAgent.id)
    if (oldAgent && oldAgent.status !== newAgent.status) {
      changed.add(newAgent.id)
    }
  })
  
  if (changed.size > 0) {
    recentlyChanged.value = changed
    
    // 3秒后移除闪烁效果
    setTimeout(() => {
      recentlyChanged.value = new Set()
    }, 3000)
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.agent-status-monitor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title-section {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 18px;
        color: #409eff;
      }

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .status-filter {
      width: 120px;
    }
  }

  .stats-cards {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .stat-card {
      flex: 1;
      text-align: center;
      padding: 12px 8px;
      border-radius: 8px;
      background: #f5f7fa;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.total {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        .stat-value { color: #1976d2; }
      }

      &.online {
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        .stat-value { color: #388e3c; }
      }

      &.busy {
        background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
        .stat-value { color: #f57c00; }
      }

      &.idle {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        .stat-value { color: #1976d2; }
      }

      &.offline {
        background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
        .stat-value { color: #616161; }
      }

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .agent-table-wrapper {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .agent-table {
      flex: 1;

      :deep(.el-table__row) {
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f5f7fa !important;
        }

        &.current-row {
          background-color: #ecf5ff !important;
        }
      }

      .el-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;

        &.is-flashing {
          animation: flash 1s infinite;
        }

        &.status-changed {
          animation: pulse 0.5s ease-in-out 3;
        }
      }

      .update-time {
        color: #909399;
        font-size: 12px;
      }
    }

    .agent-detail {
      padding: 16px 24px;
      background: #f5f7fa;
      border-radius: 4px;

      .detail-row {
        display: flex;
        gap: 40px;
        margin-bottom: 12px;

        &:last-of-type {
          margin-bottom: 8px;
        }
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;

        &:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          color: #606266;
          font-size: 13px;
          white-space: nowrap;
        }

        .detail-value {
          color: #303133;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }
      }
    }

    .pagination-wrapper {
      margin-top: 12px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
