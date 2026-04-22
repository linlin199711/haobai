/**
 * 话务条设置 - 话务员选择弹窗
 * @description 强插/监听操作的话务员选择弹窗
 * @version 1.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="700px"
    :close-on-click-modal="false"
    destroy-on-close
    class="agent-select-dialog"
  >
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入工号或姓名搜索"
        clearable
        @input="handleSearch"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 话务员列表 -->
    <div class="agent-list-section">
      <el-table
        :data="filteredAgents"
        stripe
        highlight-current-row
        @current-change="handleSelect"
        class="agent-table"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="name" label="话务员姓名" width="120" />
        <el-table-column prop="employeeNo" label="工号" width="100" />
        <el-table-column prop="currentCallNumber" label="当前通话号码" width="140">
          <template #default="{ row }">
            <span>{{ row.currentCallNumber || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="callDuration" label="通话时长" width="100">
          <template #default="{ row }">
            <span v-if="row.callDuration > 0" class="duration-text">
              {{ formatDuration(row.callDuration) }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
              effect="dark"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="filteredAgents.length === 0 && !loading"
        description="暂无通话中的话务员"
        class="empty-state"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          :type="confirmButtonType"
          :disabled="!selectedAgent || loading"
          :loading="confirmLoading"
          @click="handleConfirm"
        >
          {{ confirmButtonText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { AgentInfo, OperationType } from '../types'
import * as api from '../mock'

interface Props {
  modelValue: boolean
  operationType: OperationType
  cityCode: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', agent: AgentInfo): void
  (e: 'cancel'): void
}>()

// ==================== 响应式数据 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const searchKeyword = ref('')
const agents = ref<AgentInfo[]>([])
const filteredAgents = ref<AgentInfo[]>([])
const selectedAgent = ref<AgentInfo | null>(null)
const loading = ref(false)
const confirmLoading = ref(false)

// ==================== 计算属性 ====================
const dialogTitle = computed(() => {
  return props.operationType === 'forceInsert' ? '选择目标话务员 - 强插' : '选择目标话务员 - 监听'
})

const confirmButtonText = computed(() => {
  return props.operationType === 'forceInsert' ? '确认强插' : '确认监听'
})

const confirmButtonType = computed(() => {
  return props.operationType === 'forceInsert' ? 'danger' : 'primary'
})

// ==================== 方法 ====================
// 格式化通话时长
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    talking: 'success',
    idle: 'info',
    busy: 'warning',
    offline: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    talking: '通话中',
    idle: '空闲',
    busy: '示忙',
    offline: '离线'
  }
  return textMap[status] || status
}

// 加载话务员列表
const loadAgents = async () => {
  loading.value = true
  try {
    const res = await api.getTalkingAgents(props.cityCode)
    if (res.success) {
      agents.value = res.data
      filteredAgents.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载话务员列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索过滤
const handleSearch = () => {
  if (!searchKeyword.value) {
    filteredAgents.value = agents.value
    return
  }
  const keyword = searchKeyword.value.toLowerCase()
  filteredAgents.value = agents.value.filter(agent =>
    agent.name.toLowerCase().includes(keyword) ||
    agent.employeeNo.toLowerCase().includes(keyword)
  )
}

// 选择话务员
const handleSelect = (row: AgentInfo) => {
  selectedAgent.value = row
}

// 取消
const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

// 确认
const handleConfirm = async () => {
  if (!selectedAgent.value) return

  const actionText = props.operationType === 'forceInsert' ? '强插' : '监听'
  const confirmText = props.operationType === 'forceInsert'
    ? `确定要强插话务员【${selectedAgent.value.name}】的通话吗？这将加入三方通话。`
    : `确定要监听话务员【${selectedAgent.value.name}】的通话吗？这将建立单向监听。`

  try {
    await ElMessageBox.confirm(confirmText, '二次确认', {
      confirmButtonText: `确认${actionText}`,
      cancelButtonText: '取消',
      type: props.operationType === 'forceInsert' ? 'warning' : 'info'
    })

    confirmLoading.value = true

    if (props.operationType === 'forceInsert') {
      const res = await api.forceInsert(selectedAgent.value.id)
      if (res.success) {
        ElMessage.success(res.message)
        emit('confirm', selectedAgent.value)
        visible.value = false
      }
    } else {
      const res = await api.monitorCall(selectedAgent.value.id)
      if (res.success) {
        ElMessage.success(res.message)
        emit('confirm', selectedAgent.value)
        visible.value = false
      }
    }
  } catch (error) {
    // 用户取消或操作失败
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  } finally {
    confirmLoading.value = false
  }
}

// ==================== 监听 ====================
watch(() => props.modelValue, (val) => {
  if (val) {
    // 打开弹窗时重置
    searchKeyword.value = ''
    selectedAgent.value = null
    loadAgents()
  }
})
</script>

<style scoped lang="scss">
.agent-select-dialog {
  .search-section {
    margin-bottom: 16px;

    .search-input {
      width: 100%;
    }
  }

  .agent-list-section {
    max-height: 400px;
    overflow-y: auto;

    .agent-table {
      .duration-text {
        color: #409eff;
        font-weight: 500;
      }
    }

    .empty-state {
      padding: 40px 0;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
