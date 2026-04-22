/**
 * 录音回放模块 - 播放控制组件
 * @description 录音播放控制面板
 * @version 1.0.0
 */

<template>
  <div class="record-player" v-if="visible">
    <!-- 播放信息 -->
    <div class="player-info">
      <div class="record-title">
        <el-icon class="audio-icon"><Headset /></el-icon>
        <span class="file-name">{{ currentRecord?.fileName || '未选择录音' }}</span>
      </div>
      <div class="time-display">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <span class="time-separator">/</span>
        <span class="total-time">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <el-slider
        v-model="progress"
        :max="100"
        :disabled="!currentRecord"
        @change="handleProgressChange"
        class="progress-slider"
      />
    </div>

    <!-- 控制按钮区 -->
    <div class="controls-section">
      <div class="main-controls">
        <el-button
          circle
          :icon="DArrowLeft"
          @click="handleRewind"
          :disabled="!currentRecord"
          title="快退10秒"
        />
        <el-button
          circle
          type="primary"
          size="large"
          :icon="isPlaying ? VideoPause : VideoPlay"
          @click="handlePlayPause"
          :disabled="!currentRecord"
          class="play-btn"
        />
        <el-button
          circle
          :icon="DArrowRight"
          @click="handleForward"
          :disabled="!currentRecord"
          title="快进10秒"
        />
      </div>

      <div class="volume-controls">
        <el-button
          circle
          :icon="isMuted ? Mute : Microphone"
          @click="handleToggleMute"
          :disabled="!currentRecord"
          class="mute-btn"
        />
        <el-slider
          v-model="volume"
          :max="100"
          :disabled="!currentRecord || isMuted"
          class="volume-slider"
        />
        <span class="volume-text">{{ isMuted ? 0 : volume }}%</span>
      </div>

      <el-button
        type="danger"
        :icon="Close"
        @click="handleClose"
        class="close-btn"
      >
        退出
      </el-button>
    </div>

    <!-- 隐藏的原生音频元素 -->
    <audio
      ref="audioRef"
      :src="audioUrl"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import {
  VideoPlay,
  VideoPause,
  DArrowLeft,
  DArrowRight,
  Microphone,
  Mute,
  Close,
  Headset
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { RecordingRecord } from '../types'

interface Props {
  visible?: boolean
  record?: RecordingRecord | null
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  record: null
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'play-state-change', isPlaying: boolean): void
}>()

// ==================== 响应式数据 ====================
const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(80)
const isMuted = ref(false)
const progress = ref(0)

// ==================== 计算属性 ====================
const currentRecord = computed(() => props.record)

const audioUrl = computed(() => {
  return currentRecord.value?.fileUrl || ''
})

// ==================== 方法 ====================
// 格式化时间
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

// 播放/暂停
const handlePlayPause = () => {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(err => {
      console.error('播放失败:', err)
      ElMessage.error('播放失败，请检查音频文件')
    })
  }
  emit('play-state-change', isPlaying.value)
}

// 快退
const handleRewind = () => {
  if (!audioRef.value) return
  const newTime = Math.max(0, currentTime.value - 10)
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 快进
const handleForward = () => {
  if (!audioRef.value) return
  const newTime = Math.min(duration.value, currentTime.value + 10)
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 进度条变化
const handleProgressChange = (val: number) => {
  if (!audioRef.value || !duration.value) return
  const newTime = (val / 100) * duration.value
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 静音切换
const handleToggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

// 时间更新
const handleTimeUpdate = () => {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100
  }
}

// 元数据加载完成
const handleLoadedMetadata = () => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration || 0
}

// 播放结束
const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  emit('play-state-change', false)
}

// 播放错误
const handleError = () => {
  ElMessage.error('音频加载失败')
  isPlaying.value = false
}

// 关闭
const handleClose = () => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  emit('close')
}

// ==================== 监听 ====================
watch(() => props.record, (newRecord) => {
  if (newRecord) {
    // 重置播放状态
    isPlaying.value = false
    currentTime.value = 0
    progress.value = 0
    duration.value = 0
  }
})

watch(volume, (newVal) => {
  if (audioRef.value) {
    audioRef.value.volume = newVal / 100
  }
})

// ==================== 生命周期 ====================
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})

// 暴露方法
defineExpose({
  play: () => {
    if (!isPlaying.value) {
      handlePlayPause()
    }
  },
  pause: () => {
    if (isPlaying.value) {
      handlePlayPause()
    }
  }
})
</script>

<style scoped lang="scss">
.record-player {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  padding: 16px 20px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  .player-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .record-title {
      display: flex;
      align-items: center;
      gap: 8px;

      .audio-icon {
        font-size: 18px;
        color: #00a8ff;
      }

      .file-name {
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .time-display {
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);

      .current-time {
        color: #00a8ff;
        font-weight: 600;
      }

      .time-separator {
        margin: 0 4px;
      }
    }
  }

  .progress-section {
    margin-bottom: 16px;

    .progress-slider {
      :deep(.el-slider__runway) {
        background-color: rgba(255, 255, 255, 0.2);
      }

      :deep(.el-slider__bar) {
        background-color: #00a8ff;
      }

      :deep(.el-slider__button) {
        border-color: #00a8ff;
        background-color: #00a8ff;
      }
    }
  }

  .controls-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .main-controls {
      display: flex;
      align-items: center;
      gap: 12px;

      .play-btn {
        font-size: 20px;
      }

      .el-button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;

        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        &:disabled {
          opacity: 0.4;
        }
      }
    }

    .volume-controls {
      display: flex;
      align-items: center;
      gap: 8px;

      .mute-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;

        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .volume-slider {
        width: 100px;

        :deep(.el-slider__runway) {
          background-color: rgba(255, 255, 255, 0.2);
        }

        :deep(.el-slider__bar) {
          background-color: #00a8ff;
        }

        :deep(.el-slider__button) {
          border-color: #00a8ff;
          background-color: #00a8ff;
        }
      }

      .volume-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        min-width: 35px;
      }
    }

    .close-btn {
      background: #f56c6c;
      border-color: #f56c6c;

      &:hover {
        background: #f78989;
        border-color: #f78989;
      }
    }
  }
}
</style>
