/**
 * 录音回放模块 - 主组件
 * @description 呼叫中心录音回放功能主模块
 * @version 1.0.0
 */

<template>
  <div class="recording-playback-module">
    <!-- 左侧：查询条件区 -->
    <div class="left-section">
      <RecordQueryPanel
        ref="queryPanelRef"
        :loading="loading"
        :downloading="downloading"
        :total="pagination.total"
        :total-pages="pagination.totalPages"
        :current-page="pagination.page"
        @query="handleQuery"
        @modify="handleModify"
        @browse="handleBrowse"
        @filter="handleFilter"
        @reset="handleReset"
        @download="handleBatchDownload"
        @page-change="handlePageChange"
      />
    </div>

    <!-- 右侧：录音列表区 -->
    <div class="right-section">
      <RecordList
        ref="recordListRef"
        :records="recordList"
        :loading="loading"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :page-size="pagination.pageSize"
        @row-click="handleRowClick"
        @play="handlePlay"
        @download="handleDownload"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- 底部：播放控制区 -->
    <RecordPlayer
      :visible="showPlayer"
      :record="currentRecord"
      @close="handlePlayerClose"
      @play-state-change="handlePlayStateChange"
    />

    <!-- 原有详情弹窗 -->
    <RecordDetailDialog
      v-model="showDetailDialog"
      :record="currentRecord"
      @play="handleDetailPlay"
      @download="handleDetailDownload"
    />

    <!-- 新的操作记录详情弹窗 -->
    <RecordDetailModal
      v-model="showRecordDetailModal"
      :record-id="currentRecord?.id || ''"
      :serial-no="currentRecord?.serialNo || ''"
      :duration="currentRecord?.duration || 0"
      :agent-no="currentRecord?.agentNo || ''"
      :agent-name="currentRecord?.agentName || ''"
      :current-play-time="currentPlayTime"
      @close="handleRecordDetailClose"
      @seek="handleSeekToTime"
      @play="handleModalPlay"
      @view-business-detail="handleViewBusinessDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import RecordQueryPanel from './components/RecordQueryPanel.vue'
import RecordList from './components/RecordList.vue'
import RecordPlayer from './components/RecordPlayer.vue'
import RecordDetailDialog from './components/RecordDetailDialog.vue'
import RecordDetailModal from './components/RecordDetailModal.vue'
import type { RecordingRecord, RecordingQueryParams, PaginationResult } from './types'
import type { OperationRecord } from './types/recordDetail'
import * as api from './mock'

// ==================== 响应式数据 ====================
const queryPanelRef = ref<InstanceType<typeof RecordQueryPanel>>()
const recordListRef = ref<InstanceType<typeof RecordList>>()

const loading = ref(false)
const downloading = ref(false)
const showPlayer = ref(false)
const showDetailDialog = ref(false)
const showRecordDetailModal = ref(false)
const currentRecord = ref<RecordingRecord | null>(null)
const selectedRecords = ref<RecordingRecord[]>([])
const currentPlayTime = ref(0)

const recordList = ref<RecordingRecord[]>([])
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0
})

