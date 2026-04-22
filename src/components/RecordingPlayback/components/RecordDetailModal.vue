/**
 * 录音详情模块 - 操作记录详情弹窗
 * @description 展示录音通话过程中的全链路操作记录
 * @version 1.0.0
 */

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="record-detail-modal" @click.self="handleClose">
        <!-- 遮罩层 -->
        <div class="modal-overlay"></div>
        
        <!-- 弹窗内容 -->
        <div class="modal-container">
          <!-- 顶部蓝色栏 -->
          <div class="modal-header">
            <div class="header-left">
              <div class="logo">
                <el-icon size="24" color="#fff"><Phone /></el-icon>
                <span class="logo-text">呼叫中心</span>
              </div>
            </div>
            <div class="header-right">
              <span class="serial-label">通话流水号：</span>
              <span class="serial-number">{{ serialNo }}</span>
            </div>
            <button class="close-btn" @click="handleClose">
              <el-icon size="20"><Close /></el-icon>
            </button>
          </div>

          <!-- 表格区域 -->
          <div class="modal-body">
            <div v-if="loading" class="loading-wrapper">
              <el-skeleton :rows="6" animated />
            </div>
            
            <div v-else-if="error" class="error-wrapper">
              <el-empty :description="error" />
            </div>
            
            <div v-else class="table-wrapper">
              <el-table
                ref="tableRef"
                :data="operationRecords"
                stripe
                border
                highlight-current-row
                @row-click="handleRowClick"
                @current-change="handleCurrentChange"
                class="operation-table"
                row-key="id"
                :row-class-name="getRowClassName"
              >
                <el-table-column
                  prop="businessType"
                  label="业务类型"
                  width="120"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-tag 
                      :type="getBusinessTypeTagType(row.businessType)"
                      size="small"
                      effect="light"
                    >
                      {{ row.businessType }}
                    </el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="businessContent"
                  label="业务内容"
                  min-width="150"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span 
                      class="link-text"
                      @click.stop="handleViewBusinessDetail(row)"
                    >
                      {{ row.businessContent }}
                    </span>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="operatorActionType"
                  label="话务员操作类型"
                  width="130"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-tag
                      :type="getActionTypeTagType(row.operatorActionType)"
                      size="small"
                      effect="plain"
                    >
                      {{ row.operatorActionType }}
                    </el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="broadcastNumber"
                  label="播放号码"
                  width="120"
                  align="center"
                >
                  <template #default="{ row }">
                    <span 
                      v-if="row.broadcastNumber !== '--'"
                      class="link-text"
                      @click.stop="handleCopyNumber(row.broadcastNumber)"
                    >
                      {{ row.broadcastNumber }}
                    </span>
                    <span v-else class="empty-text">--</span>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="companyName"
                  label="公司名称"
                  min-width="150"
                  show-overflow-tooltip
                  align="center"
                />
                
                <el-table-column
                  prop="playType"
                  label="播放类型"
                  width="100"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-tag
                      :type="getPlayTypeTagType(row.playType)"
                      size="small"
                    >
                      {{ row.playType }}
                    </el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column
                  prop="formattedTime"
                  label="操作时间"
                  width="90"
                  align="center"
                  fixed="right"
                >
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click.stop="handleSeekToTime(row.operationTime)"
                    >
                      {{ row.formattedTime }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 底部信息栏 -->
          <div class="modal-footer">
            <div class="footer-left">
              <span class="info-item">
                <el-icon><User /></el-icon>
                话务员：{{ agentName }}({{ agentNo }})
              </span>
              <span class="info-item">
                <el-icon><Clock /></el-icon>
                通话时长：{{ formatDuration(duration) }}
              </span>
              <span class="info-item">
                <el-icon><Document /></el-icon>
                操作记录：{{ operationRecords.length }} 条
              </span>
            </div>
            <div class="footer-right">
              <el-button @click="handleClose">关闭</el-button>
              <el-button type="primary" :icon="VideoPlay" @click="handlePlayRecord">
                播放录音
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Phone,
  Close,
  User,
  Clock,
  Document,
  VideoPlay
} from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import type { OperationRecord, PermissionConfig } from '../types/recordDetail'
import {
  getOperationRecords,
  currentUser,
  formatTime,
  logOperation
} from '../mock/recordDetailMock'

