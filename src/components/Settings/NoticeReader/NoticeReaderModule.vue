<!--
  通知阅读模块
  @description 话务条设置中的通知阅读功能，支持列表展示、详情查看、筛选查询、操作功能
  @version 1.0.0
-->
<template>
  <div class="notice-reader-module">
    <!-- 顶部标题栏 -->
    <div class="window-header">
      <div class="header-title">
        <el-icon class="title-icon"><Message /></el-icon>
        <span class="title-text">通知阅读({{ unreadCount }})</span>
      </div>
      <div class="window-controls">
        <el-button class="control-btn minimize" @click="handleMinimize" title="最小化">
          <el-icon><Minus /></el-icon>
        </el-button>
        <el-button class="control-btn maximize" @click="handleMaximize" title="最大化">
          <el-icon><FullScreen /></el-icon>
        </el-button>
        <el-button class="control-btn close" @click="handleClose" title="关闭">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="module-body">
      <!-- 通知列表区 -->
      <div class="list-section">
        <el-table
          ref="tableRef"
          :data="filteredNoticeList"
          stripe
          border
          size="small"
          highlight-current-row
          v-loading="loading"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          class="notice-table"
          height="280"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="状态" width="70" align="center">
            <template #default="{ row }">
              <div class="status-cell">
                <el-icon v-if="row.status === 'unread'" class="unread-icon"><WarningFilled /></el-icon>
                <el-icon v-else class="read-icon"><CircleCheckFilled /></el-icon>
                <span :class="{ 'is-unread': row.status === 'unread' }">
                  {{ getStatusLabel(row.status) }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="种类" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getNoticeTypeColor(row.noticeType)" size="small">
                {{ getNoticeTypeName(row.noticeType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="senderName" label="发送人" width="100" align="center" />
          <el-table-column prop="sendTime" label="发送时间" width="150" align="center" />
          <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            size="small"
            @change="handlePageChange"
          />
        </div>
      </div>

      <!-- 通知详情区 -->
      <div class="detail-section">
        <div class="detail-title">通知详情</div>
        <div class="detail-content">
          <el-form label-position="top" class="detail-form">
            <el-form-item label="通知标题：">
              <el-input
                v-model="currentNotice.title"
                readonly
                placeholder="点击列表查看通知标题"
                class="readonly-input"
              />
            </el-form-item>
            <el-form-item label="通知内容：">
              <div
                class="content-textarea"
                v-html="currentNotice.content || '<p style=\'color: #c0c4cc; text-align: center; padding: 40px 0;\'>点击列表查看通知内容</p>'"
              ></div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部筛选与操作区 -->
      <div class="bottom-section">
        <!-- 筛选条件 -->
        <div class="filter-area">
          <div class="filter-row">
            <div class="filter-item">
              <span class="filter-label">从：</span>
              <el-date-picker
                v-model="filterForm.startTime"
                type="datetime"
                placeholder="开始时间"
                size="small"
                style="width: 170px"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
            <div class="filter-item">
              <span class="filter-label">到：</span>
              <el-date-picker
                v-model="filterForm.endTime"
                type="datetime"
                placeholder="结束时间"
                size="small"
                style="width: 170px"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
            <div class="filter-item">
              <span class="filter-label">通知类型：</span>
              <el-select
                v-model="filterForm.noticeType"
                placeholder="全部类型"
                size="small"
                clearable
                style="width: 120px"
              >
                <el-option
                  v-for="item in noticeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="filter-row">
            <div class="filter-item">
              <span class="filter-label">发送人：</span>
              <el-select
                v-model="filterForm.sender"
                placeholder="全部发送人"
                size="small"
                clearable
                style="width: 150px"
              >
                <el-option
                  v-for="item in senderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="filter-item flex-1">
              <span class="filter-label">通知内容：</span>
              <el-input
                v-model="filterForm.content"
                placeholder="请输入内容关键词"
                size="small"
                clearable
                style="width: 200px"
              />
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-area">
          <el-button type="primary" :loading="loading" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleQuote" :disabled="!currentNotice.id">
            <el-icon><DocumentCopy /></el-icon>
            引用
          </el-button>
          <el-button
            v-if="canModify"
            type="warning"
            @click="handleModify"
            :disabled="!currentNotice.id"
          >
            <el-icon><Edit /></el-icon>
            修改
          </el-button>
          <el-button
            v-if="canDelete"
            type="danger"
            @click="handleDelete"
            :disabled="selectedNotices.length === 0"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
          <el-button @click="handleExport" :loading="exporting">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
          <el-button @click="handleClose">
            <el-icon><CircleClose /></el-icon>
            关闭
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Message,
  Minus,
  FullScreen,
  Close,
  WarningFilled,
  CircleCheckFilled,
  Search,
  DocumentCopy,
  Edit,
  Delete,
  Download,
  CircleClose
} from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import type { ReceivedNotice } from '../NoticeReceive/types/noticeReceive'
import {
  NoticeStatusEnum,
  NoticeStatusLabels,
  NoticeTypeEnum,
  NoticeTypeNames,
  NoticeTypeColors
} from '../NoticeReceive/types/noticeReceive'
import {
  getNoticeList,
  getUnreadCount,
  markNoticeAsRead,
  deleteNotice
} from '../NoticeReceive/mock/noticeReceiveMock'

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
  (e: 'modify', notice: ReceivedNotice): void
  (e: 'read', noticeId: string): void
}>()

// ==================== 响应式数据 ====================
const loading = ref(false)
const exporting = ref(false)
const tableRef = ref<TableInstance>()
const noticeList = ref<ReceivedNotice[]>([])
const selectedNotices = ref<ReceivedNotice[]>([])
const currentNotice = ref<Partial<ReceivedNotice>>({})
const unreadCount = ref(0)
const total = ref(0)

// 分页
const page = ref(1)
const pageSize = ref(20)

// 筛选表单
const filterForm = reactive({
  startTime: '',
  endTime: '',
  noticeType: '',
  sender: '',
  content: ''
})

// 当前用户信息（模拟权限）
const currentUser = {
  id: 'A001',
  agentNo: '1001',
  name: '张三',
  role: 'agent' // agent: 普通坐席, monitor: 班长, admin: 管理员
}

// ==================== 计算属性 ====================

// 通知类型选项
const noticeTypeOptions = computed(() => [
  { value: NoticeTypeEnum.MONITOR_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.MONITOR_NOTICE] },
  { value: NoticeTypeEnum.SYSTEM_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.SYSTEM_NOTICE] },
  { value: NoticeTypeEnum.BUSINESS_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.BUSINESS_NOTICE] }
])

