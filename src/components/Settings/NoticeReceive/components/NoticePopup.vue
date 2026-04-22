<!--
  通知接收弹窗
  @description 新通知到达时的弹窗提示组件
  @version 1.0.0
-->
<template>
  <teleport to="body">
    <transition name="popup-fade">
      <div
        v-if="visible"
        class="notice-popup-overlay"
        :class="{ 'always-on-top': alwaysOnTop }"
        @click.self="handleOverlayClick"
      >
        <div
          class="notice-popup"
          :class="{ 'is-minimized': isMinimized, 'is-maximized': isMaximized }"
          :style="popupStyle"
        >
          <!-- 标题栏 -->
          <div class="popup-header" @mousedown="startDrag">
            <div class="header-left">
              <el-icon class="system-icon"><Bell /></el-icon>
              <span class="title">号码百事通</span>
            </div>
            <div class="header-right">
              <el-button
                v-if="showMinimize"
                class="window-btn minimize"
                @click="handleMinimize"
                title="最小化"
              >
                <el-icon><Minus /></el-icon>
              </el-button>
              <el-button
                v-if="showMaximize"
                class="window-btn maximize"
                @click="handleMaximize"
                title="最大化"
              >
                <el-icon><FullScreen /></el-icon>
              </el-button>
              <el-button
                v-if="showClose"
                class="window-btn close"
                @click="handleClose"
                title="关闭"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="popup-body">
            <div class="notice-icon">
              <el-icon><Message /></el-icon>
            </div>
            <div class="notice-text">
              您有新通知！
            </div>
            <div v-if="latestNotice" class="notice-preview">
              <el-tag :type="getNoticeTypeColor(latestNotice.noticeType)" size="small">
                {{ getNoticeTypeName(latestNotice.noticeType) }}
              </el-tag>
              <span class="preview-title">{{ latestNotice.title }}</span>
            </div>
          </div>

          <!-- 按钮区 -->
          <div class="popup-footer">
            <el-button
              type="primary"
              size="default"
              class="action-btn"
              @click="handleConfirm"
            >
              确定(O)
            </el-button>
            <el-button
              type="success"
              size="default"
              class="action-btn"
              @click="handleOpenReader"
            >
              打开阅读器(R)
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Bell,
  Minus,
  FullScreen,
  Close,
  Message
} from '@element-plus/icons-vue'
import type { ReceivedNotice } from '../types/noticeReceive'
import { NoticeTypeEnum, NoticeTypeNames, NoticeTypeColors } from '../types/noticeReceive'
import { useNotificationStore } from '@/stores/notificationStore'

// ==================== Props & Emits ====================
interface Props {
  modelValue?: boolean
  showMinimize?: boolean
  showMaximize?: boolean
  showClose?: boolean
  alwaysOnTop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  showMinimize: true,
  showMaximize: true,
  showClose: true,
  alwaysOnTop: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'open-reader'): void
  (e: 'close'): void
}>()

// 使用通知Store
const notificationStore = useNotificationStore()

// ==================== 响应式数据 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isMinimized = ref(false)
const isMaximized = ref(false)

// 从Store获取最新通知
const latestNotice = computed(() => notificationStore.latestNotice)

// 拖拽相关
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const popupPosition = ref({ x: 0, y: 0 })

// ==================== 计算属性 ====================
const popupStyle = computed(() => {
  if (isMaximized.value) {
    return {
      width: '100vw',
      height: '100vh',
      top: 0,
      left: 0,
      transform: 'none'
    }
  }
  
  if (isMinimized.value) {
    return {
      width: '200px',
      height: '40px',
      top: 'auto',
      bottom: '20px',
      right: '20px',
      left: 'auto',
      transform: 'none'
    }
  }

  // 默认居中显示
  return {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) translate(${popupPosition.value.x}px, ${popupPosition.value.y}px)`
  }
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
 * 处理确定 - 使用Store标记已读
 */
const handleConfirm = async () => {
  // 标记当前通知为已读
  if (latestNotice.value) {
    await notificationStore.markAsRead(latestNotice.value.id)
  }
  
  visible.value = false
  emit('confirm')
}

/**
 * 处理打开阅读器 - 使用Store标记已读并打开阅读器
 */
const handleOpenReader = async () => {
  // 标记当前通知为已读
  if (latestNotice.value) {
    await notificationStore.markAsRead(latestNotice.value.id)
  }
  
  // 打开阅读器
  notificationStore.showReader()
  
  visible.value = false
  emit('open-reader')
}

/**
 * 处理关闭
 */
const handleClose = () => {
  visible.value = false
  emit('close')
}

/**
 * 处理最小化
 */
const handleMinimize = () => {
  isMinimized.value = !isMinimized.value
  isMaximized.value = false
}

/**
 * 处理最大化
 */
const handleMaximize = () => {
  isMaximized.value = !isMaximized.value
  isMinimized.value = false
}

/**
 * 处理遮罩层点击
 */
const handleOverlayClick = () => {
  // 点击遮罩不关闭，必须点击按钮
}

/**
 * 开始拖拽
 */
const startDrag = (e: MouseEvent) => {
  if (isMaximized.value || isMinimized.value) return
  
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - popupPosition.value.x,
    y: e.clientY - popupPosition.value.y
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

/**
 * 拖拽中
 */
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  popupPosition.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  }
}

/**
 * 停止拖拽
 */
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

/**
 * 键盘事件处理
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (!visible.value) return
  
  // O - 确定
  if (e.key === 'o' || e.key === 'O') {
    handleConfirm()
  }
  // R - 打开阅读器
  else if (e.key === 'r' || e.key === 'R') {
    handleOpenReader()
  }
  // ESC - 关闭
  else if (e.key === 'Escape') {
    handleClose()
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
.notice-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  &.always-on-top {
    z-index: 99999;
  }
}

.notice-popup {
  position: relative;
  width: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;

  &.is-minimized {
    .popup-body,
    .popup-footer {
      display: none;
    }
  }

  &.is-maximized {
    border-radius: 0;
    
    .popup-body {
      height: calc(100vh - 120px);
    }
  }
}

// 标题栏
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: move;
  user-select: none;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .system-icon {
      font-size: 20px;
      color: #fff;
    }

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }

  .header-right {
    display: flex;
    gap: 4px;

    .window-btn {
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

      .el-icon {
        font-size: 14px;
      }
    }
  }
}

// 内容区
.popup-body {
  padding: 40px 24px;
  text-align: center;
  color: #fff;

  .notice-icon {
    font-size: 64px;
    margin-bottom: 20px;
    animation: bounce 1s ease infinite;

    .el-icon {
      color: #ffd700;
      filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
    }
  }

  .notice-text {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .notice-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    backdrop-filter: blur(10px);

    .preview-title {
      font-size: 14px;
      color: #fff;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// 按钮区
.popup-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 24px 30px;

  .action-btn {
    min-width: 120px;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

// 动画
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: all 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
