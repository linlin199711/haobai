<!--
  通知阅读器
  @description 通知列表查看和详情阅读组件
  @version 1.0.0
-->
<template>
  <div class="notice-reader-container">
    <!-- 头部工具栏 -->
    <div class="reader-header">
      <div class="header-title">
        <el-icon><MessageBox /></el-icon>
        <span>通知阅读器</span>
        <el-badge :value="unreadCount" v-if="unreadCount > 0" class="unread-badge" />
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          size="small"
          :disabled="unreadCount === 0"
          @click="handleMarkAllRead"
        >
          <el-icon><Check /></el-icon>
          全部已读
        </el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="!canDelete"
          @click="handleDeleteRead"
        >
          <el-icon><Delete /></el-icon>
          删除已读
        </el-button>
        <el-button size="small" @click="handleRefresh" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button size="small" @click="handleClose">
          <el-icon><Close /></el-icon>
          关闭
        </el-button>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="reader-body">
      <!-- 左侧通知列表 -->
      <div class="notice-list-section" :class="{ 'is-collapsed': showDetail }">
        <div class="list-filter">
          <el-radio-group v-model="filterStatus" size="small" @change="handleFilterChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="unread">未读</el-radio-button>
            <el-radio-button label="read">已读</el-radio-button>
          </el-radio-group>
          <el-select
            v-model="filterType"
            placeholder="通知类型"
            size="small"
            clearable
            style="width: 120px"
            @change="handleFilterChange"
          >
            <el-option
              v-for="item in noticeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="list-content" v-loading="loading">
          <el-empty v-if="noticeList.length === 0" description="暂无通知" />
          
          <div
            v-for="notice in noticeList"
            :key="notice.id"
            class="notice-item"
            :class="{
              'is-unread': notice.status === 'unread',
              'is-active': currentNotice?.id === notice.id
            }"
            @click="handleNoticeClick(notice)"
          >
            <div class="item-header">
              <el-tag
                :type="getNoticeTypeColor(notice.noticeType)"
                size="small"
                effect="dark"
              >
                {{ getNoticeTypeName(notice.noticeType) }}
              </el-tag>
              <el-tag
                :type="getStatusColor(notice.status)"
                size="small"
              >
                {{ getStatusLabel(notice.status) }}
              </el-tag>
            </div>
            <div class="item-title" :title="notice.title">
              {{ notice.title }}
            </div>
            <div class="item-meta">
              <span class="sender">
                <el-icon><User /></el-icon>
                {{ notice.senderName }}
              </span>
              <span class="time">
                <el-icon><Clock /></el-icon>
                {{ formatTime(notice.sendTime) }}
              </span>
            </div>
            <div class="item-expire">
              <el-icon><Timer /></el-icon>
              有效期至：{{ formatTime(notice.expireTime) }}
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="list-pagination" v-if="total > 0">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            size="small"
            @change="handlePageChange"
          />
        </div>
      </div>

      <!-- 右侧详情区 -->
      <div class="notice-detail-section" :class="{ 'is-visible': showDetail }">
        <template v-if="currentNotice">
          <div class="detail-header">
            <el-button
              class="back-btn"
              size="small"
              @click="handleBackToList"
            >
              <el-icon><ArrowLeft /></el-icon>
              返回列表
            </el-button>
            <div class="detail-actions">
              <el-button
                v-if="currentNotice.status === 'unread'"
                type="primary"
                size="small"
                @click="handleMarkRead(currentNotice)"
              >
                标记已读
              </el-button>
              <el-button
                v-if="currentNotice.status === 'read'"
                type="danger"
                size="small"
                @click="handleDelete(currentNotice)"
              >
                删除
              </el-button>
            </div>
          </div>

          <div class="detail-content">
            <div class="content-header">
              <h2 class="notice-title">{{ currentNotice.title }}</h2>
              <div class="notice-meta">
                <el-tag :type="getNoticeTypeColor(currentNotice.noticeType)">
                  {{ getNoticeTypeName(currentNotice.noticeType) }}
                </el-tag>
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  发送人：{{ currentNotice.senderName }}（{{ currentNotice.senderAgentNo }}）
                </span>
                <span class="meta-item">
                  <el-icon><Clock /></el-icon>
                  发送时间：{{ currentNotice.sendTime }}
                </span>
                <span class="meta-item">
                  <el-icon><Timer /></el-icon>
                  有效期：{{ currentNotice.validDays }}天（至{{ currentNotice.expireTime }}）
                </span>
              </div>
            </div>

            <el-divider />

            <div class="content-body" v-html="currentNotice.content"></div>
          </div>
        </template>

        <el-empty v-else description="请选择通知查看详情">
          <template #image>
            <el-icon :size="60" color="#c0c4cc"><Message /></el-icon>
          </template>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  MessageBox,
  Check,
  Delete,
  Refresh,
  Close,
  User,
  Clock,
  Timer,
  ArrowLeft,
  Message
} from '@element-plus/icons-vue'
import type { ReceivedNotice, NoticeQueryParams } from '../types/noticeReceive'
import {
  NoticeStatusEnum,
  NoticeStatusLabels,
  NoticeStatusColors,
  NoticeTypeEnum,
  NoticeTypeNames,
  NoticeTypeColors
} from '../types/noticeReceive'
import {
  getNoticeList,
  getUnreadCount,
  markNoticeAsRead,
  markAllAsRead,
  deleteNotice
} from '../mock/noticeReceiveMock'