// ==================== 方法 ====================
// 加载录音列表
const loadRecordings = async (params: RecordingQueryParams) => {
  loading.value = true
  try {
    const res = await api.queryRecordings(params)
    if (res.success) {
      const data: PaginationResult<RecordingRecord> = res.data
      recordList.value = data.list
      pagination.total = data.total
      pagination.page = data.page
      pagination.pageSize = data.pageSize
      pagination.totalPages = data.totalPages
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('查询录音失败:', error)
    ElMessage.error('查询录音失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = (params: RecordingQueryParams) => {
  loadRecordings(params)
}

// 修改
const handleModify = () => {
  ElMessage.info('修改功能开发中')
}

// 浏览
const handleBrowse = () => {
  ElMessage.info('浏览功能开发中')
}

// 过滤
const handleFilter = () => {
  ElMessage.info('过滤功能开发中')
}

// 重置
const handleReset = () => {
  recordList.value = []
  pagination.total = 0
  pagination.page = 1
  pagination.totalPages = 0
}

// 批量下载
const handleBatchDownload = async () => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning('请先选择要下载的录音')
    return
  }

  downloading.value = true
  try {
    const ids = selectedRecords.value.map(r => r.id)
    const res = await api.downloadRecording(ids)
    if (res.success) {
      ElMessage.success(`开始下载 ${selectedRecords.value.length} 条录音`)
      // 记录日志
      api.logOperation({
        operator: api.currentUser.name,
        operationType: 'download',
        operationContent: `批量下载录音: ${ids.length}条`,
        ipAddress: '127.0.0.1'
      })
    } else {
      ElMessage.error(res.message || '下载失败')
    }
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  } finally {
    downloading.value = false
  }
}

// 单条下载
const handleDownload = async (ids: string[]) => {
  if (ids.length === 0) return

  try {
    const res = await api.downloadRecording(ids)
    if (res.success) {
      // 记录日志
      api.logOperation({
        operator: api.currentUser.name,
        operationType: 'download',
        operationContent: `下载录音: ${ids.join(',')}`,
        recordId: ids[0],
        ipAddress: '127.0.0.1'
      })
    } else {
      ElMessage.error(res.message || '下载失败')
    }
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}

// 行点击 - 显示新的操作记录详情弹窗
const handleRowClick = (record: RecordingRecord) => {
  currentRecord.value = record
  showRecordDetailModal.value = true

  // 记录查看日志
  api.logOperation({
    operator: api.currentUser.name,
    operationType: 'view',
    operationContent: `查看录音操作记录: ${record.fileName}`,
    recordId: record.id,
    ipAddress: '127.0.0.1'
  })
}

// 播放
const handlePlay = (record: RecordingRecord) => {
  currentRecord.value = record
  showPlayer.value = true

  // 记录播放日志
  api.logOperation({
    operator: api.currentUser.name,
    operationType: 'play',
    operationContent: `播放录音: ${record.fileName}`,
    recordId: record.id,
    ipAddress: '127.0.0.1'
  })
}

// 选择变化
const handleSelectionChange = (selection: RecordingRecord[]) => {
  selectedRecords.value = selection
}

// 页码变化
const handlePageChange = (page: number) => {
  const params = queryPanelRef.value?.getQueryParams()
  if (params) {
    params.page = page
    loadRecordings(params)
  }
}

// 每页条数变化
const handlePageSizeChange = (size: number) => {
  const params = queryPanelRef.value?.getQueryParams()
  if (params) {
    params.pageSize = size
    params.page = 1
    loadRecordings(params)
  }
}

// 播放器关闭
const handlePlayerClose = () => {
  showPlayer.value = false
}

// 播放状态变化
const handlePlayStateChange = (isPlaying: boolean, currentTime?: number) => {
  // 同步播放时间到详情弹窗
  if (currentTime !== undefined) {
    currentPlayTime.value = currentTime
  }
}

// 详情弹窗播放
const handleDetailPlay = (record: RecordingRecord) => {
  showPlayer.value = true
}

// 详情弹窗下载
const handleDetailDownload = (record: RecordingRecord) => {
  handleDownload([record.id])
}

// ==================== 新的操作记录详情弹窗相关方法 ====================

// 关闭操作记录详情弹窗
const handleRecordDetailClose = () => {
  showRecordDetailModal.value = false
}

// 跳转到指定时间
const handleSeekToTime = (time: number) => {
  currentPlayTime.value = time
  showPlayer.value = true
  ElMessage.success(`跳转到 ${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`)
}

// 弹窗内播放录音
const handleModalPlay = () => {
  showPlayer.value = true
}

// 查看业务详情
const handleViewBusinessDetail = (record: OperationRecord) => {
  ElMessage.info(`查看业务详情: ${record.businessType} - ${record.businessContent}`)
  // 这里可以实现跳转到具体业务模块的逻辑
  console.log('业务详情:', record.businessDetail)
}

// ==================== 生命周期 ====================
const isInitialized = ref(false)

// 加载数据的通用方法
const doLoadData = () => {
  setTimeout(() => {
    const params = queryPanelRef.value?.getQueryParams()
    if (params) {
      loadRecordings(params)
      isInitialized.value = true
    }
  }, 100)
}

onMounted(() => {
  doLoadData()
})

onActivated(() => {
  // 当组件被激活时（如tab切换）加载数据
  if (!isInitialized.value) {
    doLoadData()
  }
})

// 暴露方法
defineExpose({
  refresh: () => {
    const params = queryPanelRef.value?.getQueryParams()
    if (params) {
      loadRecordings(params)
    }
  }
})
</script>

<style scoped lang="scss">
.recording-playback-module {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f2f5;
  padding: 16px;
  gap: 16px;
  overflow: hidden;

  .left-section {
    flex: 0 0 auto;
  }

  .right-section {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    :deep(.record-list) {
      height: 100%;
      display: flex;
      flex-direction: column;

      .record-table {
        flex: 1;
        overflow: auto;
      }

      .table-footer {
        flex: 0 0 auto;
      }
    }
  }
}
</style>
