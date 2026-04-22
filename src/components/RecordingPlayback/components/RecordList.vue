/**
 * 录音回放模块 - 录音列表组件
 * @description 录音列表展示组件
 * @version 1.0.0
 */

<template>
  <div class="record-list">
    <!-- 列表表格 -->
    <el-table
      :data="records"
      stripe
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      class="record-table"
      row-key="id"
      :row-class-name="getRowClassName"
    >
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column prop="agentNo" label="工号" width="90" />
      <el-table-column prop="callTime" label="时间" width="150" />
      <el-table-column prop="callerNumber" label="对方号码" width="120" />
      <el-table-column prop="businessKey" label="业务键" width="140" show-overflow-tooltip />
      <el-table-column prop="duration" label="录音时长" width="90">
        <template #default="{ row }">
          <span>{{ formatDuration(row.duration) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="voiceDesc" label="语音描述" min-width="120" show-overflow-tooltip />
      <el-table-column prop="satisfaction" label="满意度" width="80">
        <template #default="{ row }">
          <el-tag
            :type="getSatisfactionType(row.satisfaction)"
            size="small"
            effect="plain"
          >
            {{ getSatisfactionLabel(row.satisfaction) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serialNo" label="流水号" width="140" show-overflow-tooltip />
      <el-table-column prop="seatNumber" label="座席号码" width="90" />
      <el-table-column prop="fileName" label="录音文件名" min-width="180" show-overflow-tooltip />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            size="small"
            :icon="VideoPlay"
            @click.stop="handlePlay(row)"
          >
            播放
          </el-button>
          <el-button
            type="success"
            link
            size="small"
            :icon="Download"
            @click.stop="handleDownloadSingle(row)"
          >
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页控件 -->
    <div class="table-footer">
      <div class="selection-info">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          全选/反选
        </el-checkbox>
        <span class="selected-count">已选择 <strong>{{ selectedCount }}</strong> 条</span>
      </div>
      <div class="pagination-controls">
        <el-button
          :icon="ArrowLeft"
          :disabled="currentPage <= 1"
          @click="handlePrevPage"
        >
          上一页
        </el-button>
        <span class="page-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <el-button
          :icon="ArrowRight"
          :disabled="currentPage >= totalPages"
          @click="handleNextPage"
        >
          下一页
        </el-button>
        <el-input-number
          v-model="jumpPage"
          :min="1"
          :max="totalPages || 1"
          :controls="false"
          class="jump-input"
          @keyup.enter="handleJumpPage"
        />
        <el-button type="primary" @click="handleJumpPage">跳页</el-button>
      </div>
      <div class="page-size-selector">
        <span>每页</span>
        <el-select v-model="localPageSize" @change="handlePageSizeChange" class="size-select">
          <el-option label="10" :value="10" />
          <el-option label="20" :value="20" />
          <el-option label="50" :value="50" />
          <el-option label="100" :value="100" />
        </el-select>
        <span>条</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VideoPlay, Download, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { RecordingRecord } from '../types'

interface Props {
  records: RecordingRecord[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentPage: 1,
  totalPages: 1,
  pageSize: 36
})

const emit = defineEmits<{
  (e: 'row-click', record: RecordingRecord): void
  (e: 'play', record: RecordingRecord): void
  (e: 'download', ids: string[]): void
  (e: 'selection-change', selection: RecordingRecord[]): void
  (e: 'page-change', page: number): void
  (e: 'page-size-change', size: number): void
}>()

// ==================== 响应式数据 ====================
const selectedRecords = ref<RecordingRecord[]>([])
const jumpPage = ref(1)
const localPageSize = ref(props.pageSize)

// ==================== 计算属性 ====================
const selectedCount = computed(() => selectedRecords.value.length)

const isAllSelected = computed({
  get: () => {
    if (props.records.length === 0) return false
    return selectedRecords.value.length === props.records.length
  },
  set: (val) => {
    // 由handleSelectAll处理
  }
})

const isIndeterminate = computed(() => {
  return selectedRecords.value.length > 0 && selectedRecords.value.length < props.records.length
})

// ==================== 方法 ====================
// 格式化时长
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

// 获取满意度标签类型
const getSatisfactionType = (satisfaction: string): string => {
  const typeMap: Record<string, string> = {
    '5': 'success',
    '4': 'success',
    '3': 'warning',
    '2': 'danger',
    '1': 'danger'
  }
  return typeMap[satisfaction] || 'info'
}

// 获取满意度标签文字
const getSatisfactionLabel = (satisfaction: string): string => {
  const labelMap: Record<string, string> = {
    '5': '非常满意',
    '4': '满意',
    '3': '一般',
    '2': '不满意',
    '1': '非常不满意'
  }
  return labelMap[satisfaction] || '未知'
}

// 获取行类名
const getRowClassName = ({ row }: { row: RecordingRecord }) => {
  const isSelected = selectedRecords.value.some(r => r.id === row.id)
  return isSelected ? 'selected-row' : ''
}

// 行点击
const handleRowClick = (row: RecordingRecord) => {
  emit('row-click', row)
}

// 播放
const handlePlay = (row: RecordingRecord) => {
  emit('play', row)
}

// 单条下载
const handleDownloadSingle = (row: RecordingRecord) => {
  emit('download', [row.id])
  ElMessage.success(`开始下载录音: ${row.fileName}`)
}

// 选择变化
const handleSelectionChange = (selection: RecordingRecord[]) => {
  selectedRecords.value = selection
  emit('selection-change', selection)
}

// 全选/反选
const handleSelectAll = (val: boolean) => {
  // 这里通过el-table的toggleAllSelection实现
  // 实际逻辑由父组件处理
  if (val) {
    selectedRecords.value = [...props.records]
  } else {
    selectedRecords.value = []
  }
  emit('selection-change', selectedRecords.value)
}

// 上一页
const handlePrevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

// 下一页
const handleNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}

// 跳页
const handleJumpPage = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= props.totalPages) {
    emit('page-change', jumpPage.value)
  } else {
    ElMessage.warning('请输入有效的页码')
  }
}

// 每页条数变化
const handlePageSizeChange = (size: number) => {
  localPageSize.value = size
  emit('page-size-change', size)
}

// ==================== 监听 ====================
watch(() => props.pageSize, (newVal) => {
  localPageSize.value = newVal
})

// 暴露方法
defineExpose({
  getSelectedRecords: () => selectedRecords.value,
  clearSelection: () => {
    selectedRecords.value = []
  }
})
</script>

<style scoped lang="scss">
.record-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .record-table {
    :deep(.el-table__header) {
      th {
        background-color: #f5f7fa;
        color: #303133;
        font-weight: 600;
        font-size: 13px;
        padding: 12px 0;
      }
    }

    :deep(.el-table__row) {
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa !important;
      }

      &.selected-row {
        background-color: #ecf5ff !important;
      }

      &.current-row {
        background-color: #e6f7ff !important;
      }
    }

    :deep(.el-tag) {
      font-size: 12px;
    }
  }

  .table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid #e4e7ed;
    background: #fafafa;

    .selection-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .selected-count {
        font-size: 13px;
        color: #606266;

        strong {
          color: #409eff;
          font-size: 14px;
        }
      }
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;

      .page-info {
        font-size: 13px;
        color: #606266;
        padding: 0 8px;
      }

      .jump-input {
        width: 60px;
      }
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #606266;

      .size-select {
        width: 70px;
      }
    }
  }
}
</style>