// ==================== Props & Emits ====================
interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'read', noticeId: string): void
}>()

// ==================== 响应式数据 ====================
const loading = ref(false)
const noticeList = ref<ReceivedNotice[]>([])
const currentNotice = ref<ReceivedNotice | null>(null)
const showDetail = ref(false)
const unreadCount = ref(0)
const total = ref(0)

// 筛选条件
const filterStatus = ref<string>('')
const filterType = ref<string>('')
const page = ref(1)
const pageSize = ref(10)

// ==================== 计算属性 ====================

// 通知类型选项
const noticeTypeOptions = computed(() => [
  { value: NoticeTypeEnum.MONITOR_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.MONITOR_NOTICE] },
  { value: NoticeTypeEnum.SYSTEM_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.SYSTEM_NOTICE] },
  { value: NoticeTypeEnum.BUSINESS_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.BUSINESS_NOTICE] }
])

// 是否可以删除
const canDelete = computed(() => {
  return noticeList.value.some(n => n.status === NoticeStatusEnum.READ)
})

// ==================== 方法 ====================

/**
 * 获取通知类型名称
 */
const getNoticeTypeName = (type: NoticeTypeEnum): string => {
  return NoticeTypeNames[type] || type
}

/**
 * 获取通知类型颜色
 */
const getNoticeTypeColor = (type: NoticeTypeEnum): string => {
  return NoticeTypeColors[type] || 'info'
}

/**
 * 获取状态标签
 */
const getStatusLabel = (status: NoticeStatusEnum): string => {
  return NoticeStatusLabels[status] || status
}

/**
 * 获取状态颜色
 */
const getStatusColor = (status: NoticeStatusEnum): string => {
  return NoticeStatusColors[status] || 'info'
}

/**
 * 格式化时间
 */
const formatTime = (time: string): string => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 今天
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  // 昨天
  if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  // 其他
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 加载通知列表
 */
const loadNoticeList = async () => {
  loading.value = true
  
  const params: NoticeQueryParams = {
    page: page.value,
    pageSize: pageSize.value
  }
  
  if (filterStatus.value) {
    params.status = filterStatus.value as NoticeStatusEnum
  }
  if (filterType.value) {
    params.noticeType = filterType.value as NoticeTypeEnum
  }
  
  const res = await getNoticeList(params)
  if (res.success) {
    noticeList.value = res.data.list
    total.value = res.data.total
  }
  
  loading.value = false
}

/**
 * 加载未读数量
 */
const loadUnreadCount = async () => {
  const res = await getUnreadCount()
  if (res.success) {
    unreadCount.value = res.data
  }
}

/**
 * 处理通知点击
 */
const handleNoticeClick = async (notice: ReceivedNotice) => {
  currentNotice.value = notice
  showDetail.value = true
  
  // 如果是未读，自动标记为已读
  if (notice.status === NoticeStatusEnum.UNREAD) {
    await markNoticeAsRead({ noticeId: notice.id })
    notice.status = NoticeStatusEnum.READ
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    emit('read', notice.id)
  }
}

/**
 * 处理返回列表
 */
const handleBackToList = () => {
  showDetail.value = false
  currentNotice.value = null
}

/**
 * 处理标记已读
 */
const handleMarkRead = async (notice: ReceivedNotice) => {
  const res = await markNoticeAsRead({ noticeId: notice.id })
  if (res.success) {
    notice.status = NoticeStatusEnum.READ
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    ElMessage.success('标记已读成功')
    emit('read', notice.id)
  }
}

