/**
 * 呼叫中心话务条 - 主组件
 * @description 现代化、高易用性的呼叫中心坐席系统话务条（深色主题版）
 * @author AI Assistant
 * @version 2.0.0
 */

<template>
  <div class="call-bar-container">
    <!-- 话务条主体 - 深色主题 -->
    <div class="call-bar" :class="{ 'is-offline': !isOnline }">
      <!-- 左侧：状态信息 -->
      <div class="bar-section status-info">
        <!-- 菜单按钮 -->
        <el-button
          class="icon-btn menu-btn"
          :class="{ 'is-active': showMenu }"
          @click="showMenu = !showMenu"
        >
          <el-icon><Menu /></el-icon>
        </el-button>

        <!-- 状态指示器 -->
        <div class="status-indicator">
          <span class="status-dot" :class="statusDotClass"></span>
          <span class="status-text">{{ statusText }}</span>
          <span v-if="isInCall" class="call-duration">{{ formattedDuration }}</span>
        </div>
      </div>

      <!-- 中间：通话信息区 - 与底部面板一致的两行布局 -->
      <div v-if="isInCall || isRinging" class="bar-section call-info">
        <!-- 第一排 -->
        <div class="info-row">
          <div class="info-item">
            <span class="label">主叫号码：</span>
            <span class="value">{{ currentCall?.callerNumber || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">被叫号码：</span>
            <span class="value">{{ currentCall?.calleeNumber || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">呼叫时间：</span>
            <span class="value">{{ currentCall?.callTime || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">用户类型：</span>
            <span class="value">{{ currentCall?.userLevel || '普通' }}</span>
          </div>
        </div>
        <!-- 第二排 -->
        <div class="info-row">
          <div class="info-item">
            <span class="label">名称：</span>
            <span class="value">{{ currentCall?.userName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">地址：</span>
            <span class="value">{{ currentCall?.address || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">主叫局向：</span>
            <span class="value">{{ currentCall?.callerDirection || '--' }}</span>
          </div>
        </div>
        <!-- 跨地市标签 -->
        <div v-if="isCrossCity" class="cross-city-tag">
          <el-tag type="warning" effect="dark" size="small">
            {{ currentCall?.city }}
          </el-tag>
        </div>
      </div>

      <!-- 右侧：功能按钮组 -->
      <div class="bar-section action-buttons">
        <!-- 签入/签出 -->
        <el-tooltip :content="isOnline ? '签出' : '签入'" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-active': isOnline, 'is-offline': !isOnline }"
            :disabled="loading.signInOut"
            @click="toggleSignInOut"
          >
            <el-icon v-if="!loading.signInOut"><User /></el-icon>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </el-tooltip>

        <!-- 示忙/示闲 -->
        <el-tooltip :content="isBusy ? '示闲' : '示忙'" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-busy': isBusy, 'is-idle': !isBusy && isOnline }"
            :disabled="!isOnline || loading.busy"
            @click="toggleBusy"
          >
            <el-icon v-if="!loading.busy"><Timer /></el-icon>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </el-tooltip>

        <!-- 静音 -->
        <el-tooltip :content="isMuted ? '取消静音' : '静音'" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-muted': isMuted }"
            :disabled="!canMute || loading.mute"
            @click="toggleMute"
          >
            <el-icon v-if="!loading.mute">
              <Microphone v-if="!isMuted" />
              <Mute v-else />
            </el-icon>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </el-tooltip>

        <!-- 保持/接回 -->
        <el-tooltip :content="isHolding ? '接回' : '保持'" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-holding': isHolding }"
            :disabled="!isInCall || loading.hold"
            @click="toggleHold"
          >
            <el-icon v-if="!loading.hold"><VideoPause /></el-icon>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </el-tooltip>

        <!-- 外呼 -->
        <el-tooltip content="外呼" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-active': canOutbound }"
            :disabled="!canOutbound"
            @click="showOutboundDialog = true"
          >
            <el-icon><Phone /></el-icon>
          </button>
        </el-tooltip>

        <!-- 转接 -->
        <el-tooltip content="转接" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-active': canTransfer }"
            :disabled="!canTransfer"
            @click="showTransferDialog = true"
          >
            <el-icon><Switch /></el-icon>
          </button>
        </el-tooltip>

        <!-- 咨询 -->
        <el-tooltip content="咨询" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-active': canConsult }"
            :disabled="!canConsult"
            @click="showConsultDialog = true"
          >
            <el-icon><ChatDotRound /></el-icon>
          </button>
        </el-tooltip>

        <!-- 三方通话 -->
        <el-tooltip content="三方" placement="top">
          <button
            class="icon-btn"
            :class="{ 'is-active': canThreeWay }"
            :disabled="!canThreeWay"
            @click="handleThreeWay"
          >
            <el-icon><Connection /></el-icon>
          </button>
        </el-tooltip>

        <!-- 挂断 -->
        <el-tooltip content="挂断" placement="top">
          <button
            class="icon-btn hangup-btn"
            :disabled="!canHangUp || loading.hangUp"
            @click="hangUp"
          >
            <el-icon v-if="!loading.hangUp"><CircleClose /></el-icon>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </div>

    <!-- 扩展菜单 -->
    <div v-if="showMenu" class="extended-menu">
      <div class="menu-item" @click="handleSettings">
        <el-icon><Setting /></el-icon>
        <span>设置</span>
      </div>
    </div>

    <!-- 权限提示 -->
    <div v-if="permissions.noIncomingCall && isOnline" class="permission-banner">
      <el-alert
        title="不进线权限已开启，不接入来电排队"
        type="warning"
        :closable="false"
        show-icon
      />
    </div>

    <!-- 转接弹窗 -->
    <TransferDialog
      v-model="showTransferDialog"
      :targets="transferTargets"
      :loading="loading.transfer"
      @confirm="handleTransfer"
    />

    <!-- 外呼弹窗 -->
    <OutboundDialog
      v-model="showOutboundDialog"
      :loading="loading.outbound"
      @confirm="handleOutbound"
    />

    <!-- 咨询弹窗 -->
    <ConsultDialog
      v-model="showConsultDialog"
      :targets="transferTargets"
      :loading="loading.consult"
      @confirm="handleConsult"
    />

    <!-- 来电弹窗 -->
    <IncomingCallDialog
      v-model="incomingCallVisible"
      :call-info="incomingCallInfo"
      :agent-info="agentInfo"
      :loading-answer="loading.answer"
      :loading-reject="loading.reject"
      @answer="answerCall"
      @reject="rejectCall"
    />

    <!-- 呼叫历史弹窗 -->
    <el-dialog
      v-model="showHistoryDialog"
      title="呼叫历史"
      width="800px"
    >
      <el-table :data="callRecords" stripe style="width: 100%">
        <el-table-column prop="startTime" label="时间" width="160" />
        <el-table-column prop="phoneNumber" label="号码" width="120" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'inbound' ? 'success' : 'primary'" size="small">
              {{ row.type === 'inbound' ? '呼入' : '呼出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.result === 'completed' ? 'success' : row.result === 'missed' ? 'danger' : 'warning'"
              size="small"
            >
              {{ getResultText(row.result) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 信息查询弹窗 -->
    <el-dialog
      v-model="showQueryDialog"
      title="信息查询"
      width="600px"
    >
      <el-form inline @submit.prevent="handleSearch">
        <el-form-item>
          <el-input
            v-model="searchKeyword"
            placeholder="请输入姓名/号码/地址"
            clearable
            style="width: 300px"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table v-if="queryResults.length > 0" :data="queryResults" stripe style="width: 100%; margin-top: 16px;">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phoneNumber" label="号码" width="120" />
        <el-table-column prop="level" label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
      </el-table>
      <el-empty v-else-if="hasSearched" description="暂无匹配结果" />
    </el-dialog>

    <!-- 话务条设置弹窗 -->
    <el-dialog
      v-model="showSettingsDialog"
      title="话务条设置"
      width="98vw"
      :close-on-click-modal="false"
      destroy-on-close
      class="settings-dialog"
      top="2vh"
    >
      <div class="settings-tabs">
        <el-tabs v-model="activeSettingsTab" type="border-card">
          <!-- 外呼功能 -->
          <el-tab-pane label="外呼" name="outbound">
            <OutboundPanel
              :can-dial="canOutbound"
              @confirm="handleOutboundInSettings"
            />
          </el-tab-pane>
          <!-- 示忙人数设置 -->
          <el-tab-pane label="示忙人数" name="busyLimit">
            <CallBarSettings />
          </el-tab-pane>
          <!-- 强插监听 -->
          <el-tab-pane label="强插监听" name="forceInsertMonitor">
            <ForceInsertMonitorPanel />
          </el-tab-pane>
          <!-- 班长监控 -->
          <el-tab-pane label="班长监控" name="supervisorMonitor">
            <div class="supervisor-monitor-wrapper">
              <SupervisorMonitor />
            </div>
          </el-tab-pane>
          <!-- 录音查看 -->
          <el-tab-pane label="录音查看" name="recordingPlayback">
            <div class="recording-playback-wrapper">
              <RecordingPlaybackModule />
            </div>
          </el-tab-pane>
          <!-- 通知管理 -->
          <el-tab-pane label="通知管理" name="noticePublish">
            <div class="notice-publish-wrapper">
              <NoticePublish
                @close="handleNoticePublishClose"
                @publish="handleNoticePublish"
              />
            </div>
          </el-tab-pane>
          <!-- 通知阅读 -->
          <el-tab-pane label="通知阅读" name="noticeReader">
            <div class="notice-reader-wrapper">
              <NoticeReaderModule
                @close="handleNoticeReaderClose"
                @modify="handleNoticeModify"
                @read="handleNoticeRead"
              />
            </div>
          </el-tab-pane>
          <!-- 信息查询 -->
          <el-tab-pane label="信息查询" name="infoQuery">
            <div class="info-query-wrapper">
              <InfoQueryPanel ref="infoQueryPanelRef" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Timer,
  Microphone,
  Mute,
  Phone,
  VideoPlay,
  Clock,
  Search,
  Switch,
  ChatDotRound,
  Connection,
  CircleClose,
  VideoPause,
  Loading,
  Menu,
  Setting
} from '@element-plus/icons-vue'
import { useCallBar } from './composables/useCallBar'
import TransferDialog from './components/TransferDialog.vue'
import OutboundDialog from './components/OutboundDialog.vue'
import OutboundPanel from './components/OutboundPanel.vue'
import IncomingCallDialog from './components/IncomingCallDialog.vue'
import ConsultDialog from './components/ConsultDialog.vue'
import CallBarSettings from '../CallBarSettings/CallBarSettings.vue'
import ForceInsertMonitorPanel from '../CallBarSettings/components/ForceInsertMonitorPanel.vue'
import SupervisorMonitor from '../SupervisorMonitor/SupervisorMonitor.vue'
import RecordingPlaybackModule from '../RecordingPlayback/RecordingPlaybackModule.vue'
import NoticePublish from '../Settings/NoticePublish/NoticePublish.vue'
import NoticeReaderModule from '../Settings/NoticeReader/NoticeReaderModule.vue'
import InfoQueryPanel from './components/InfoQueryPanel.vue'
import type { TransferTarget, CallRecord, UserInfo } from './types'
import * as api from './api/mock'

// 使用话务条逻辑
const {
  agentStatus,
  busyStatus,
  callStatus,
  isMuted,
  isHolding,
  loading,
  agentInfo,
  permissions,
  currentCall,
  callDuration,
  formattedDuration,
  statusText,
  transferTargets,
  incomingCallVisible,
  incomingCallInfo,
  isOnline,
  isBusy,
  isInCall,
  isRinging,
  canHangUp,
  canMute,
  canTransfer,
  canOutbound,
  canConsult,
  canThreeWay,
  canViewRecording,
  toggleSignInOut,
  toggleBusy,
  toggleMute,
  toggleHold,
  hangUp,
  answerCall,
  rejectCall,
  transferCall,
  outboundCall,
  consultCall,
  simulateIncomingCall
} = useCallBar()

// 弹窗显示状态
const showTransferDialog = ref(false)
const showOutboundDialog = ref(false)
const showConsultDialog = ref(false)
const showHistoryDialog = ref(false)
const showQueryDialog = ref(false)
const showMenu = ref(false)
const showSettingsDialog = ref(false)
const activeSettingsTab = ref('outbound') // 默认显示外呼标签

// 信息查询面板引用
const infoQueryPanelRef = ref<InstanceType<typeof InfoQueryPanel> | null>(null)

// 查询相关
const searchKeyword = ref('')
const queryResults = ref<UserInfo[]>([])
const hasSearched = ref(false)

// 通话记录
const callRecords = ref<CallRecord[]>([])

// 状态点样式
const statusDotClass = computed(() => {
  if (!isOnline.value) return 'is-offline'
  if (isInCall.value || isRinging.value) return 'is-talking'
  if (isBusy.value) return 'is-busy'
  return 'is-online'
})

// 是否跨地市
const isCrossCity = computed(() => {
  if (!currentCall.value?.city || !agentInfo.value?.city) return false
  return currentCall.value.city !== agentInfo.value.city
})

// 获取等级类型
const getLevelType = (level?: string): 'danger' | 'warning' | 'success' | 'info' => {
  switch (level) {
    case 'VIP':
      return 'danger'
    case 'gold':
      return 'warning'
    case 'silver':
      return 'success'
    default:
      return 'info'
  }
}

// 获取结果文本
const getResultText = (result: string): string => {
  const map: Record<string, string> = {
    completed: '已完成',
    missed: '未接听',
    rejected: '已拒接'
  }
  return map[result] || result
}

// 格式化时长
const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '00:00'
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

// 处理转接
const handleTransfer = async (target: TransferTarget) => {
  const success = await transferCall(target)
  if (success) {
    showTransferDialog.value = false
  }
}

// 处理外呼
const handleOutbound = async (phoneNumber: string, businessCode: string) => {
  const success = await outboundCall(phoneNumber, businessCode)
  if (success) {
    showOutboundDialog.value = false
  }
}

// 处理咨询
const handleConsult = async (target: TransferTarget) => {
  const success = await consultCall(target)
  if (success) {
    showConsultDialog.value = false
  }
}

// 处理三方通话
const handleThreeWay = () => {
  ElMessage.info('三方通话功能开发中')
}

// 查看录音
const handleViewRecording = async () => {
  showMenu.value = false
  showSettingsDialog.value = true
  activeSettingsTab.value = 'recordingPlayback'
}

// 查看历史
const handleViewHistory = async () => {
  showMenu.value = false
  const res = await api.getCallRecords({ page: 1, pageSize: 20 })
  if (res.success) {
    callRecords.value = res.data.list
    showHistoryDialog.value = true
  }
}

// 信息查询
const handleQueryInfo = () => {
  showMenu.value = false
  showQueryDialog.value = true
  searchKeyword.value = ''
  queryResults.value = []
  hasSearched.value = false
}

// 设置
const handleSettings = () => {
  showMenu.value = false
  showSettingsDialog.value = true
  activeSettingsTab.value = 'outbound' // 默认打开外呼标签
}

// 设置弹窗中的外呼处理
const handleOutboundInSettings = async (phoneNumber: string, businessCode: string) => {
  const success = await outboundCall(phoneNumber, businessCode)
  if (success) {
    ElMessage.success('外呼成功')
    // 可以选择关闭设置弹窗或保持打开
    // showSettingsDialog.value = false
  }
}

// 搜索
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  hasSearched.value = true
  const res = await api.queryInfo(searchKeyword.value)
  if (res.success) {
    queryResults.value = res.data as UserInfo[]
  }
}

// 处理通知发布关闭
const handleNoticePublishClose = () => {
  // 可以在这里添加关闭后的处理逻辑
  console.log('通知发布页面关闭')
}

// 处理通知发布成功
const handleNoticePublish = (data: any) => {
  console.log('通知发布成功:', data)
  // 可以在这里添加发布成功后的处理逻辑，比如刷新通知列表等
}

// 处理通知阅读关闭
const handleNoticeReaderClose = () => {
  console.log('通知阅读页面关闭')
}

// 处理通知修改
const handleNoticeModify = (notice: any) => {
  console.log('修改通知:', notice)
  ElMessage.info('进入通知编辑模式')
}

// 处理通知已读
const handleNoticeRead = (noticeId: string) => {
  console.log('通知已读:', noticeId)
}

// 组件挂载
onMounted(() => {
  // 初始化话务条
  // 注意：实际来电由系统推送，不需要模拟
})
</script>

<style scoped lang="scss">
// 深色主题配色
$bg-dark: #1a1a2e;
$bg-darker: #16213e;
$bg-card: #0f3460;
$primary-blue: #00a8ff;
$success-green: #4cd137;
$warning-orange: #e1b12c;
$danger-red: #e84118;
$text-light: #f5f6fa;
$text-muted: #7f8fa6;
$border-dark: #2f3640;

.call-bar-container {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

// 话务条主体 - 与底部呼入信息面板样式一致，铺满整行
.call-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px; // 减小高度从56px到48px
  padding: 0 12px; // 调整padding
  background: linear-gradient(135deg, $bg-dark 0%, $bg-darker 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  // 移除悬浮效果，与底部面板保持一致

  // 覆盖 Element Plus 按钮默认样式
  :deep(.el-button) {
    margin: 0;
  }
}

// 区域通用样式
.bar-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

// 左侧状态信息
.status-info {
  .menu-btn {
    width: 32px;
    height: 32px;
    // 移除圆角，保持直角
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: $text-light;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin: 0; // 移除默认 margin

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &.is-active {
      background: $primary-blue;
    }
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;

      &.is-offline {
        background-color: $text-muted;
      }

      &.is-online {
        background-color: $success-green;
      }

      &.is-busy {
        background-color: $warning-orange;
      }

      &.is-talking {
        background-color: $danger-red;
      }
    }

    .status-text {
      color: $text-light;
      font-size: 14px;
      font-weight: 500;
    }

    .call-duration {
      color: $warning-orange;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      padding-left: 8px;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

// 中间通话信息区 - 与底部面板样式一致
.call-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 8px; // 减小 padding
    position: relative;
    overflow-x: auto;

  .info-row {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    .label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      white-space: nowrap;
    }

    .value {
      color: #fff;
      font-size: 13px;
      white-space: nowrap;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .cross-city-tag {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

// 右侧功能按钮组
.action-buttons {
  gap: 8px;

  .icon-btn {
    width: 36px;
    height: 36px;
    // 移除圆角，改为直角或轻微圆角
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: $text-light;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 16px;
    margin: 0; // 移除默认 margin

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      // 移除悬浮上移效果
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.is-loading {
      animation: rotating 1s linear infinite;
    }

    // 签入状态 - 移除悬浮效果
    &.is-active {
      background: $success-green;

      &:hover:not(:disabled) {
        background: lighten($success-green, 10%);
      }
    }

    // 签出状态
    &.is-offline {
      background: $text-muted;
    }

    // 示忙状态 - 移除悬浮效果
    &.is-busy {
      background: $warning-orange;

      &:hover:not(:disabled) {
        background: lighten($warning-orange, 10%);
      }
    }

    // 示闲状态 - 移除悬浮效果
    &.is-idle {
      background: $primary-blue;

      &:hover:not(:disabled) {
        background: lighten($primary-blue, 10%);
      }
    }

    // 静音状态
    &.is-muted {
      background: $warning-orange;
    }

    // 保持状态 - 移除动画
    &.is-holding {
      background: $warning-orange;
    }

    // 挂断按钮 - 移除悬浮效果
    &.hangup-btn {
      background: $danger-red;

      &:hover:not(:disabled) {
        background: lighten($danger-red, 10%);
      }

      &:disabled {
        background: rgba($danger-red, 0.3);
      }
    }
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 扩展菜单
.extended-menu {
  position: absolute;
  left: 16px;
  top: 60px;
  background: linear-gradient(135deg, $bg-dark 0%, $bg-darker 100%);
  border: 1px solid $border-dark;
  // 移除圆角
  padding: 8px 0;
  min-width: 160px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 1002; // 高于左侧菜单的 1001

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: $text-light;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(.is-disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    &.is-disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .el-icon {
      font-size: 16px;
      color: $primary-blue;
    }

    span {
      font-size: 14px;
    }
  }
}

// 设置弹窗样式
:deep(.settings-dialog) {
  .el-dialog__body {
    padding: 0;
    max-height: 80vh;
    overflow-y: auto;
  }

  .settings-tabs {
    .el-tabs__content {
      padding: 0;
    }

    .el-tab-pane {
      min-height: 400px;
    }
  }

  .supervisor-monitor-wrapper {
    height: 80vh;
    overflow: hidden;

    :deep(.supervisor-monitor-container) {
      height: 100%;

      .header-section {
        padding: 10px 16px;

        .header-title {
          font-size: 15px;
        }
      }

      .main-content {
        padding: 10px;
        gap: 10px;

        .left-section {
          min-width: 450px;
          width: 45%;
        }
      }
    }
  }
}

// 权限提示
.permission-banner {
  padding: 6px 16px;
  background-color: rgba($warning-orange, 0.1);
  border-bottom: 1px solid rgba($warning-orange, 0.3);

  :deep(.el-alert) {
    padding: 4px 8px;
    background-color: transparent;

    .el-alert__title {
      font-size: 12px;
      color: $warning-orange;
    }

    .el-alert__icon {
      color: $warning-orange;
    }
  }
}

// 无录音提示
.no-recording {
  color: $text-muted;
  font-size: 12px;
}

// 录音查看tab样式
:deep(.settings-dialog) {
  .recording-playback-wrapper {
    height: 70vh;
    overflow: hidden;

    .recording-playback-module {
      height: 100%;
    }
  }

  .notice-publish-wrapper {
    height: 80vh;
    overflow: hidden;

    .notice-publish-container {
      height: 100%;
      padding: 12px;
    }
  }

  .notice-reader-wrapper {
    height: 80vh;
    overflow: hidden;

    .notice-reader-module {
      height: 100%;
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .call-bar {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
    gap: 12px;
  }

  .call-info {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    padding: 8px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 768px) {
  .action-buttons {
    gap: 6px;

    .icon-btn {
      width: 36px;
      height: 36px;
      font-size: 16px;
    }
  }

  .status-info {
    .status-indicator {
      padding: 4px 10px;

      .status-text {
        font-size: 12px;
      }

      .call-duration {
        font-size: 12px;
      }
    }
  }
}
</style>