// 发送人选项（从通知列表中提取）
const senderOptions = computed(() => {
  const senders = [...new Set(noticeList.value.map(n => n.senderName))]
  return senders.map(name => ({ value: name, label: name }))
})

// 筛选后的通知列表
const filteredNoticeList = computed(() => {
  let list = [...noticeList.value]

  // 时间范围筛选
  if (filterForm.startTime) {
    list = list.filter(n => n.sendTime >= filterForm.startTime)
  }
  if (filterForm.endTime) {
    list = list.filter(n => n.sendTime <= filterForm.endTime)
  }

  // 通知类型筛选
  if (filterForm.noticeType) {
    list = list.filter(n => n.noticeType === filterForm.noticeType)
  }

  // 发送人筛选
  if (filterForm.sender) {
    list = list.filter(n => n.senderName === filterForm.sender)
  }

  // 内容关键词筛选
  if (filterForm.content) {
    const keyword = filterForm.content.toLowerCase()
    list = list.filter(n =>
      n.title.toLowerCase().includes(keyword) ||
      n.content.toLowerCase().includes(keyword)
    )
  }

  // 按状态排序（未读在前）
  list.sort((a, b) => {
    if (a.status === b.status) {
      return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime()
    }
    return a.status === NoticeStatusEnum.UNREAD ? -1 : 1
  })

  return list
})

// 是否有修改权限（发布者或管理员）
const canModify = computed(() => {
  if (!currentNotice.value.id) return false
  // 管理员可以修改所有通知
  if (currentUser.role === 'admin' || currentUser.role === 'monitor') return true
  // 发布者可以修改自己的通知
  return currentNotice.value.senderId === currentUser.id
})

// 是否有删除权限（发布者或管理员）
const canDelete = computed(() => {
  // 管理员可以删除所有通知
  if (currentUser.role === 'admin' || currentUser.role === 'monitor') return true
  // 发布者可以删除自己的通知
  return selectedNotices.value.every(n => n.senderId === currentUser.id)
})

// ==================== 方法 ====================

/**
 * 获取状态标签
 */
const getStatusLabel = (status: NoticeStatusEnum): string => {
  return NoticeStatusLabels[status] || status
}

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
 * 加载通知列表
 */