// ==================== Props & Emits ====================
interface Props {
  /** 是否显示弹窗 */
  modelValue: boolean
  /** 录音ID */
  recordId: string
  /** 通话流水号 */
  serialNo: string
  /** 录音时长（秒） */
  duration: number
  /** 话务员工号 */
  agentNo: string
  /** 话务员姓名 */
  agentName: string
  /** 当前播放时间（用于联动） */
  currentPlayTime?: number
  /** 权限配置 */
  permission?: PermissionConfig
}

const props = withDefaults(defineProps<Props>(), {
  currentPlayTime: 0,
  permission: () => currentUser
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'seek', time: number): void
  (e: 'play'): void
  (e: 'viewBusinessDetail', record: OperationRecord): void
}>()

// ==================== 响应式数据 ====================
const tableRef = ref<TableInstance>()
const loading = ref(false)
const error = ref('')
const operationRecords = ref<OperationRecord[]>([])
const currentRow = ref<OperationRecord | null>(null)
const selectedRowId = ref<string>('')

// ==================== 计算属性 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// ==================== 方法 ====================

/**
 * 加载操作记录数据
 */
const loadOperationRecords = async () => {
  if (!props.recordId) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await getOperationRecords(props.recordId, props.permission)
    
    if (res.success) {
      operationRecords.value = res.data
      logOperation('view', `查看录音详情操作记录: ${props.serialNo}`)
    } else {
      error.value = res.message || '加载失败'
      ElMessage.error(error.value)
    }
  } catch (err) {
    error.value = '网络错误，请稍后重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

/**
 * 获取业务类型标签样式
 */
const getBusinessTypeTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    '号码查询台': 'primary',
    '挪车登记': 'success',
    '号码本地搜': 'warning',
    '总机3.0': 'danger',
    '非号码查询': 'info'
  }
  return typeMap[type] || 'info'
}

/**
 * 获取操作类型标签样式
 */
const getActionTypeTagType = (action: string): string => {
  const actionMap: Record<string, string> = {
    '查询': 'primary',
    '挂断报号': 'success',
    '登记': 'warning',
    '转接': 'danger',
    '拍号': 'info',
    '报号': ''
  }
  return actionMap[action] || ''
}

/**
 * 获取播放类型标签样式
 */
const getPlayTypeTagType = (playType: string): string => {
  const typeMap: Record<string, string> = {
    '语音播报': 'primary',
    '短信通知': 'success',
    '直拨': 'warning'
  }
  return typeMap[playType] || 'info'
}

/**
 * 获取行类名
 */
const getRowClassName = ({ row }: { row: OperationRecord }): string => {
  if (selectedRowId.value === row.id) {
    return 'selected-row'
  }
  return ''
}

/**
 * 格式化时长
 */
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

/**
 * 处理行点击
 */
const handleRowClick = (row: OperationRecord) => {
  selectedRowId.value = row.id
  currentRow.value = row
}

/**
 * 处理当前行变化
 */
const handleCurrentChange = (row: OperationRecord | undefined) => {
  if (row) {
    currentRow.value = row
  }
}

/**
 * 跳转到指定时间播放
 */
const handleSeekToTime = (time: number) => {
  emit('seek', time)
  ElMessage.success(`已跳转至 ${formatTime(time)}`)
  
  // 高亮对应行
  const record = operationRecords.value.find(r => r.operationTime === time)
  if (record) {
    selectedRowId.value = record.id
    tableRef.value?.setCurrentRow(record)
  }
}

/**
 * 查看业务详情
 */