/**
 * 处理全部已读
 */
const handleMarkAllRead = async () => {
  const res = await markAllAsRead()
  if (res.success) {
    noticeList.value.forEach(n => {
      if (n.status === NoticeStatusEnum.UNREAD) {
        n.status = NoticeStatusEnum.READ
      }
    })
    unreadCount.value = 0
    ElMessage.success(`已将 ${res.data} 条通知标记为已读`)
  }
}

/**
 * 处理删除
 */
const handleDelete = async (notice: ReceivedNotice) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const res = await deleteNotice({ noticeId: notice.id })
    if (res.success) {
      ElMessage.success('删除成功')
      handleBackToList()
      loadNoticeList()
    } else {
      ElMessage.error(res.message)
    }
  } catch {
    // 取消删除
  }
}

/**
 * 处理删除已读
 */
const handleDeleteRead = async () => {
  try {
    const readNotices = noticeList.value.filter(n => n.status === NoticeStatusEnum.READ)
    if (readNotices.length === 0) {
      ElMessage.warning('没有已读通知可删除')
      return
    }
    
    await ElMessageBox.confirm(`确定要删除 ${readNotices.length} 条已读通知吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 逐个删除
    let deletedCount = 0
    for (const notice of readNotices) {
      const res = await deleteNotice({ noticeId: notice.id })
      if (res.success) {
        deletedCount++
      }
    }
    
    ElMessage.success(`已删除 ${deletedCount} 条通知`)
    loadNoticeList()
  } catch {
    // 取消删除
  }
}

/**
 * 处理刷新
 */
const handleRefresh = async () => {
  await loadNoticeList()
  await loadUnreadCount()
  ElMessage.success('刷新成功')
}

/**
 * 处理筛选变化
 */
const handleFilterChange = () => {
  page.value = 1
  loadNoticeList()
}

/**
 * 处理分页变化
 */
const handlePageChange = () => {
  loadNoticeList()
}

/**
 * 处理关闭
 */
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadNoticeList()
  loadUnreadCount()
})
</script>

<style scoped lang="scss">
.notice-reader-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa;
}

// 头部
.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;

    .el-icon {
      font-size: 24px;
    }

    .unread-badge {
      :deep(.el-badge__content) {
        background: #f56c6c;
        border: none;
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

// 主体内容
.reader-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// 左侧列表
.notice-list-section {
  width: 400px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  transition: width 0.3s;

  &.is-collapsed {
    width: 0;
    overflow: hidden;
  }

  .list-filter {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid #e4e7ed;
    background: #f5f7fa;
  }

  .list-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    .notice-item {
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      background: #f5f7fa;

      &:hover {
        background: #e8f4ff;
        transform: translateX(4px);
      }

      &.is-unread {
        background: #fff;
        border-left: 4px solid #f56c6c;
        box-shadow: 0 2px 8px rgba(245, 108, 108, 0.1);
      }

      &.is-active {
        background: #409eff;
        color: #fff;

        .item-title,
        .item-meta,
        .item-expire {
          color: #fff;
        }
      }

      .item-header {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }

      .item-title {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: #909399;
        margin-bottom: 4px;

        .sender,
        .time {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .item-expire {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #c0c4cc;
      }
    }
  }

  .list-pagination {
    padding: 12px;
    border-top: 1px solid #e4e7ed;
    display: flex;
    justify-content: center;
  }
}

// 右侧详情
.notice-detail-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;

  &.is-visible {
    .detail-header {
      display: flex;
    }
  }

  .detail-header {
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid #e4e7ed;
    background: #f5f7fa;

    .back-btn {
      display: none;
    }
  }

  .detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    .content-header {
      margin-bottom: 20px;

      .notice-title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 16px 0;
        line-height: 1.4;
      }

      .notice-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 13px;
        color: #606266;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }
    }

    .content-body {
      font-size: 14px;
      line-height: 1.8;
      color: #303133;

      :deep(p) {
        margin: 0 0 12px 0;
      }

      :deep(strong) {
        font-weight: 600;
        color: #409eff;
      }

      :deep(u) {
        text-decoration: underline;
        color: #e6a23c;
      }

      :deep(em) {
        font-style: italic;
        color: #67c23a;
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .notice-list-section {
    width: 100%;

    &.is-collapsed {
      display: none;
    }
  }

  .notice-detail-section {
    display: none;

    &.is-visible {
      display: flex;
    }

    .detail-header {
      display: flex;

      .back-btn {
        display: flex;
      }
    }
  }
}
</style>