const loadNoticeList = async () => {
  loading.value = true
  const res = await getNoticeList({
    page: page.value,
    pageSize: pageSize.value
  })
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
 * 处理选择变化
 */
const handleSelectionChange = (selection: ReceivedNotice[]) => {
  selectedNotices.value = selection
}

/**
 * 处理行点击
 */
const handleRowClick = async (row: ReceivedNotice) => {
  currentNotice.value = { ...row }

  // 如果是未读，标记为已读
  if (row.status === NoticeStatusEnum.UNREAD) {
    const res = await markNoticeAsRead({ noticeId: row.id })
    if (res.success) {
      row.status = NoticeStatusEnum.READ
      unreadCount.value = Math.max(0, unreadCount.value - 1)
      emit('read', row.id)
    }
  }
}

/**
 * 处理查询
 */
const handleQuery = () => {
  page.value = 1
  // 筛选逻辑已在计算属性中处理
  ElMessage.success('查询完成')
}

/**
 * 处理引用
 */
const handleQuote = () => {
  if (!currentNotice.value.content) return

  // 复制到剪贴板
  const text = `${currentNotice.value.title}\n${currentNotice.value.content?.replace(/<[^>]+>/g, '')}`
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('通知内容已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

/**
 * 处理修改
 */
const handleModify = () => {
  if (!currentNotice.value.id) return
  emit('modify', currentNotice.value as ReceivedNotice)
  ElMessage.info('进入通知编辑模式')
}

/**
 * 处理删除
 */
const handleDelete = async () => {
  if (selectedNotices.value.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedNotices.value.length} 条通知吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    let successCount = 0
    for (const notice of selectedNotices.value) {
      const res = await deleteNotice({ noticeId: notice.id })
      if (res.success) {
        successCount++
      }
    }

    ElMessage.success(`成功删除 ${successCount} 条通知`)
    selectedNotices.value = []
    currentNotice.value = {}
    loadNoticeList()
    loadUnreadCount()
  } catch {
    // 取消删除
  }
}

/**
 * 处理导出
 */
const handleExport = async () => {
  exporting.value = true

  // 模拟导出
  setTimeout(() => {
    const data = filteredNoticeList.value.map(n => ({
      标题: n.title,
      内容: n.content?.replace(/<[^>]+>/g, '') || '',
      类型: getNoticeTypeName(n.noticeType),
      发送人: n.senderName,
      发送时间: n.sendTime,
      状态: getStatusLabel(n.status)
    }))

    // 创建CSV内容
    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${(row as any)[h] || ''}"`).join(','))
    ].join('\n')

    // 下载文件
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `通知列表_${new Date().toLocaleDateString()}.csv`
    link.click()

    exporting.value = false
    ElMessage.success('导出成功')
  }, 1000)
}

/**
 * 处理分页变化
 */
const handlePageChange = () => {
  loadNoticeList()
}

/**
 * 处理最小化
 */
const handleMinimize = () => {
  ElMessage.info('最小化窗口')
}

/**
 * 处理最大化
 */
const handleMaximize = () => {
  ElMessage.info('最大化窗口')
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

  // 设置默认时间范围为当天
  const today = new Date()
  filterForm.endTime = today.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')

  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  filterForm.startTime = startOfDay.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')
})
</script>

<style scoped lang="scss">
.notice-reader-module {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

// 窗口标题栏
.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;

    .title-icon {
      font-size: 20px;
    }

    .title-text {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .window-controls {
    display: flex;
    gap: 4px;

    .control-btn {
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      &.close:hover {
        background: #f56c6c;
      }
    }
  }
}

// 主体内容
.module-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

// 列表区
.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .notice-table {
    .status-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      .unread-icon {
        color: #f56c6c;
        font-size: 16px;
      }

      .read-icon {
        color: #67c23a;
        font-size: 16px;
      }

      .is-unread {
        color: #f56c6c;
        font-weight: 600;
      }
    }

    :deep(.el-table__row.is-current-row) {
      background-color: #ecf5ff;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
  }
}

// 详情区
.detail-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .detail-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 12px;
  }

  .detail-content {
    flex: 1;
    overflow-y: auto;

    .detail-form {
      :deep(.el-form-item__label) {
        font-weight: 500;
        color: #606266;
      }

      .readonly-input {
        :deep(.el-input__inner) {
          background-color: #f5f7fa;
          color: #606266;
        }
      }

      .content-textarea {
        min-height: 120px;
        max-height: 200px;
        padding: 12px;
        background: #f5f7fa;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.6;

        :deep(p) {
          margin: 0 0 8px 0;
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
}

// 底部区
.bottom-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;

  .filter-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;

    .filter-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .filter-item {
        display: flex;
        align-items: center;
        gap: 8px;

        &.flex-1 {
          flex: 1;
          min-width: 300px;
        }

        .filter-label {
          font-size: 13px;
          color: #606266;
          white-space: nowrap;
        }
      }
    }
  }

  .action-area {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .el-button {
      min-width: 80px;
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .bottom-section {
    .filter-area {
      .filter-row {
        .filter-item.flex-1 {
          min-width: 100%;
        }
      }
    }
  }
}
</style>