const handleViewBusinessDetail = (row: OperationRecord) => {
  if (row.businessDetail) {
    emit('viewBusinessDetail', row)
    logOperation('click', `查看业务详情: ${row.businessType} - ${row.businessContent}`)
  } else {
    ElMessage.info('暂无业务详情')
  }
}

/**
 * 复制号码
 */
const handleCopyNumber = (number: string) => {
  navigator.clipboard.writeText(number).then(() => {
    ElMessage.success('号码已复制')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

/**
 * 播放录音
 */
const handlePlayRecord = () => {
  emit('play')
  logOperation('play', `播放录音: ${props.serialNo}`)
}

/**
 * 关闭弹窗
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
    loadOperationRecords()
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
    selectedRowId.value = ''
    currentRow.value = null
  }
})

watch(() => props.currentPlayTime, (newTime) => {
  if (!newTime || !operationRecords.value.length) return
  
  // 找到当前播放时间对应的操作记录
  const currentRecord = operationRecords.value
    .filter(r => r.operationTime <= newTime)
    .sort((a, b) => b.operationTime - a.operationTime)[0]
  
  if (currentRecord && selectedRowId.value !== currentRecord.id) {
    selectedRowId.value = currentRecord.id
    tableRef.value?.setCurrentRow(currentRecord)
  }
})

// ==================== 生命周期 ====================
onMounted(() => {
  if (visible.value) {
    loadOperationRecords()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// ==================== 暴露方法 ====================
defineExpose({
  refresh: loadOperationRecords,
  seekToTime: handleSeekToTime
})
</script>

<style scoped lang="scss">
// 变量定义
$primary-blue: #409eff;
$header-bg: linear-gradient(135deg, #1a5fb4 0%, #3584e4 100%);
$border-color: #dcdfe6;
$text-primary: #303133;
$text-secondary: #606266;
$text-muted: #909399;
$bg-hover: #f5f7fa;
$bg-selected: #ecf5ff;

// 遮罩层
.record-detail-modal {
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
  width: 90%;
  max-width: 1200px;
  max-height: 85vh;
  background: #fff;
  border-radius: 8px;
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

// 顶部栏
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: $header-bg;
  color: #fff;

  .header-left {
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 1px;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    .serial-label {
      opacity: 0.9;
    }

    .serial-number {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      font-size: 15px;
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 12px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
  }

  .close-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

// 内容区域
.modal-body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  background: #f5f7fa;

  .loading-wrapper,
  .error-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 8px;
  }

  .table-wrapper {
    height: 100%;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}

// 表格样式
.operation-table {
  height: 100%;

  :deep(.el-table__header) {
    th {
      background-color: #f5f7fa;
      color: $text-primary;
      font-weight: 600;
      font-size: 13px;
      padding: 14px 0;
      border-bottom: 2px solid $border-color;

      .cell {
        line-height: 1.4;
      }
    }
  }

  :deep(.el-table__row) {
    cursor: pointer;
    transition: all 0.2s;

    td {
      padding: 12px 0;
      font-size: 13px;
    }

    &:hover {
      background-color: $bg-hover !important;
    }

    &.selected-row,
    &.current-row {
      background-color: $bg-selected !important;

      td {
        font-weight: 500;
      }
    }
  }

  // 链接文字样式
  .link-text {
    color: $primary-blue;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: darken($primary-blue, 10%);
    }
  }

  .empty-text {
    color: $text-muted;
  }
}

// 底部栏
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid $border-color;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 24px;

    .info-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: $text-secondary;

      .el-icon {
        color: $primary-blue;
      }
    }
  }

  .footer-right {
    display: flex;
    gap: 12px;
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

// 响应式适配
@media screen and (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header {
    padding: 0 16px;
    height: 48px;

    .header-left .logo .logo-text {
      font-size: 16px;
    }

    .header-right {
      font-size: 12px;

      .serial-number {
        font-size: 13px;
        padding: 2px 8px;
      }
    }
  }

  .modal-body {
    padding: 12px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;

    .footer-left {
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
  }
}
</style>
